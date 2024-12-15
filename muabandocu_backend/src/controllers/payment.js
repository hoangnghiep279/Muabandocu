const axios = require("axios");
const crypto = require("crypto");

exports.processPayment = async (req, res) => {
  const { amount, orderInfo } = req.body;

  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const partnerCode = "MOMO";
  const redirectUrl = "https://example.com/thank-you"; // URL khi thanh toán thành công
  const ipnUrl = "https://example.com/momo-ipn"; // URL nhận thông báo từ MoMo
  const requestType = "captureWallet";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
  };

  try {
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody
    );

    // Gửi thông tin thanh toán cho client
    return res.status(200).json({
      success: true,
      message: "Khởi tạo thanh toán thành công",
      paymentUrl: response.data.payUrl,
      orderId: orderId, // Gửi lại orderId để kiểm tra sau
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Thanh toán thất bại",
    });
  }
};
