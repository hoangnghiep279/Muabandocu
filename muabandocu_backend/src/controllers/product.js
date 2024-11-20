const db = require("../config/database.js");
const path = require("path");
const uploadMultipleImages =
  require("../helpers/uploadimg").uploadMultipleImages;
async function getProducts() {
  try {
    const [productRows] = await db.execute(
      `SELECT
        \`id\`,
        \`user_id\`,
        \`title\`,
        \`description\`,
        \`price\`,
        \`status\`
      FROM
          \`product\`
      `
    );
    const [imageRows] = await db.execute(
      `SELECT product_id, img_url 
       FROM image`
    );
    const products = productRows.map((product) => {
      const images = imageRows.filter(
        (image) => image.product_id === product.id
      );
      return {
        ...product,
        image: images,
      };
    });

    return {
      code: 200,
      data: products,
    };
  } catch (error) {
    throw error;
  }
}
// them san pham
async function insertProduct(products, files) {
  try {
    // Kiểm tra xem tên sản phẩm đã tồn tại chưa
    const [ExistingTitle] = await db.execute(
      `SELECT title FROM product WHERE title = ?`,
      [products.title]
    );
    if (ExistingTitle.length > 0) {
      const err = new Error("Tên sản phẩm đã có trong hệ thống!");
      err.statusCode = 401;
      throw err;
    }

    // Tạo ID cho sản phẩm
    const [productResult] = await db.execute("SELECT uuid() AS productId");
    const productId = productResult[0].productId;

    // Thêm sản phẩm vào bảng product
    await db.execute(
      `INSERT INTO \`product\` (\`id\`, \`user_id\`, \`title\`, \`description\`, \`price\`,\`quantity\`, \`status\`) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        productId,
        products.userId,
        products.title,
        products.description,
        products.price,
        products.quantity,
      ]
    );

    // Upload ảnh và lấy danh sách URL
    if (files && files.length > 0) {
      const uploadResult = await uploadMultipleImages(files);
      const imageUrls = uploadResult.images;

      // Lưu đường dẫn ảnh vào bảng image
      const imageInserts = imageUrls.map((imageUrl) => {
        return db.execute(
          `INSERT INTO \`image\` (\`id\`, \`product_id\`, \`img_url\`)
               VALUES (uuid(), ?, ?)`,
          [productId, imageUrl]
        );
      });
      // Thực hiện tất cả các truy vấn ảnh đồng thời
      await Promise.all(imageInserts);
    }

    return {
      code: 200,
      message: "Thêm sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}
async function updateProduct(productId, product, files) {
  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const [existingProduct] = await db.execute(
      `SELECT id FROM product WHERE id = ?`,
      [productId]
    );
    if (existingProduct.length === 0) {
      const err = new Error("Sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    // Cập nhật thông tin sản phẩm trong bảng product
    await db.execute(
      `UPDATE product 
       SET title = ?, description = ?, price = ?,quantity = ?, status = ? 
       WHERE id = ?`,
      [
        product.title,
        product.description,
        product.price,
        product.quantity,
        product.status || 1,
        productId,
      ]
    );

    // Nếu có upload ảnh mới, thực hiện cập nhật ảnh
    if (files && files.length > 0) {
      await db.execute(`DELETE FROM image WHERE product_id = ?`, [productId]);

      // Upload ảnh mới và lưu đường dẫn
      const uploadResult = await uploadMultipleImages(files);
      const imageUrls = uploadResult.images;

      // Lưu đường dẫn ảnh mới vào bảng image
      const imageInserts = imageUrls.map((imageUrl) => {
        return db.execute(
          `INSERT INTO image (id, product_id, img_url) 
           VALUES (uuid(), ?, ?)`,
          [productId, imageUrl]
        );
      });
      await Promise.all(imageInserts);
    }

    return {
      code: 200,
      message: "Cập nhật sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}
async function getDetailProduct(productId) {
  try {
    // Truy vấn thông tin sản phẩm
    const [productRows] = await db.execute(
      `SELECT 
         p.id AS product_id, 
         p.user_id, 
         p.title, 
         p.description, 
         p.price,
         p.quantity, 
         p.status, 
         u.name AS seller_name, 
         u.avatar AS seller_avatar 
       FROM 
         product p 
       JOIN 
         user u 
       ON 
         p.user_id = u.id 
       WHERE 
         p.id = ?`,
      [productId]
    );

    // Kiểm tra nếu sản phẩm không tồn tại
    if (productRows.length === 0) {
      const err = new Error("Sản phẩm không tồn tại.");
      err.statusCode = 404;
      throw err;
    }

    // Kiểm tra nếu sản phẩm không tồn tại
    if (productRows.length === 0) {
      const err = new Error("Sản phẩm không tồn tại.");
      err.statusCode = 404;
      throw err;
    }

    // Truy vấn các ảnh của sản phẩm
    const [imageRows] = await db.execute(
      `SELECT img_url 
       FROM image 
       WHERE product_id = ?`,
      [productId]
    );

    const product = {
      ...productRows[0],
      images: imageRows.map((row) => row.img_url),
    };

    return {
      code: 200,
      data: product,
    };
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const [existingProduct] = await db.execute(
      `SELECT id FROM product WHERE id = ?`,
      [productId]
    );
    if (existingProduct.length === 0) {
      const err = new Error("Sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    // Xóa tất cả ảnh liên quan trong bảng image
    await db.execute(`DELETE FROM image WHERE product_id = ?`, [productId]);

    // Xóa sản phẩm trong bảng product
    await db.execute(`DELETE FROM product WHERE id = ?`, [productId]);

    return {
      code: 200,
      message: "Xóa sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getProducts,
  insertProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
};
