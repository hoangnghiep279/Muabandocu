// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/order");
const { checkLogin } = require("../middleware/checkLogin");

router.post("/", checkLogin, async (req, res, next) => {
  try {
    const result = await controller.createOrder(req.body, req.payload.id);
    res.status(result.code).json(result.data);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
