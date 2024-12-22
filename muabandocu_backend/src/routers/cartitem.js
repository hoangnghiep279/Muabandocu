const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartitem");
const { checkLogin } = require("../middleware/checkLogin");

router.get("/", checkLogin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const response = await controller.getCartItems(req.payload.id, page, limit);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.post("/", checkLogin, async (req, res, next) => {
  try {
    const response = await controller.insertCartItem(req.payload.id, req.body);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", checkLogin, async (req, res, next) => {
  try {
    const response = await controller.deleteCartItem(
      req.payload.id,
      req.params.id
    );
    res.status(response.code).json({ message: response.message });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
