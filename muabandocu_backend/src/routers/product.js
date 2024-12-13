const express = require("express");
const router = express.Router();
const controller = require("../controllers/product");
const { checkLogin } = require("../middleware/checkLogin");
const multer = require("multer");
const path = require("path");
const { checkAdministrator } = require("../middleware/checkPermission");
const { log } = require("console");

const upload = multer({
  dest: path.join(__dirname, "../resources/products-img"),
});
//danh sach chờ duyệt
router.get(
  "/pending",
  checkLogin,
  checkAdministrator,
  async (req, res, next) => {
    try {
      const result = await controller.getPendingProducts();
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  }
);

// duyệt sản phẩm
router.post(
  "/:id/approve",
  checkLogin,
  checkAdministrator,
  async (req, res, next) => {
    try {
      const productId = req.params.id;
      const result = await controller.approveProduct(productId);
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
);
// xem sản phẩm đã duyệt
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const categoryId = req.query.categoryId ? req.query.categoryId : null;

    res.status(200).json(await controller.getProducts(page, limit, categoryId));
  } catch (error) {
    next(error);
  }
});

// sản phầm đã duyệt của người dùng
router.get("/user-products", checkLogin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await controller.getProductsByUser(
      page,
      limit,
      req.payload.id
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// sản phầm và thông tin người bán
router.get("/user-products/:id", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await controller.getProductsBySeller(
      page,
      limit,
      req.params.id
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// sanpham chua duyet cảu người dùng
router.get("/user-pendingproducts", checkLogin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await controller.getPendingProductsByUser(
      page,
      limit,
      req.payload.id
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// tim kiem san pham
router.get("/search", async (req, res, next) => {
  try {
    const { keyword } = req.query;
    res.json(await controller.searchProduct(keyword));
  } catch (error) {
    next(error);
  }
});

// xem chi tiet
router.get("/:id", async (req, res, next) => {
  try {
    res.json(await controller.getDetailProduct(req.params.id));
  } catch (error) {
    next(error);
  }
});

// THÊM
router.post("/", checkLogin, upload.array("images"), async (req, res, next) => {
  try {
    res.json(
      await controller.insertProduct(req.body, req.files, req.payload.id)
    );
  } catch (error) {
    next(error);
  }
});
// sửa
router.put(
  "/:id",
  checkLogin,
  upload.array("images"),
  async (req, res, next) => {
    console.log(req.files);

    try {
      const result = await controller.updateProduct(
        req.params.id,
        req.payload.id,
        req.body,
        req.files
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// xóa
router.delete("/:id", checkLogin, async (req, res, next) => {
  try {
    const productId = req.params.id;
    res.json(await controller.deleteProduct(productId));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
