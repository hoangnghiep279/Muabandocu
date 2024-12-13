const express = require("express");
const router = express.Router();
const controller = require("../controllers/address");
const { checkLogin } = require("../middleware/checkLogin");

router.get("/", checkLogin, async (req, res, next) => {
  try {
    const address = await controller.getAddress(req.payload.id);
    res.json(address);
  } catch (error) {
    next(error);
  }
});

router.post("/", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.addAddress(req.payload.id, req.body));
  } catch (error) {
    next(error);
  }
});
router.put("/:id", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.updateAddress(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.deleteAddress(req.payload.id, req.params.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
