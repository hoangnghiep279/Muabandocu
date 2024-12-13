const db = require("../config/database.js");
const fs = require("fs");
const path = require("path");
const uploadMultipleImages =
  require("../helpers/uploadimg").uploadMultipleImages;

async function insertProduct(products, files, userId) {
  try {
    const [ExistingTitle] = await db.execute(
      `SELECT title FROM product WHERE title = ? AND user_id = ?`,
      [products.title, userId]
    );
    if (ExistingTitle.length > 0) {
      const err = new Error("Tên sản phẩm đã có trong hệ thống!");
      err.statusCode = 401;
      throw err;
    }

    // Check categoryId instead of categoryName
    const [category] = await db.execute(
      `SELECT id FROM category WHERE id = ?`, // Use ID directly
      [products.categoryId]
    );

    if (category.length === 0) {
      const err = new Error("Loại sản phẩm không hợp lệ!");
      err.statusCode = 400;
      throw err;
    }

    const categoryId = category[0].id;

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
              \`quantity\`,
              \`warranty\`,
              \`shipfee\`,
              \`status\`,
              \`approved\`
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, 1,?, ?, 0, 0)`,
      [
        productId,
        userId,
        categoryId,
        products.title,
        products.linkzalo,
        products.description,
        products.price,
        products.warranty,
        products.shipfee,
      ]
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
    console.error(error);
    throw error;
  }
}

