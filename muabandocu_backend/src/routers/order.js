const express = require("express");
// const crypto = require("crypto");
const db = require("../config/database");
const router = express.Router();
const controller = require("../controllers/order");
const { checkLogin } = require("../middleware/checkLogin");
const { processPaymentMoMo } = require("../middleware/paymentMomo");

router.post("/", checkLogin, processPaymentMoMo, async (req, res, next) => {
  try {
    console.log("Request body for creating order:", req.body); // Kiểm tra dữ liệu gửi lên

    if (req.body.payment_method === "momo") {
      const result = await controller.createOrder(
        req.body,
        req.payload.id,
        req.paymentUrl,
        req.orderIdFromMoMo
      );
      console.log("Order created before MoMo payment:", result);

      return res.status(200).json({
        success: true,
        paymentUrl: req.paymentUrl,
        orderId: req.orderIdFromMoMo,
      });
    }

    const result = await controller.createOrder(req.body, req.payload.id);

    res.status(result.code).json(result.data);
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error.message);
    next(error);
  }
});

router.post("/momo-ipn", async (req, res, next) => {
  try {
    const { orderId, resultCode } = req.body;

    console.log("IPN from MoMo:", req.body);

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is missing" });
    }

    // Kiểm tra xem orderId có tồn tại trong cơ sở dữ liệu không
    const [orderCheck] = await db.execute(
      "SELECT * FROM `order` WHERE momo_order_id = ?",
      [orderId]
    );

    if (orderCheck.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid orderId" });
    }

    if (resultCode === "0") {
      // Thành công
      await db.execute(
        "UPDATE `order` SET status = 1 WHERE momo_order_id = ?",
        [orderId]
      );
      res.status(200).json({ success: true, message: "Thanh toán thành công" });
    } else {
      // Nếu có lỗi hoặc thanh toán thất bại
      await db.execute(
        "UPDATE `order` SET status = 1 WHERE momo_order_id = ?",
        [orderId]
      );
      res
        .status(200)
        .json({ success: true, message: "Thanh toán không thành công" });
    }
  } catch (error) {
    console.error("Lỗi xử lý IPN MoMo:", error.message);
    next(error);
  }
});

module.exports = router;
