const db = require("../config/database");

async function getAddress(userId) {
  try {
    const [result] = await db.execute(
      `SELECT
        a.id,
        a.user_id,
        a.address,
        a.district,
        a.city,
        u.name AS user_name,
        u.phone AS user_phone
      FROM
        address a
      JOIN
        user u ON a.user_id = u.id
      WHERE
        a.user_id = ?`,
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
    if (!direction.address || !direction.district || !direction.city) {
      const err = new Error("Thiếu thông tin địa chỉ hoặc không hợp lệ!");
      err.statusCode = 400;
      throw err;
    }
    const [result] = await db.execute(
      `INSERT INTO address (
                  id,
                  user_id,
                  address,
                  district,
                  city
              )
              VALUES (
                  uuid(),
                  ?,
                  ?,
                  ?,
                  ?
              )`,
      [userId, direction.address, direction.district, direction.city]
    );
    return {
      code: 201,
      message: "Thêm địa chỉ thành công!",
      addressId: result.insertId,
    };
  } catch (error) {
    throw error;
  }
}
async function updateAddress(addressId, address) {
  try {
    if (!address.address || !address.district || !address.city) {
      const err = new Error("Thiếu thông tin địa chỉ hoặc không hợp lệ!");
      err.statusCode = 400;
      throw err;
    }

    const [result] = await db.execute(
      `UPDATE
            address
         SET
            address = '${address.address}',
            district = '${address.district}',
            city = '${address.city}'
         WHERE id = '${addressId}' `
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
