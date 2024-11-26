const db = require("../config/database.js");
const path = require("path");
const uploadMultipleImages =
  require("../helpers/uploadimg").uploadMultipleImages;

// danh sách sản phẩm hiển thị
async function getProducts(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

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
      LIMIT ? OFFSET ?`,
      [limit, offset]
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
    const [totalResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM \`product\``
    );
    const total = totalResult[0].total;

    return {
      code: 200,
      data: products,
      total,
      pages: Math.ceil(total / limit), // Tổng số trang
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
}
//THÊM SẢN PHẨM
async function insertProduct(products, files) {
  try {
    const [ExistingTitle] = await db.execute(
      `SELECT title FROM product WHERE title = '${products.title}'`
    );
    if (ExistingTitle.length > 0) {
      const err = new Error("Tên sản phẩm đã có trong hệ thống!");
      err.statusCode = 401;
      throw err;
    }

    // Tạo ID cho sản phẩm
    const [productResult] = await db.execute("SELECT uuid() AS productId");
    const productId = productResult[0].productId;

    await db.execute(
      `INSERT INTO \`product\`(
          \`id\`,
          \`user_id\`,
          \`category_id\`,
          \`title\`,
          \`linkzalo\`,
          \`description\`,
          \`price\`,
          \`warranty\`,
          \`shipfee\`,
          \`status\`,
          \`approved\`
      ) 
       VALUES (
        '${productId}',
        '${products.userId}',
        '${products.categoryId}',
        '${products.title}',
        '${products.linkzalo}',
        '${products.description}',
        '${products.price}',
        '${products.warranty}',
        '${products.shipfee}',
        0,
        0)`
    );

    if (files && files.length > 0) {
      const uploadResult = await uploadMultipleImages(files);
      const imageUrls = uploadResult.images;

      const imageInserts = imageUrls.map((imageUrl) => {
        return db.execute(
          `INSERT INTO \`image\` (\`id\`, \`product_id\`, \`img_url\`)
               VALUES (uuid(), ?, ?)`,
          [productId, imageUrl]
        );
      });
      await Promise.all(imageInserts);
    }

    return {
      code: 200,
      message: "Thêm sản phẩm thành công! Đang chờ duyệt từ quản trị viên",
    };
  } catch (error) {
    throw error;
  }
}
// xem sản phẩm chờ duyệt
async function getPendingProducts() {
  try {
    const [products] = await db.execute(
      `SELECT id, title, description, price, warranty, shipfee, category_id, user_id 
       FROM product 
       WHERE approved = 0`
    );
    if (products.length === 0) {
      return {
        code: 404,
        message: "Không có sản phẩm nào đang chờ duyệt.",
      };
    }
    return {
      code: 200,
      data: products,
    };
  } catch (error) {
    throw error;
  }
}
// UPDATE SẢN PHẨM
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
async function searchProduct(keyword) {
  if (!keyword || keyword.trim() === "") {
    throw new Error("Keyword không hợp lệ!");
  }

  try {
    // Truy vấn thông tin sản phẩm cùng ảnh
    const [rows] = await db.execute(
      `SELECT 
         p.id AS product_id,
         p.title,
         p.description,
         p.price,
         p.quantity,
         p.status,
         i.img_url
       FROM 
         product p
       LEFT JOIN 
         image i
       ON 
         p.id = i.product_id
       WHERE 
         p.title LIKE ?`,
      [`%${keyword.toLowerCase()}%`]
    );

    if (rows.length === 0) {
      throw new Error("Không tìm thấy sản phẩm!");
    }

    const products = rows.reduce((acc, row) => {
      const product = acc.find((p) => p.product_id === row.product_id);
      if (product) {
        product.image.push({
          product_id: row.product_id,
          img_url: row.img_url,
        });
      } else {
        acc.push({
          product_id: row.product_id,
          title: row.title,
          description: row.description,
          price: row.price,
          quantity: row.quantity,
          status: row.status,
          image: row.img_url
            ? [{ product_id: row.product_id, img_url: row.img_url }]
            : [],
        });
      }
      return acc;
    }, []); // gan acc = 1 mang

    return {
      code: 200,
      data: products,
    };
  } catch (error) {
    console.error("Lỗi tìm kiếm sản phẩm:", error.message);
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

async function approveProduct(productId) {
  try {
    // Kiểm tra sản phẩm
    const [product] = await db.execute(
      `SELECT id, approved FROM product WHERE id = ?`,
      [productId]
    );

    if (product.length === 0) {
      const err = new Error("Sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    if (product[0].approved === 1) {
      const err = new Error("Sản phẩm đã được duyệt!");
      err.statusCode = 400;
      throw err;
    }

    // Cập nhật trạng thái duyệt
    await db.execute(`UPDATE product SET approved = 1 WHERE id = ?`, [
      productId,
    ]);

    return {
      code: 200,
      message: "Phê duyệt sản phẩm thành công!",
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPendingProducts,
  getProducts,
  insertProduct,
  approveProduct,
  updateProduct,
  getDetailProduct,
  searchProduct,
  deleteProduct,
};
