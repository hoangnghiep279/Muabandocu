const db = require("../config/database");

const getRevenueSellerByTime = async (sellerId, month, year) => {
  try {
    const query = `
      SELECT 
        MONTH(created_at) AS month, 
        YEAR(created_at) AS year, 
        SUM(quantity * price) AS totalRevenue, 
        SUM(quantity) AS totalQuantity 
      FROM order_items 
      WHERE seller_id = ? AND delivery_status = 3
      ${month ? "AND MONTH(created_at) = ?" : ""}
      ${year ? "AND YEAR(created_at) = ?" : ""}
      GROUP BY month, year
      ORDER BY year DESC, month DESC
    `;

    const params = [sellerId];
    if (month) params.push(month);
    if (year) params.push(year);

    const [rows] = await db.execute(query, params);

    return rows.length > 0 ? rows : [];
  } catch (error) {
    throw error;
  }
};
const getRevenueAdminByTime = async (month, year) => {
  try {
    const params = []; // Khởi tạo mảng params
    let query = `
      SELECT 
        MONTH(created_at) AS month, 
        YEAR(created_at) AS year, 
        SUM(quantity * price) AS totalRevenue, 
        SUM(quantity) AS totalQuantity 
      FROM order_items 
      WHERE delivery_status = 3
    `;

    // Thêm điều kiện động
    if (month) {
      query += " AND MONTH(created_at) = ?";
      params.push(month);
    }
    if (year) {
      query += " AND YEAR(created_at) = ?";
      params.push(year);
    }

    query += " GROUP BY month, year ORDER BY year DESC, month DESC";

    // Thực thi truy vấn
    const [rows] = await db.execute(query, params);

    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error in getRevenueAdminByTime:", error);
    throw error;
  }
};

const getOrdersWithCod = async (sellerId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const [orderRows] = await db.execute(
      `
      SELECT 
        oi.id AS order_item_id,
        p.title AS product_name,
        u.name AS buyer_name,
        oi.price AS product_price,
        p.shipfee AS shipping_fee,
        i.img_url AS product_image
      FROM order_items AS oi
      JOIN \`order\` AS o ON oi.order_id = o.id
      JOIN product AS p ON oi.product_id = p.id
      JOIN image AS i ON p.id = i.product_id
      JOIN user AS u ON o.user_id = u.id
      WHERE 
        oi.seller_id = ? AND 
        oi.delivery_status = 3 AND 
        o.payment_method = 'cod' AND 
        oi.pay_admin = 0
      GROUP BY oi.id
      LIMIT ? OFFSET ?
    `,
      [sellerId, limit, offset]
    );

    const [totalResult] = await db.execute(
      `
      SELECT COUNT(DISTINCT oi.id) AS total
      FROM order_items AS oi
      JOIN \`order\` AS o ON oi.order_id = o.id
      WHERE 
        oi.seller_id = ? AND 
        oi.delivery_status = 3 AND 
        o.payment_method = 'cod'
    `,
      [sellerId]
    );

    const total = totalResult[0].total || "Không có đơn hàng nào";

    return {
      code: 200,
      data: orderRows,
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi trong hàm getOrdersWithCod:", error);
    throw new Error("Lỗi khi lấy danh sách đơn hàng.");
  }
};
const revenueAdmin = async () => {
  try {
    const [rows] = await db.execute("SELECT commission_amount FROM `order`");

    return {
      code: 200,
      data: rows.length > 0 ? rows : [],
    };
  } catch (error) {
    console.error("Lỗi truy vấn doanh thu admin:", error.message);
    throw error;
  }
};

