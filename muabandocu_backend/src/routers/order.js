const express = require("express");
// const crypto = require("crypto");
const db = require("../config/database");
const router = express.Router();
const controller = require("../controllers/order");
const { checkLogin } = require("../middleware/checkLogin");
const { processPaymentMoMo } = require("../middleware/paymentMomo");

// Danh sách đơn hàng chờ duyệt
router.get("/pending-orders", checkLogin, async (req, res, next) => {
  try {
    const result = await controller.getPendingOrders(req.payload.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
// Duyệt đơn hàng
router.post("/approve", checkLogin, async (req, res, next) => {
  try {
    const { orderItemId, newStatus } = req.body;
    console.log(req.body);

    if (!orderItemId || typeof newStatus !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    const result = await controller.approveOrderItem(orderItemId, newStatus);
    if (result) {
      res.json({
        success: true,
        message: "Order item status updated successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update order item status.",
      });
    }
  } catch (error) {
    next(error);
  }
});
router.get("/product-orders", checkLogin, async (req, res, next) => {
  try {
    const result = await controller.getProcessedOrders(req.payload.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//lay san pham đã đặt hàng
router.get("/:status", checkLogin, async (req, res, next) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }
    const response = await controller.getProductsByOrderStatus(
      status,
      req.payload.id
    );

    // Phản hồi thành công
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// đặt hàng
router.post("/", checkLogin, processPaymentMoMo, async (req, res, next) => {
  try {
    if (req.body.payment_method === "momo") {
      const result = await controller.createOrder(
        req.body,
        req.payload.id,
        req.paymentUrl,
        req.orderIdFromMoMo
      );

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
// router.post("/momo-ipn", async (req, res, next) => {
//   try {
//     const { orderId, resultCode } = req.body;
//     console.log(req.body);

//     if (!orderId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "orderId is missing" });
//     }

//     // Kiểm tra xem orderId có tồn tại trong cơ sở dữ liệu không
//     const [orderCheck] = await db.execute(
//       "SELECT * FROM `order` WHERE momo_order_id = ?",
//       [orderId]
//     );

//     if (orderCheck.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid orderId" });
//     }

//     const orderRecord = orderCheck[0];

//     if (resultCode === "0" || resultCode === 0) {
//       // Thành công
//       await db.execute(
//         "UPDATE `order` SET status = 1 WHERE momo_order_id = ?",
//         [orderId]
//       );
//       await db.execute(
//         "UPDATE `order_items` SET delivery_status = 1 WHERE order_id = ?",
//         [orderRecord.id]
//       );
//       res.status(200).json({ success: true, message: "Thanh toán thành công" });
//     } else {
//       await db.execute(
//         "UPDATE `order` SET status = 9 WHERE momo_order_id = ?",
//         [orderId]
//       );
//       await db.execute(
//         "UPDATE `order_items` SET delivery_status = 9 WHERE order_id = ?",
//         [orderRecord.id]
//       );
//       res
//         .status(200)
//         .json({ success: true, message: "Thanh toán không thành công" });
//     }
//   } catch (error) {
//     console.error("Lỗi xử lý IPN MoMo:", error.message);
//     next(error);
//   }
// });
router.post("/momo-ipn", async (req, res, next) => {
  try {
    const { orderId, resultCode } = req.body;
    console.log(req.body);

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

    const orderRecord = orderCheck[0];

    if (resultCode === "0" || resultCode === 0) {
      // Thành công
      await db.execute(
        "UPDATE `order` SET status = 1 WHERE momo_order_id = ?",
        [orderId]
      );
      await db.execute(
        "UPDATE `order_items` SET delivery_status = 1 WHERE order_id = ?",
        [orderRecord.id]
      );

      // Lấy danh sách sản phẩm liên quan đến đơn hàng
      const [orderItems] = await db.execute(
        "SELECT product_id FROM `order_items` WHERE order_id = ?",
        [orderRecord.id]
      );

      const productIdsToUpdate = orderItems.map((item) => item.product_id);

      // Cập nhật trạng thái sản phẩm
      if (productIdsToUpdate.length > 0) {
        await db.query("UPDATE product SET approved = 2 WHERE id IN (?)", [
          productIdsToUpdate,
        ]);
      }

      res.status(200).json({ success: true, message: "Thanh toán thành công" });
    } else {
      await db.execute(
        "UPDATE `order` SET status = 9 WHERE momo_order_id = ?",
        [orderId]
      );
      await db.execute(
        "UPDATE `order_items` SET delivery_status = 9 WHERE order_id = ?",
        [orderRecord.id]
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

// hủy đơn hàng
router.post("/cancel", checkLogin, async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    const result = await controller.cancelOrder(orderId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi hủy đơn hàng:", error.message);
    next(error);
  }
});

module.exports = router;
