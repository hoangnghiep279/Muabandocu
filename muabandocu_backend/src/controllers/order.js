// controllers/orderController.js
const db = require("../config/database");

async function createOrder(
  orders,
  buyerId,
  paymentUrl = null,
  orderIdFromMoMo = null
) {
  try {
    const [orderResult] = await db.execute("SELECT uuid() AS orderId");
    const orderId = orderResult[0].orderId;

    let orderStatus = 0; //chờ xử lý

    if (orders.payment_method === "momo") {
      orderStatus = 1; //chờ thanh toán MoMo
    }

    // Tạo đơn hàng
    await db.execute(
      "INSERT INTO `order` (id, user_id, address_id, status, payment_method, shipfee, totalprice, momo_order_id, momo_payment_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        orderId,
        buyerId,
        orders.address_id,
        orderStatus,
        orders.payment_method,
        orders.shipfee,
        orders.totalprice,
        orderIdFromMoMo || null,
        paymentUrl || null,
      ]
    );

    // Tạo các sản phẩm trong đơn hàng với ID riêng cho mỗi sản phẩm
    const orderItems = [];
    const sellerProducts = {}; //nhóm sản phẩm theo người bán

    for (const product of orders.products) {
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
        product.quantity,
        product.price,
      ]);

      // Nhóm sản phẩm theo người bán
      if (!sellerProducts[product.seller_id]) {
        sellerProducts[product.seller_id] = [];
      }
      sellerProducts[product.seller_id].push(product.product_id);
    }

    await db.query(
      `INSERT INTO \`order_items\` (\`id\`, \`order_id\`, \`product_id\`, \`quantity\`, \`price\`) VALUES ?`,
      [orderItems]
    );

    // Tạo thông báo
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

    return {
      code: 201,
      data: {
        orderId,
        message: "Đặt hàng thành công! Thông báo đã được gửi.",
        paymentUrl,
      },
    };
  } catch (error) {
    throw error;
  }
}

module.exports = { createOrder };
