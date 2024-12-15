// controllers/orderController.js
const db = require("../config/database");

// async function getOrderById(orderId) {

// }
// Tạo đơn hàng
async function createOrder(orders, buyerId) {
  try {
    // Kiểm tra thanh toán qua MoMo
    if (orders.payment_method === "momo") {
      const [paymentResult] = await db.execute(
        "SELECT status FROM payments WHERE order_id = ?",
        [orders.orderId]
      );

      if (!paymentResult || paymentResult.status !== "success") {
        return {
          code: 400,
          data: { message: "Thanh toán chưa được xác nhận." },
        };
      }
    }

    // Tiếp tục tạo đơn hàng
    const [order] = await db.execute(
      "INSERT INTO `order` ( `id`,`user_id`, `product_id`, `address_id`, `status`, `payment_method`, `shipfee`, `totalprice`) VALUES (?,?, ?, ?, 0, ?, ?, ?)",
      [
        orders.orderId,
        buyerId,
        orders.product_id,
        orders.address_id,
        orders.payment_method,
        orders.shipfee,
        orders.totalprice,
      ]
    );

    // Tạo thông báo như trước đó
    const sellerMessage = `Bạn có một đơn hàng mới cần duyệt cho sản phẩm ID: ${orders.product_id}`;
    await db.execute(
      "INSERT INTO `notification` (id, `user_id`,  `message`, `is_read`) VALUES (uuid(),?, ?, 0)",
      [orders.sellerId, sellerMessage]
    );

    const buyerMessage = `Đặt hàng thành công! Mã đơn hàng của bạn là: ${orders.orderId}`;
    await db.execute(
      "INSERT INTO `notification` (id, `user_id`,  `message`, `is_read`) VALUES (uuid(),?, ?, 0)",
      [buyerId, buyerMessage]
    );

    return {
      code: 201,
      data: {
        orderId: orders.orderId,
        message: "Đặt hàng thành công! Thông báo đã được gửi.",
      },
    };
  } catch (error) {
    throw error;
  }
}

// exports.createOrder = async (req, res) => {
//   const {
//     user_id,
//     product_id,
//     address_id,
//     payment_method,
//     shipfee,
//     totalprice,
//   } = req.body;
//   try {
//     const [order] = await db.execute(
//       "INSERT INTO `order` (`user_id`, `product_id`, `address_id`, `status`, `payment_method`, `shipfee`, `totalprice`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
//       [user_id, product_id, address_id, 0, payment_method, shipfee, totalprice]
//     );

//     // Thêm thông báo cho người bán
//     const message = `Bạn có một đơn hàng mới cần duyệt cho sản phẩm ID: ${product_id}`;
//     await db.execute(
//       "INSERT INTO `notification` (`user_id`, `type`, `message`, `is_read`, `created_at`) VALUES (?, ?, ?, ?, NOW())",
//       [user_id, "order", message, 0]
//     );

//     return res.status(201).json({ success: true, orderId: order.insertId });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Lỗi khi tạo đơn hàng." });
//   }
// };

// Cập nhật trạng thái đơn hàng
// exports.updateOrderStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body; // 0: Chờ duyệt, 1: Đã duyệt, 3: Đã nhận hàng

//   try {
//     await db.execute("UPDATE `order` SET `status` = ? WHERE `id` = ?", [
//       status,
//       orderId,
//     ]);
//     return res.status(200).json({
//       success: true,
//       message: "Cập nhật trạng thái đơn hàng thành công.",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi khi cập nhật trạng thái đơn hàng.",
//     });
//   }
// };

// Xác nhận đã nhận hàng
// exports.confirmOrderReceived = async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     await db.execute("UPDATE `order` SET `status` = ? WHERE `id` = ?", [
//       3,
//       orderId,
//     ]);
//     return res
//       .status(200)
//       .json({ success: true, message: "Đã xác nhận nhận hàng." });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Lỗi khi xác nhận nhận hàng." });
//   }
// };

module.exports = { createOrder };
