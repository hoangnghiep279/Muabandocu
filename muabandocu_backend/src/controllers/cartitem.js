const db = require("../config/database");

async function getCartItems(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const [cartResult] = await db.execute(
      "SELECT id FROM cart WHERE user_id = ?",
      [userId]
    );

    if (cartResult.length === 0) {
      const err = new Error("Không tìm thấy giỏ hàng!");
      err.statusCode = 404;
      throw err;
    }

    const cartId = cartResult[0].id;

    const [cartItems] = await db.execute(
      `SELECT 
        c.id AS cartitem_id,
        p.id AS product_id,
        p.category_id,
        p.title,
        p.price,
        p.description,
        p.quantity AS product_quantity,
        p.warranty,
        p.shipfee,
        p.status,
        p.approved,
        c.quantity AS cart_quantity,
        c.created_at AS cart_created_at,
        GROUP_CONCAT(img.img_url) AS product_images,
        ca.name AS category_name
      FROM 
        cartitem c
      JOIN 
        product p ON c.product_id = p.id
      LEFT JOIN 
        image img ON p.id = img.product_id
      LEFT JOIN 
        category ca ON p.category_id = ca.id
      
      WHERE 
        c.cart_id = ?
      GROUP BY 
        c.id, p.id
      LIMIT ? OFFSET ?`,
      [cartId, limit, offset]
    );

    const [totalItems] = await db.execute(
      `SELECT COUNT(*) AS total FROM cartitem WHERE cart_id = ?`,
      [cartId]
    );

    const total = totalItems[0].total;

    return {
      cartItems: cartItems.map((item) => ({
        ...item,
        product_images: item.product_images
          ? item.product_images.split(",")
          : [],
      })),
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
      totalItems: total,
    };
  } catch (error) {
    console.error("Lỗi trong getCartItems:", error.message);
    throw error;
  }
}

async function insertCartItem(userId, product) {
  try {
    if (
      !product.product_id ||
      typeof product.quantity !== "number" ||
      product.quantity <= 0
    ) {
      const err = new Error("Thông tin sản phẩm không hợp lệ!");
      err.statusCode = 400;
      throw err;
    }

    // Kiểm tra sản phẩm thuộc về ai
    const [productOwnerResult] = await db.execute(
      "SELECT user_id FROM product WHERE id = ?",
      [product.product_id]
    );

    if (productOwnerResult.length === 0) {
      const err = new Error("Sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    const productOwnerId = productOwnerResult[0].user_id;

    if (productOwnerId === userId) {
      return {
        code: 403,
        message: "Bạn không thể thêm sản phẩm của chính mình vào giỏ hàng!",
      };
    }

    const [cartResult] = await db.execute(
      "SELECT id FROM cart WHERE user_id = ?",
      [userId]
    );

    if (cartResult.length === 0) {
      const err = new Error("Không tìm thấy giỏ hàng!");
      err.statusCode = 404;
      throw err;
    }

    const cartId = cartResult[0].id;

    const [cartItemResult] = await db.execute(
      "SELECT id FROM cartitem WHERE cart_id = ? AND product_id = ?",
      [cartId, product.product_id]
    );

    if (cartItemResult.length > 0) {
      return {
        code: 200,
        message: "Sản phẩm đã có trong giỏ hàng!",
      };
    } else {
      await db.execute(
        "INSERT INTO cartitem (id, cart_id, product_id, quantity) VALUES (uuid(), ?, ?, ?)",
        [cartId, product.product_id, 1]
      );
      return {
        code: 201,
        message: "Thêm sản phẩm vào giỏ hàng thành công!",
      };
    }
  } catch (error) {
    console.error("Lỗi trong insertCartItem:", error.message);
    throw error;
  }
}

async function deleteCartItem(userId, cartItemId) {
  try {
    // Kiểm tra giỏ hàng của người dùng
    const [cartResult] = await db.execute(
      "SELECT id FROM cart WHERE user_id = ?",
      [userId]
    );

    if (!cartResult || cartResult.length === 0) {
      const err = new Error("Không tìm thấy giỏ hàng!");
      err.statusCode = 404;
      throw err;
    }

    const cartId = cartResult[0].id;

    // Kiểm tra sản phẩm trong giỏ hàng
    const [cartItemResult] = await db.execute(
      "SELECT id FROM cartitem WHERE id = ? AND cart_id = ?",
      [cartItemId, cartId]
    );

    if (!cartItemResult || cartItemResult.length === 0) {
      const err = new Error("Sản phẩm không tồn tại trong giỏ hàng!");
      err.statusCode = 404;
      throw err;
    }

    // Xóa sản phẩm khỏi giỏ hàng
    const [deleteResult] = await db.execute(
      "DELETE FROM cartitem WHERE id = ?",
      [cartItemId]
    );

    if (deleteResult.affectedRows === 0) {
      const err = new Error("Không thể xóa sản phẩm. Vui lòng thử lại!");
      err.statusCode = 500;
      throw err;
    }

    return {
      code: 200,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
    };
  } catch (error) {
    console.error("Lỗi trong deleteCartItem:", error.message);
    throw error;
  }
}

module.exports = { getCartItems, insertCartItem, deleteCartItem };
