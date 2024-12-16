const axios = require("axios");
const crypto = require("crypto");

const processPaymentMoMo = async (req, res, next) => {
  const { totalprice: amount, payment_method: paymentMethod } = req.body;
  const orderInfo = "pay with MoMo";

  if (paymentMethod !== "momo") {
    return next();
  }

  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const partnerCode = "MOMO";
  const redirectUrl = "https://example.com/thank-you";
  const ipnUrl = "http://localhost:3000/order/momo-ipn";
  const requestType = "payWithMethod";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  const autoCapture = true;
  const lang = "vi";

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    signature,
  };

  try {
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody
    );

    if (response.data.payUrl) {
      req.paymentUrl = response.data.payUrl;
      req.orderIdFromMoMo = orderId;
      console.log("URL thanh toán MoMo:", req.paymentUrl);
      return res.status(200).json({
        success: true,
        paymentUrl: req.paymentUrl,
        orderId: req.orderIdFromMoMo,
      });
    } else {
      return res.status(500).json({ message: "Không thể tạo giao dịch MoMo." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Thanh toán MoMo thất bại." });
  }
};

module.exports = { processPaymentMoMo };
