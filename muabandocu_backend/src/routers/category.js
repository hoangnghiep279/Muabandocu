const express = require("express");
const router = express.Router();
const controller = require("../controllers/category");
const { checkLogin } = require("../middleware/checkLogin");
const { checkAdmin } = require("../middleware/checkPermission");

router.get("/", async (req, res, next) => {
  try {
    res.json(await controller.getCategory());
  } catch (error) {
    throw error;
  }
});
router.post("/", checkLogin, checkAdmin, async (req, res, next) => {
  try {
    res.json(await controller.insertCategory(req.body));
  } catch (error) {
    next(error);
  }
});
router.put("/:id", checkLogin, checkAdmin, async (req, res, next) => {
  try {
    res.json(await controller.updateCategory(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", checkLogin, checkAdmin, async (req, res, next) => {
  try {
    res.json(await controller.deleteCategory(req.params.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
