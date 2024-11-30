const db = require("../config/database.js");
const fs = require("fs");
const path = require("path");
const { signToken } = require("../helpers/token.js");
const { validateEmail } = require("../validations/validateEmail");
const { validatePhone } = require("../validations/validatePhone");
const uploadSingleImage = require("../helpers/uploadimg").uploadSingleImage;
async function register(user) {
  try {
    if (!user.name || user.name.trim() === "") {
      const err = new Error("Bạn cần có một cái tên!");
      err.statusCode = 400;
      throw err;
    }

    if (!validateEmail(user.email)) {
      const err = new Error("Email không hợp lệ!");
      err.statusCode = 400;
      throw err;
    }

    const [email] = await db.execute(
      `SELECT email FROM \`user\` WHERE \`email\` = ?`,
      [user.email]
    );

    if (email.length > 0) {
      const err = new Error("Email đã tồn tại!");
      err.statusCode = 401;
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
          \`username\`,
          \`gender\`,
          \`email\`,
          \`password\`,
          \`avatar\`
      )
      VALUES(
        ?,             
        3,              
        ?,              
        ?, 
        0,
        ?, 
        ?,
        'resources/default-avatar.png'
      );`,
      [userId, cartId, user.name, user.email, user.password]
    );

    // Chèn vào bảng `cart`
    await db.execute(
      `INSERT INTO \`cart\`(
        \`id\`,
        \`user_id\`
      ) VALUES(
        ?,              
        ?             
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
        email: rows.email,
        avatar: rows.avatar,
        phone: rows.phone,
        permission: rows.permission_id,
        token,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function getUser(userId) {
  try {
    const [rows] = await db.execute(
      `SELECT
          \`id\`,
          \`name\`,
          \`gender\`,
          \`email\`,
          \`avatar\`,
          \`phone\`,
           \`create_at\`
        FROM
          \`user\` WHERE id = '${userId}'`
    );
    if (rows.length === 0) {
      throw new Error("Người dùng không tồn tại");
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
}
function convertDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

async function updateUser(userId, user, file) {
  try {
    // Kiểm tra các trường thông tin người dùng
    if (user.name == null) {
      const error = new Error("Bạn cần có một cái tên!");
      error.statusCode = 401;
      throw error;
    }

    if (user.phone && !validatePhone(user.phone)) {
      const error = new Error("Số điện thoại không đúng định dạng!");
      error.statusCode = 401;
      throw error;
    }

    const formattedBirthday = user.birthday ? convertDate(user.birthday) : null;

    const [rows] = await db.execute(
      `SELECT \`avatar\` FROM \`user\` WHERE \`id\` = ?`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("Người dùng không tồn tại!");
    }

    const currentAvatar = rows[0].avatar;
    let avatarUrl = currentAvatar;

    if (file) {
      const uploadResult = await uploadSingleImage(file);
      avatarUrl = uploadResult.image;

      if (currentAvatar !== "resources/default-avatar.png") {
        const currentAvatarPath = path.join(__dirname, "../", currentAvatar);

        if (fs.existsSync(currentAvatarPath)) {
          await fs.promises.unlink(currentAvatarPath);
        }
      }
    }
    await db.execute(
      `
      UPDATE \`user\`
      SET
        \`name\` = '${user.name}',
        \`gender\` = ${user.gender ?? null},
        \`birthday\` = ${formattedBirthday ? `'${formattedBirthday}'` : null},
        \`email\` = '${user.email}',
        \`avatar\` = '${avatarUrl}', 
        \`phone\` = ${user.phone ? `'${user.phone}'` : null}
      WHERE \`id\` = '${userId}'
      `
    );

    return {
      code: 200,
      message: "Cập nhật thông tin thành công!",
    };
  } catch (error) {
    throw error;
  }
}

async function changePassword(id, user) {
  try {
    if (user.password == null || user.password == "") {
      const error = new Error("Hãy nhập mật khẩu hiện tại của bạn!");
      error.statusCode = 401;
      throw error;
    }

    if (user.newPassword == null || user.newPassword == "") {
      const error = new Error("Mật khẩu mới không được để trống!");
      error.statusCode = 401;
      throw error;
    }

    let [rows] = await db.execute(
      `SELECT *
          FROM \`user\`
          WHERE \`id\`='${id}'
          AND \`password\`='${user.password}'`
    );

    if (rows == null) {
      const error = new Error("Mật khẩu cũ không chính xác!");
      error.statusCode = 401;
      throw error;
    }

    await db.execute(
      `UPDATE \`user\` 
          SET \`password\`='${user.newPassword}'
          WHERE \`id\` = '${id}';`
    );

    return {
      code: 200,
      message: "Mật khẩu đã được thay đổi!",
    };
  } catch (error) {
    throw error;
  }
}

async function deleteUser(id) {
  try {
    await db.execute(
      `DELETE FROM \`user\`
            WHERE \`id\` = '${id}'`
    );

    return {
      code: 200,
      message: "Đã xoá người dùng khỏi hệ thống!",
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  login,
  register,
  changePassword,
  getUser,
  updateUser,
  deleteUser,
};
