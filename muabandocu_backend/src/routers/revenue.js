const express = require("express");
const router = express.Router();
const controller = require("../controllers/revenue");
const { checkLogin } = require("../middleware/checkLogin");
const { checkAdmin } = require("../middleware/checkPermission");
const {
  payAdminProductCod,
  paySellerProductMomo,
} = require("../middleware/paymentMomo");
// lấy doanh thu
router.get("/", checkLogin, async (req, res, next) => {
  try {
    const { month, year } = req.query;
    res.json(
      await controller.getRevenueSellerByTime(req.payload.id, month, year)
    );
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
      const { month, year } = req.query;

      // Chuyển đổi dữ liệu đầu vào sang dạng số nếu có
      const monthNumber = month ? parseInt(month, 10) : null;
      const yearNumber = year ? parseInt(year, 10) : null;

      if (month && isNaN(monthNumber)) {
        return res.status(400).json({ error: "Month must be a valid number" });
      }
      if (year && isNaN(yearNumber)) {
        return res.status(400).json({ error: "Year must be a valid number" });
      }

      const revenueData = await controller.getRevenueAdminByTime(
        monthNumber,
        yearNumber
      );

      res.json(revenueData);
    } catch (error) {
      console.error("Error in /statisticalAdmin:", error);
      next(error); // Để middleware xử lý lỗi
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
router.get("/order-items-momo", checkLogin, async (req, res, next) => {
  try {
    const result = await controller.getPaymentWithMomo(req.payload.id);
    res.status(result.code).json(result);
  } catch (error) {
    next(error); // Chuyển lỗi sang middleware xử lý lỗi
  }
});

// ================================================phần thanh toán trong doanh thu ================================================
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

// kiểm tra đơn hàng thanh toán với momoo
router.post("/momo-payment-seller", paySellerProductMomo, async (req, res) => {
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

// Endpoint cập nhật trạng thái thanh toán pay_seller
router.post("/pay-seller", async (req, res, next) => {
  try {
    const { extraData } = req.body;
    const parsedExtraData = JSON.parse(extraData);
    const { orderItemId } = parsedExtraData;

    if (!orderItemId) {
      return res.status(400).json({ message: "Thiếu orderItemId." });
    }

    const result = await controller.updatePaySellerStatus(orderItemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
