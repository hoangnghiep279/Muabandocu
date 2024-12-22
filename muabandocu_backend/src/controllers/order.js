const db = require("../config/database");
const crypto = require("crypto");

async function createOrder(
  orders,
  buyerId,
  paymentUrl = null,
  orderIdFromMoMo = null
) {
  try {
    // Kiểm tra giá trị của `orders` và `products` trước khi thực thi
    console.log("Received order data:", orders);
    if (!orders.products || orders.products.length === 0) {
      throw new Error("Không có sản phẩm trong đơn hàng.");
    }

    const [orderResult] = await db.execute("SELECT uuid() AS orderId");
    const orderId = orderResult[0].orderId;

    let orderStatus = 0; // chờ xử lý
    if (orders.payment_method === "momo") {
      orderStatus = -1; // trạng thái "chờ thanh toán"
    } else if (orders.payment_method === "ship") {
      orderStatus = 0; // trạng thái "chờ giao hàng"
    }

    const commissionRate = 0.05; // 5% hoa hồng
    const commission = orders.totalprice * commissionRate;
    const netAmount = orders.totalprice - commission;

    await db.execute(
      `INSERT INTO \`order\` 
        (id, user_id, address_id, status, payment_method, shipfee, totalprice, commission_amount, net_amount, momo_order_id, momo_payment_url,  total_revenue, admin_paid) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?)`,
      [
        orderId,
        buyerId,
        orders.address_id || null,
        orderStatus,
        orders.payment_method || null,
        orders.shipfee || 0,
        orders.totalprice || 0,
        commission,
        netAmount,
        orderIdFromMoMo || null,
        paymentUrl || null,
        orders.totalprice,
        0,
      ]
    );

    const orderItems = [];
    const productIdsToUpdate = [];
    const sellerProducts = {};

    for (const product of orders.products) {
      console.log("Processing product:", product); // Kiểm tra sản phẩm
      const [productResult] = await db.execute(
        "SELECT user_id FROM product WHERE id = ?",
        [product.product_id]
      );
      const productSellerId = productResult[0].user_id;

      if (productSellerId !== product.seller_id) {
        throw new Error(
          `Sản phẩm ID: ${product.product_id} không thuộc về người bán ID: ${product.seller_id}`
        );
      }

      const [orderItemResult] = await db.execute(
        "SELECT uuid() AS orderItemId"
      );
      const orderItemId = orderItemResult[0].orderItemId;

      orderItems.push([
        orderItemId,
        orderId,
        product.product_id,
        product.quantity || 1,
        product.price || 0,
      ]);
      productIdsToUpdate.push(product.product_id);

      if (!sellerProducts[product.seller_id]) {
        sellerProducts[product.seller_id] = [];
      }
      sellerProducts[product.seller_id].push(product.product_id);
    }

    await db.query(
      `INSERT INTO \`order_items\` (\`id\`, \`order_id\`, \`product_id\`, \`quantity\`, \`price\`) VALUES ?`,
      [orderItems]
    );

    if (productIdsToUpdate.length > 0) {
      await db.query("UPDATE product SET approved = 2 WHERE id IN (?)", [
        productIdsToUpdate,
      ]);
    }

    for (const sellerId in sellerProducts) {
      const sellerMessage = `Bạn có một đơn hàng mới cần duyệt cho các sản phẩm ID: ${sellerProducts[
        sellerId
      ].join(", ")}`;
      await db.execute(
        "INSERT INTO `notification` (id, user_id, message, is_read) VALUES (uuid(), ?, ?, 0)",
        [sellerId, sellerMessage]
      );
    }

    const buyerMessage = `Đặt hàng thành công! Mã đơn hàng của bạn là: ${orderId}`;
    await db.execute(
      "INSERT INTO `notification` (id, user_id, message, is_read) VALUES (uuid(), ?, ?, 0)",
      [buyerId, buyerMessage]
    );

    const [cartResult] = await db.execute(
      "SELECT id FROM cart WHERE user_id = ?",
      [buyerId]
    );
    const cartId = cartResult[0]?.id;

    if (cartId) {
      await db.execute("DELETE FROM cartitem WHERE cart_id = ?", [cartId]);
    }

    return {
      code: 201,
      data: {
        orderId,
        message: "Đặt hàng thành công! Thông báo đã được gửi.",
        paymentUrl,
      },
    };
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    throw new Error("Đặt hàng không thành công. Vui lòng thử lại.");
  }
}

module.exports = { createOrder };
