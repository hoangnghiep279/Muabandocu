const express = require("express");
const router = express.Router();
const controller = require("../controllers/revenue");
const { checkLogin } = require("../middleware/checkLogin");
const { checkAdmin } = require("../middleware/checkPermission");
const { payAdminProductCod } = require("../middleware/paymentMomo");
// lấy doanh thu
router.get("/", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.getRevenueSeller(req.payload.id));
  } catch (error) {
    next(error);
  }
});

// danh sách đơn hàng thanh toán khi nhận hàng
router.get("/payment_cod", checkLogin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const results = await controller.getOrdersWithCod(
      req.payload.id,
      page,
      limit
    );

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

// doanh thu admin
router.get(
  "/statisticalAdmin",
  checkLogin,
  checkAdmin,
  async (req, res, next) => {
    try {
      const result = await controller.revenueAdmin();
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
);
// danh sach sản phẩm thanh toán với momo - admin
router.get("/order-momo", async (req, res, next) => {
  try {
    const result = await controller.getProductOrderWithMoMo();
    res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
});

// danh sách người dùng đã trả hoa hồng với từng sản phẩm cod - admin
router.get("/order-items-cod", async (req, res, next) => {
  try {
    const result = await controller.getPaymentWithCod();
    res.status(result.code).json(result);
  } catch (error) {
    next(error); // Chuyển lỗi sang middleware xử lý lỗi
  }
});

// kiểm tra đơn hàng thanh toán khi nhận hàng
router.post("/momo-payment", payAdminProductCod, async (req, res) => {
  console.log(req.body);
  const { orderIdFromMoMo, paymentUrl, orderItemId } = req;

  if (paymentUrl) {
    return res.status(200).json({
      orderItemId: orderItemId,
      message: "Tạo giao dịch MoMo thành công.",
      payUrl: paymentUrl,
      orderId: orderIdFromMoMo,
    });
  }

  return res.status(500).json({ message: "Không thể xử lý giao dịch MoMo." });
});

// Endpoint cập nhật trạng thái pay_admin
router.post("/pay-admin", async (req, res, next) => {
  try {
    const { extraData } = req.body;
    const parsedExtraData = JSON.parse(extraData);
    const { orderItemId } = parsedExtraData;

    console.log("test", orderItemId);

    if (!orderItemId) {
      return res.status(400).json({ message: "Thiếu orderItemId." });
    }

    const result = await controller.updatePayAdminStatus(orderItemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