async function updateProduct(productId, userId, product, files) {
  try {
    const [existingProduct] = await db.execute(
      `SELECT id FROM product WHERE id = ? AND user_id = ? AND approved = 0`,
      [productId, userId]
    );

    if (existingProduct.length === 0) {
      const err = new Error("Sản phẩm không tồn tại hoặc không thể cập nhật!");
      err.statusCode = 404;
      throw err;
    }

    await db.execute(
      `UPDATE product
       SET user_id = ?, category_id = ?, title = ?, linkzalo = ?, description = ?, price = ?, warranty = ?, shipfee = ?
       WHERE id = ?`,
      [
        userId,
        product.category_id || null,
        product.title || null,
        product.linkzalo || null,
        product.description || null,
        product.price || null,
        product.warranty || null,
        product.shipfee || null,
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
         p.status,
         i.img_url
       FROM
         product p
       LEFT JOIN
         image i
       ON
         p.id = i.product_id
       WHERE
         p.approved = 1 AND
         p.title LIKE ?`,
      [`%${keyword.toLowerCase()}%`]
    );

    if (rows.length === 0) {
      throw new Error("Không tìm thấy sản phẩm!");
    }

    const products = rows.reduce((acc, row) => {
      const product = acc.find((p) => p.product_id === row.product_id);
      if (product) {
        product.images.push(row.img_url);
      } else {
        acc.push({
          product_id: row.product_id,
          title: row.title,
          description: row.description,
          price: row.price,
          status: row.status,
          images: row.img_url ? [row.img_url] : [],
        });
      }
      return acc;
    }, []);

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

async function getProducts(page = 1, limit = 10, categoryId = null) {
  try {
    const offset = (page - 1) * limit;

    // Tạo câu truy vấn chính
    let productQuery = `
      SELECT
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
    `;
    const queryParams = [];

    // Thêm điều kiện lọc categoryId nếu có
    if (categoryId) {
      productQuery += ` AND p.category_id = ?`;
      queryParams.push(categoryId);
    }

    // Phân trang
    productQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // Thực thi câu truy vấn
    const [productRows] = await db.execute(productQuery, queryParams);

    // Lấy ảnh cho từng sản phẩm
    const [imageRows] = await db.execute(
      `SELECT product_id, img_url FROM image`
    );

    // Gộp ảnh với thông tin sản phẩm
    const products = productRows.map((product) => {
      const images = imageRows
        .filter((image) => image.product_id === product.id)
        .map((image) => image.img_url); // Chỉ lấy URL ảnh
      return { ...product, images };
    });

    // Đếm tổng số sản phẩm
    let totalQuery = `SELECT COUNT(*) AS total FROM product WHERE approved = 1`;
    const totalQueryParams = [];

    if (categoryId) {
      totalQuery += ` AND category_id = ?`;
      totalQueryParams.push(categoryId);
    }

    const [totalResult] = await db.execute(totalQuery, totalQueryParams);
    const total = totalResult[0].total;

    return {
      code: 200,
      data: products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    throw error;
  }
}

async function getProductsByUser(page = 1, limit = 10, userId) {
  try {
    const offset = (page - 1) * limit;

    if (!userId) {
      throw new Error("User ID không hợp lệ.");
    }

    const [productRows] = await db.execute(
      `
      SELECT
        p.id,
        p.user_id,
        p.category_id,
        p.title,
        p.price,
        p.shipfee,
        p.warranty,
        p.approved,
        c.name AS category_name
      FROM
        product p
      JOIN
        category c ON p.category_id = c.id
      WHERE
        p.approved = 1 AND p.user_id = ?
      LIMIT ? OFFSET ?
    `,
      [userId, limit, offset]
    );

    const [imageRows] = await db.execute(
      `SELECT product_id, img_url FROM image`
    );

    const products = productRows.map((product) => {
      const images = imageRows
        .filter((image) => image.product_id === product.id)
        .map((image) => image.img_url);
      return { ...product, images };
    });

    const [totalResult] = await db.execute(
      `
      SELECT COUNT(*) AS total 
      FROM product 
      WHERE approved = 1 AND user_id = ?
    `,
      [userId]
    );

    const total = totalResult[0].total || "Bạn chưa có sản phẩm nào";
    return {
      code: 200,
      data: products,
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi trong hàm getProductsByUser:", error);
    throw new Error("Lỗi khi lấy danh sách sản phẩm.");
  }
}

async function getProductsBySeller(page = 1, limit = 10, userId) {
  try {
    const offset = (page - 1) * limit;

    if (!userId) {
      throw new Error("User ID không hợp lệ.");
    }

    const [productRows] = await db.execute(
      `
     SELECT
        p.id,
        p.user_id,
        p.category_id,
        p.title,
        p.price,
        p.linkzalo,
        p.shipfee,
        p.warranty,
        p.approved,
        c.name AS category_name,
        u.name AS seller_name,
        u.avatar AS seller_avatar
    FROM
        product p
    JOIN
        category c ON p.category_id = c.id
    JOIN
        user u ON u.id = p.user_id
    WHERE
        p.approved = 1 AND p.user_id = ?
    LIMIT ? OFFSET ?
    `,
      [userId, limit, offset]
    );

    const [imageRows] = await db.execute(
      `SELECT product_id, img_url FROM image`
    );

    const products = productRows.map((product) => {
      const images = imageRows
        .filter((image) => image.product_id === product.id)
        .map((image) => image.img_url);
      return { ...product, images };
    });

    const [totalResult] = await db.execute(
      `
      SELECT COUNT(*) AS total 
      FROM product 
      WHERE approved = 1 AND user_id = ?
    `,
      [userId]
    );

    const total = totalResult[0].total || "Bạn chưa có sản phẩm nào";
    return {
      code: 200,
      data: products,
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi trong hàm getProductsByUser:", error);
    throw new Error("Lỗi khi lấy danh sách sản phẩm.");
  }
}

async function getPendingProductsByUser(page = 1, limit = 10, userId) {
  try {
    const offset = (page - 1) * limit;

    if (!userId) {
      throw new Error("User ID không hợp lệ.");
    }

    const [productRows] = await db.execute(
      `
      SELECT
        p.id,
        p.user_id,
        p.category_id,
        p.title,
        p.price,
        p.shipfee,
        p.warranty,
        p.approved,
        c.name AS category_name
      FROM
        product p
      JOIN
        category c ON p.category_id = c.id
      WHERE
        p.approved = 0 AND p.user_id = ?
      LIMIT ? OFFSET ?
    `,
      [userId, limit, offset]
    );

    const [imageRows] = await db.execute(
      `SELECT product_id, img_url FROM image`
    );

    const products = productRows.map((product) => {
      const images = imageRows
        .filter((image) => image.product_id === product.id)
        .map((image) => image.img_url);
      return { ...product, images };
    });

    const [totalResult] = await db.execute(
      `
      SELECT COUNT(*) AS total 
      FROM product 
      WHERE approved = 1 AND user_id = ?
    `,
      [userId]
    );

    const total = totalResult[0].total || "Bạn chưa có sản phẩm nào";
    return {
      code: 200,
      data: products,
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi trong hàm getProductsByUser:", error);
    throw new Error("Lỗi khi lấy danh sách sản phẩm.");
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
  getProductsByUser,
  getProductsBySeller,
  getPendingProductsByUser,
  searchProduct,
  deleteProduct,
};
