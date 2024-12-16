const express = require("express");
const router = express.Router();
const controller = require("../controllers/order");
const { checkLogin } = require("../middleware/checkLogin");
const { processPaymentMoMo } = require("../middleware/paymentMomo");

router.post("/", checkLogin, processPaymentMoMo, async (req, res, next) => {
  try {
    if (req.paymentUrl) {
      // Nếu thanh toán MoMo, gửi URL thanh toán cho client
      return res.status(200).json({
        success: true,
        paymentUrl: req.paymentUrl,
        orderId: req.orderIdFromMoMo,
      });
    }

    const result = await controller.createOrder(req.body, req.payload.id);
    res.status(result.code).json(result.data);
  } catch (error) {
    next(error);
  }
});

router.post("/momo-ipn", checkLogin, async (req, res) => {
  console.log("Received IPN from MoMo:", req.body); // Log để kiểm tra phản hồi từ MoMo

  const {
    orderId,
    resultCode,
    address_id,
    payment_method,
    shipfee,
    totalprice,
    products,
  } = req.body;

  if (resultCode === 0) {
    // Thanh toán thành công
    try {
      const orderData = {
        address_id,
        payment_method,
        shipfee,
        totalprice,
        products,
      };
      const result = await controller.createOrder(
        orderData,
        req.payload.id,
        null,
        orderId
      );
      console.log("Order created successfully:", result.data); // Log để kiểm tra đơn hàng đã được tạo
      return res.status(200).json({ success: true, order: result.data });
    } catch (error) {
      console.error("Error creating order:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi tạo đơn hàng." });
    }
  } else {
    // Thanh toán thất bại
    console.log("Payment failed with resultCode:", resultCode); // Log để kiểm tra mã lỗi
    return res
      .status(400)
      .json({ success: false, message: "Thanh toán thất bại." });
  }
});

module.exports = router;
