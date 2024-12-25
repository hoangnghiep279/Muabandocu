const crypto = require("crypto");
const axios = require("axios");
const db = require("../config/database");

const getNgrokUrl = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:4040/api/tunnels");
    const tunnels = response.data.tunnels;
    const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === "https");
    return httpsTunnel ? httpsTunnel.public_url : null;
  } catch (error) {
    console.error("Không thể lấy URL từ ngrok:", error.message);
    throw new Error("Ngrok URL không khả dụng.");
  }
};

const processPaymentMoMo = async (req, res, next) => {
  const {
    totalprice: amount,
    payment_method: paymentMethod,
    momoAccount,
    redirectUrl,
  } = req.body;

  if (paymentMethod !== "momo") {
    return next(); // Nếu không phải MoMo, tiếp tục xử lý các middleware khác
  }

  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const partnerCode = "MOMO";

  try {
    const ngrokUrl = await getNgrokUrl();
    if (!ngrokUrl) {
      return res.status(500).json({ message: "Không thể kết nối với ngrok." });
    }

    const ipnUrl = `${ngrokUrl}/order/momo-ipn`;
    const orderInfo = "pay with MoMo";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = JSON.stringify({
      momoAccount,
      recipient: "0559851334",
    });

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

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
      lang: "vi",
      requestType: "payWithMethod",
      autoCapture: true,
      extraData,
      signature,
    };

    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody
    );
    console.log("MoMo response:", response.data);
    if (response.data.payUrl) {
      req.paymentUrl = response.data.payUrl;
      req.orderIdFromMoMo = orderId;

      // Lưu thông tin thanh toán vào req và tiếp tục xử lý
      return next();
    } else {
      return res.status(500).json({ message: "Không thể tạo giao dịch MoMo." });
    }
  } catch (error) {
    console.error("Thanh toán MoMo thất bại:", error.message);
    return res.status(500).json({ message: "Thanh toán MoMo thất bại." });
  }
};

module.exports = { processPaymentMoMo };
