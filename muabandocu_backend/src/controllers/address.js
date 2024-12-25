const db = require("../config/database");
const { validatePhone } = require("../validations/validatePhone");
async function getAddress(userId) {
  try {
    const [result] = await db.execute(
      `SELECT 
        id, 
        user_id, 
        name, 
        phone, 
        address, 
        district, 
        city 
      FROM 
        address 
      WHERE 
        user_id = ?`,
      [userId]
    );

    if (result.length === 0) {
      return {
        code: 404,
        message: "Bạn chưa có địa chỉ nào!",
      };
    }

    return {
      code: 200,
      data: result,
    };
  } catch (error) {
    throw error;
  }
}

async function addAddress(userId, direction) {
  try {
    // Kiểm tra thông tin đầu vào
    if (
      !direction.address ||
      !direction.district ||
      !direction.city ||
      !direction.name ||
      !direction.phone
    ) {
      const err = new Error("Thiếu thông tin địa chỉ, tên hoặc số điện thoại!");
      err.statusCode = 400;
      throw err;
    }

    // Thêm địa chỉ mới
    const [result] = await db.execute(
      `INSERT INTO address (
        id,
        user_id,
        name,
        phone,
        address,
        district,
        city
      )
      VALUES (
        uuid(),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [
        userId,
        direction.name,
        direction.phone,
        direction.address,
        direction.district,
        direction.city,
      ]
    );

    return {
      code: 201,
      message: "Thêm địa chỉ thành công!",
    };
  } catch (error) {
    throw error;
  }
}

async function updateAddress(addressId, address) {
  try {
    // Kiểm tra thông tin đầu vào
    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.district ||
      !address.city
    ) {
      const err = new Error("Thiếu thông tin địa chỉ, tên hoặc số điện thoại!");
      err.statusCode = 400;
      throw err;
    }

    // Cập nhật địa chỉ
    const [result] = await db.execute(
      `UPDATE address
       SET
         name = ?,
         phone = ?,
         address = ?,
         district = ?,
         city = ?
       WHERE id = ?`,
      [
        address.name,
        address.phone,
        address.address,
        address.district,
        address.city,
        addressId,
      ]
    );

    if (result.affectedRows === 0) {
      const err = new Error("Không tìm thấy địa chỉ để cập nhật!");
      err.statusCode = 404;
      throw err;
    }

    return {
      code: 200,
      message: "Cập nhật địa chỉ thành công!",
    };
  } catch (error) {
    throw error;
  }
}

async function deleteAddress(userId, addressId) {
  try {
    const [result] = await db.execute(
      `DELETE FROM address WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (result.affectedRows === 0) {
      const err = new Error("Không tìm thấy địa chỉ để xóa!");
      err.statusCode = 404;
      throw err;
    }

    return {
      code: 200,
      message: "Xóa địa chỉ thành công!",
    };
  } catch (error) {
    console.error("Lỗi trong deleteAddress:", error.message);
    throw error;
  }
}
module.exports = { getAddress, addAddress, updateAddress, deleteAddress };
