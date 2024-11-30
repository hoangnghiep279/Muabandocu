const db = require("../config/database.js");
const fs = require("fs");
const path = require("path");
const uploadMultipleImages =
  require("../helpers/uploadimg").uploadMultipleImages;

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
async function updateProduct(productId, product, files) {
  try {
    const [existingProduct] = await db.execute(
      `SELECT id FROM product WHERE id = ? AND user_id = ? AND approved = 0`,
      [productId, product.user_id]
    );

    if (existingProduct.length === 0) {
      const err = new Error("Sản phẩm không tồn tại hoặc không thể cập nhật!");
      err.statusCode = 404;
      throw err;
    }

    const [categories] = await db.execute(
      `SELECT id, name FROM category ORDER BY name`
    );

    await db.execute(
      `UPDATE product 
       SET category_id = ?, title = ?, linkzalo = ?, description = ?, price = ?, warranty = ?, shipfee = ?
       WHERE id = ?`,
      [
        product.category_id,
        product.title,
        product.linkzalo,
        product.description,
        product.price,
        product.warranty,
        product.shipfee,
        productId,
      ]
    );

    if (files && files.length > 0) {
      const [oldImages] = await db.execute(
        `SELECT img_url FROM image WHERE product_id = ?`,
        [productId]
      );

      oldImages.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "../resources/products-img",
          image.img_url
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await db.execute(`DELETE FROM image WHERE product_id = ?`, [productId]);

      const uploadResult = await uploadMultipleImages(files);
      const imageUrls = uploadResult.images;

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

async function getPendingProducts() {
  try {
    const [products] = await db.execute(
      `SELECT id, title, description, price, warranty, shipfee, category_id, user_id, created_at
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

async function approveProduct(productId) {
  try {
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

async function getProducts(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const [productRows] = await db.execute(
      `SELECT
        p.id,
        p.user_id,
        p.category_id,
        p.title,
        p.price,
        p.warranty,
        p.approved,
        c.name AS category_name
      FROM
        product p
      JOIN
        category c ON p.category_id = c.id
      WHERE
        p.approved = 1
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

async function getDetailProduct(productId) {
  try {
    const [productRows] = await db.execute(
      `SELECT 
          p.id AS product_id, 
          p.user_id, 
          p.title, 
          p.linkzalo,
          p.description, 
          p.price,
          p.warranty,
          p.shipfee,
          c.name AS category_name, 
          u.name AS seller_name, 
          u.avatar AS seller_avatar 
      FROM 
          product p 
      JOIN 
          user u 
      ON 
          p.user_id = u.id 
      JOIN 
          category c 
      ON 
          p.category_id = c.id 
        WHERE 
          p.id = ?`,
      [productId]
    );

    if (productRows.length === 0) {
      const err = new Error("Sản phẩm không tồn tại.");
      err.statusCode = 404;
      throw err;
    }

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
    const [existingProduct] = await db.execute(
      `SELECT id FROM product WHERE id = ?`,
      [productId]
    );
    if (existingProduct.length === 0) {
      const err = new Error("Sản phẩm không tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    await db.execute(`DELETE FROM image WHERE product_id = ?`, [productId]);

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
  getPendingProducts,
  getProducts,
  insertProduct,
  approveProduct,
  updateProduct,
  getDetailProduct,
  searchProduct,
  deleteProduct,
};