const updatePayAdminStatus = async (orderItemId) => {
  try {
    const [rows] = await db.execute("SELECT * FROM order_items WHERE id = ?", [
      orderItemId,
    ]);

    if (rows.length === 0) {
      console.error("Không tìm thấy orderItemId:", orderItemId); // Ghi log lỗi
      return {
        code: 400,
        message: "Không có sản phẩm trong đơn hàng.",
      };
    }

    await db.execute("UPDATE order_items SET pay_admin = 1 WHERE id = ?", [
      orderItemId,
    ]);

    return {
      code: 200,
      message: "Thanh toán thành công",
    };
  } catch (error) {
    console.error("Lỗi trong updatePayAdminStatus:", error);
    throw error;
  }
};
const updatePaySellerStatus = async (orderItemId) => {
  try {
    const [rows] = await db.execute("SELECT * FROM order_items WHERE id = ?", [
      orderItemId,
    ]);

    if (rows.length === 0) {
      console.error("Không tìm thấy orderItemId:", orderItemId); // Ghi log lỗi
      return {
        code: 400,
        message: "Không có sản phẩm trong đơn hàng.",
      };
    }

    await db.execute("UPDATE order_items SET pay_seller = 1 WHERE id = ?", [
      orderItemId,
    ]);

    return {
      code: 200,
      message: "Thanh toán thành công",
    };
  } catch (error) {
    console.error("Lỗi trong updatePayAdminStatus:", error);
    throw error;
  }
};

const getProductOrderWithMoMo = async () => {
  try {
    const [rows] = await db.execute(`
      SELECT 
          oi.id AS order_item_id,
          p.title AS product_name,
          MIN(i.img_url) AS product_image, -- Lấy ảnh đầu tiên (hoặc ảnh nhỏ nhất theo thứ tự)
          oi.price AS product_price,
          o.shipfee AS shipping_fee,
          o.totalprice AS total_price,
          u.name AS user_name, -- Thêm tên người dùng
          u.momo_account AS momo_account 
      FROM 
          order_items oi
      JOIN 
          \`order\` o ON oi.order_id = o.id
      JOIN 
          user u ON o.user_id = u.id -- Kết nối với bảng users để lấy tên người dùng
      JOIN 
          product p ON oi.product_id = p.id
      LEFT JOIN 
          image i ON p.id = i.product_id
      WHERE 
          oi.delivery_status = 3 
          AND o.payment_method = 'momo' 
          AND oi.pay_seller = 0
      GROUP BY 
          oi.id, p.title, oi.price, o.shipfee, o.totalprice, u.name, u.momo_account;
    `);

    return {
      code: 200,
      data: rows,
    };
  } catch (error) {
    throw new Error("Lỗi truy vấn dữ liệu: " + error.message);
  }
};

const getPaymentWithCod = async () => {
  try {
    const [rows] = await db.execute(`
      SELECT 
          oi.id AS order_item_id,
          p.id AS product_id,
          p.title AS product_name,
          u.name AS seller_name,
          u.avatar AS seller_avatar,
          oi.price AS product_price,
          o.shipfee AS shipping_fee,
          oi.pay_admin AS pay_admin
      FROM 
          order_items oi
      JOIN 
          \`order\` o ON oi.order_id = o.id
      JOIN 
          product p ON oi.product_id = p.id
      JOIN 
          user u ON oi.seller_id = u.id
      WHERE 
          oi.delivery_status = 3 
          AND o.payment_method = 'cod' 
          AND oi.pay_admin IN (0, 1); -- Điều kiện lấy cả giá trị 0 và 1
    `);

    return {
      code: 200,
      data: rows,
    };
  } catch (error) {
    throw new Error("Lỗi truy vấn dữ liệu: " + error.message);
  }
};
const getPaymentWithMomo = async (userId) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
          oi.id AS order_item_id,
          p.id AS product_id,
          p.title AS product_name,
          u.name AS seller_name,
          u.avatar AS seller_avatar,
          oi.price AS product_price,
          o.shipfee AS shipping_fee,
          oi.pay_seller AS pay_seller
      FROM 
          order_items oi
      JOIN 
          \`order\` o ON oi.order_id = o.id
      JOIN 
          product p ON oi.product_id = p.id
      JOIN 
          user u ON oi.seller_id = u.id
      WHERE 
          oi.delivery_status = 3 
          AND o.payment_method = 'momo' 
          AND oi.pay_seller IN (0, 1)
         AND oi.seller_id = '${userId}';
    `);

    return {
      code: 200,
      data: rows,
    };
  } catch (error) {
    throw new Error("Lỗi truy vấn dữ liệu: " + error.message);
  }
};

module.exports = {
  getRevenueSellerByTime,
  getRevenueAdminByTime,
  getOrdersWithCod,
  getPaymentWithMomo,
  revenueAdmin,
  getProductOrderWithMoMo,
  getPaymentWithCod,
  updatePayAdminStatus,
  updatePaySellerStatus,
};
