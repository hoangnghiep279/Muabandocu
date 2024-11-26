const db = require("../config/database.js");

async function getCategory() {
  try {
    const [rows] = await db.execute("SELECT * FROM `category`");
    return {
      code: 200,
      data: rows,
    };
  } catch (error) {
    throw error;
  }
}

async function insertCategory(cate) {
  try {
    if (!cate.name || cate.name.trim() === "") {
      const err = new Error("Tên loại sản phẩm không được để trống!");
      err.statusCode = 400;
      throw err;
    }
    const [existingName] = await db.execute(
      `SELECT name FROM category WHERE name = '${cate.name}'`
    );
    if (existingName.length > 0) {
      const err = new Error("Loại sản phẩm này đã có trong hệ thống!");
      err.statusCode = 401;
      throw err;
    }

    await db.execute(
      `INSERT INTO \`category\`(\`id\`, \`name\`)
        VALUES(uuid(), '${cate.name}')`
    );
    return {
      code: 200,
      message: "Thêm loại sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}
async function updateCategory(id, cate) {
  try {
    if (!cate.name || cate.name.trim() === "") {
      const err = new Error("Tên loại sản phẩm không được để trống!");
      err.statusCode = 400;
      throw err;
    }

    const [existingCategory] = await db.execute(
      `SELECT * FROM category WHERE id = '${id}'`
    );

    if (existingCategory.length === 0) {
      const err = new Error("Loại sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    const [duplicateName] = await db.execute(
      `SELECT * FROM category WHERE name = ? AND id != ?`,
      [cate.name, id]
    );

    if (duplicateName.length > 0) {
      const err = new Error("Tên loại sản phẩm đã tồn tại!");
      err.statusCode = 409;
      throw err;
    }

    // Cập nhật loại sản phẩm
    await db.execute(
      `UPDATE category SET name = '${cate.name}' WHERE id = '${id}'`
    );

    return {
      code: 200,
      message: "Cập nhật loại sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}

async function deleteCategory(id) {
  try {
    const [existingCategory] = await db.execute(
      `SELECT * FROM category WHERE id = '${id}'`
    );

    if (existingCategory.length === 0) {
      const err = new Error("Loại sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    // Xóa loại sản phẩm
    await db.execute(`DELETE FROM category WHERE id ='${id}'`);

    return {
      code: 200,
      message: "Xóa loại sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
};
