const express = require("express");
const router = express.Router();
const controller = require("../controllers/product");
const { checkLogin } = require("../middleware/checkLogin");
const multer = require("multer");
const path = require("path");
const { checkAdministrator } = require("../middleware/checkPermission");

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await controller.getProducts(page, limit);
    res.json(result);
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
router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    res.json(await controller.insertProduct(req.body, req.files));
  } catch (error) {
    next(error);
  }
});

// sửa
router.put("/:id", upload.array("images"), async (req, res, next) => {
  try {
    const productId = req.params.id;
    res.json(await controller.updateProduct(productId, req.body, req.files));
  } catch (error) {
    next(error);
  }
});

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
