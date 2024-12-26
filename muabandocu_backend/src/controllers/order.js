const db = require("../config/database");

const getProductsByOrderStatus = async (status, userId) => {
  try {
    // Truy vấn đơn hàng
    const [orders] = await db.execute(
      `
      SELECT
        o.id AS order_id,
        o.shipfee,
        o.totalprice
      FROM
        \`order\` AS o
      WHERE
        o.user_id = ?;
    `,
      [userId]
    );

    if (orders.length === 0) {
      return {
        success: false,
        message: "No orders found",
      };
    }

    // Lấy danh sách order_id
    const orderIds = orders.map((order) => order.order_id);

    const orderIdsString = orderIds.map((id) => `'${id}'`).join(", ");

    // Truy vấn sản phẩm
    const [orderItems] = await db.execute(
      `
      SELECT
        oi.order_id,
        oi.id,
        p.id AS product_id,
        p.title AS product_name,
        p.price AS product_price,
        p.shipfee AS product_shipfee
      FROM
        order_items AS oi
      JOIN
        product AS p
      ON
        oi.product_id = p.id
      WHERE
        oi.delivery_status = '${status}' AND oi.order_id IN (${orderIdsString});
      `
    );

    // Truy vấn hình ảnh nếu có sản phẩm
    let images = [];
    if (orderItems.length > 0) {
      const productIds = orderItems.map((item) => item.product_id);
      const productIdsString = productIds.map((id) => `'${id}'`).join(", ");

      [images] = await db.execute(
        `
        SELECT
          product_id,
          img_url
        FROM
          image
        WHERE
          product_id IN (${productIdsString});
        `
      );
    }

    // Ghép thông tin
    const results = orders
      .map((order) => {
        const products = orderItems
          .filter((item) => item.order_id === order.order_id)
          .map((item) => ({
            order_item_id: item.id,
            product_name: item.product_name,
            product_price: item.product_price,
            product_shipfee: item.product_shipfee,
            images: images
              .filter((img) => img.product_id === item.product_id)
              .map((img) => img.img_url),
          }));

        // Chỉ trả về các đơn hàng có sản phẩm
        if (products.length === 0) {
          return null;
        }

        return {
          order_id: order.order_id,
          shipfee: order.shipfee,
          totalprice: order.totalprice,
          products,
        };
      })
      .filter((order) => order !== null); // Loại bỏ các đơn hàng không có sản phẩm

    return {
      success: "true",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

const getPendingOrders = async (sellerId) => {
  try {
    const query = `
      SELECT 
          oi.id AS order_item_id,
          p.title AS product_name,
          p.price AS product_price,
          p.shipfee AS shipping_fee,
          MIN(i.img_url) AS product_image, 
          o.address_id,
          o.created_at,
          a.name AS customer_name,
          a.phone AS customer_phone,
          a.address AS customer_address,
          a.district AS customer_district,
          a.city AS customer_city
      FROM 
          order_items oi
      JOIN 
          product p ON oi.product_id = p.id
      LEFT JOIN 
          image i ON p.id = i.product_id
      JOIN 
          \`order\` o ON oi.order_id = o.id
      JOIN 
          address a ON o.address_id = a.id
      WHERE 
          oi.seller_id = ? 
          AND oi.delivery_status IN (0, 1)
      GROUP BY 
          oi.id; -- Nhóm theo từng mục đơn hàng
    `;
    const [pendingOrders] = await db.query(query, [sellerId]);

    if (pendingOrders.length === 0) {
      return { message: "Bạn chưa bán được sản phẩm nào." };
    }

    return pendingOrders;
  } catch (error) {
    throw error;
  }
};

const getProcessedOrders = async (sellerId) => {
  try {
    const query = `
      SELECT 
          oi.id AS order_item_id,
          oi.delivery_status,
          p.title AS product_name,
          p.price AS product_price,
          p.shipfee AS shipping_fee,
          MIN(i.img_url) AS product_image, 
          o.address_id,
          o.created_at,
          a.name AS customer_name,
          a.phone AS customer_phone,
          a.address AS customer_address,
          a.district AS customer_district,
          a.city AS customer_city
      FROM 
          order_items oi
      JOIN 
          product p ON oi.product_id = p.id
      LEFT JOIN 
          image i ON p.id = i.product_id
      JOIN 
          \`order\` o ON oi.order_id = o.id
      JOIN 
          address a ON o.address_id = a.id
      WHERE 
          oi.seller_id = ? 
          AND oi.delivery_status IN (2, 3) -- Điều kiện delivery_status bằng 2 hoặc 3
      GROUP BY 
          oi.id; -- Nhóm theo từng mục đơn hàng
    `;
    const [processedOrders] = await db.query(query, [sellerId]);

    if (processedOrders.length === 0) {
      return { message: "Không có đơn hàng nào đang xử lý hoặc đã xử lý." };
    }

    return processedOrders;
  } catch (error) {
    throw error;
  }
};

const approveOrderItem = async (orderItemId, newStatus) => {
  try {
    // Kiểm tra xem order_item có tồn tại không
    const [existingOrderItem] = await db.query(
      `
      SELECT oi.id
      FROM order_items AS oi
      WHERE oi.id = ?;
      `,
      [orderItemId]
    );

    if (!existingOrderItem) {
      throw new Error("Order item does not exist.");
    }

    // Cập nhật trạng thái của order_item
    const [result] = await db.query(
      `
      UPDATE order_items 
      SET delivery_status = ? 
      WHERE id = ?;
      `,
      [newStatus, orderItemId]
    );

    return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
  } catch (error) {
    throw error;
  }
};

async function createOrder(
  orders,
  buyerId,
  paymentUrl = null,
  orderIdFromMoMo = null
) {
  try {
    // Kiểm tra giá trị của `orders` và `products` trước khi thực thi
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
    const commission =
      Math.round(orders.totalprice * commissionRate * 100) / 100;
    const netAmount = Math.round((orders.totalprice - commission) * 100) / 100;
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
        productSellerId,
        0,
      ]);
      productIdsToUpdate.push(product.product_id);

      if (!sellerProducts[product.seller_id]) {
        sellerProducts[product.seller_id] = [];
      }
      sellerProducts[product.seller_id].push(product.product_id);
    }

    await db.query(
      `INSERT INTO \`order_items\` 
      (\`id\`, \`order_id\`, \`product_id\`, \`quantity\`, \`price\`, \`seller_id\`, \`delivery_status\`) 
    VALUES ?`,
      [orderItems]
    );

    if (productIdsToUpdate.length > 0 && !orders.payment_method === "momo") {
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

// huy don
const cancelOrder = async (orderId) => {
  try {
    // Kiểm tra xem đơn hàng có tồn tại không
    const [orderCheck] = await db.execute(
      "SELECT * FROM `order` WHERE id = ?",
      [orderId]
    );

    if (orderCheck.length === 0) {
      throw new Error("Đơn hàng không tồn tại");
    }

    const orderRecord = orderCheck[0];

    // Kiểm tra xem trạng thái đơn hàng có phải là "chờ xử lý" hoặc "chờ giao hàng" hay không
    if (orderRecord.status !== 0 && orderRecord.status !== -1) {
      throw new Error("Không thể hủy đơn hàng đã xử lý hoặc giao hàng");
    }

    // Xóa các sản phẩm trong đơn hàng
    await db.execute("DELETE FROM `order_items` WHERE order_id = ?", [orderId]);

    // Cập nhật lại trạng thái sản phẩm về "sẵn sàng bán" (ví dụ: approved = 1)
    const [orderItems] = await db.execute(
      "SELECT product_id FROM `order_items` WHERE order_id = ?",
      [orderId]
    );

    const productIdsToUpdate = orderItems.map((item) => item.product_id);

    if (productIdsToUpdate.length > 0) {
      await db.query("UPDATE product SET approved = 1 WHERE id IN (?)", [
        productIdsToUpdate,
      ]);
    }

    // Xóa đơn hàng
    await db.execute("DELETE FROM `order` WHERE id = ?", [orderId]);

    return { success: true, message: "Đơn hàng đã được hủy thành công" };
  } catch (error) {
    throw new Error(`Lỗi hủy đơn hàng: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  getProductsByOrderStatus,
  getProcessedOrders,
  getPendingOrders,
  approveOrderItem,
  cancelOrder,
};
