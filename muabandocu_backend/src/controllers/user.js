const db = require("../config/database.js");
const jwt = require("jsonwebtoken");
const { signToken } = require("../helpers/token.js");
const { validateEmail } = require("../validations/validateEmail");
const { validatePhone } = require("../validations/validatePhone");
async function login(user) {
  try {
    const [[rows]] = await db.execute(
      `SELECT * FROM \`user\` WHERE \`email\` = ? AND \`password\` = ?`,
      [user.email, user.password]
    );

    if (rows == null) {
      const error = new Error(
        "Thông tin tài khoản hoặc mật khẩu không chính xác!"
      );
      error.statusCode = 401;
      throw error;
    }

    const id = rows.id;
    const token = await signToken(id);
    return {
      code: 200,
      data: {
        id: rows.id,
        cart: rows.cart_id,
        name: rows.name,
        gender: rows.gender,
        birthday: rows.birthday,
        email: rows.email,
        avatar: rows.avatar,
        phone: rows.phone,
        permission: rows.permission,
        token,
      },
    };
  } catch (error) {
    throw error;
  }
}
async function register(user) {
  try {
    if (!validateEmail(user.email)) {
      const err = new Error("Email không hợp lệ!");
      err.statusCode = 400;
      throw err;
    }

    // Kiểm tra xem email đã tồn tại chưa
    const [email] = await db.execute(
      `SELECT email FROM \`user\` WHERE \`email\` = ?`,
      [user.email]
    );

    if (email.length > 0) {
      const err = new Error("Email đã tồn tại!");
      err.statusCode = 401;
      throw err;
    }

    // Kiểm tra tên người dùng
    if (!user.name || user.name.trim() === "") {
      const err = new Error("Bạn cần có một cái tên!");
      err.statusCode = 400;
      throw err;
    }

    await db.execute("START TRANSACTION");

    // Tạo `user_id` và `cart_id`
    const [userIdResult] = await db.execute("SELECT uuid() AS userId");
    const userId = userIdResult[0].userId;
    const [cartIdResult] = await db.execute("SELECT uuid() AS cartId");
    const cartId = cartIdResult[0].cartId;

    // Chèn vào bảng `user`
    await db.execute(
      `INSERT INTO \`user\`(
        \`id\`,
        \`permission_id\`,
        \`cart_id\`,
        \`name\`,
        \`email\`,
        \`password\`,
        \`avatar\`
      ) VALUES(
        ?,              -- id (sử dụng userId đã tạo)
        2,              -- permission_id
        ?,              -- cart_id (sử dụng cartId đã tạo)
        ?, 
        ?, 
        ?, 
        '/resources/default-avatar.png'
      );`,
      [userId, cartId, user.name, user.email, user.password]
    );

    // Chèn vào bảng `cart`
    await db.execute(
      `INSERT INTO \`cart\`(
        \`id\`,
        \`user_id\`
      ) VALUES(
        ?,              -- id của cart (sử dụng cartId đã tạo)
        ?               -- user_id (sử dụng userId đã tạo)
      );`,
      [cartId, userId]
    );

    await db.execute("COMMIT");

    return {
      code: 200,
      message: "Đăng ký tài khoản thành công!",
    };
  } catch (error) {
    await db.execute("ROLLBACK");
    throw error;
  }
}

module.exports = { login, register };
