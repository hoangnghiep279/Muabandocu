const express = require("express");

const router = express.Router();
const controller = require("../controllers/user");
const { checkLogin } = require("../middleware/checkLogin");

router.post("/login", async (req, res, next) => {
  try {
    res.json(await controller.login(req.body));
  } catch (error) {
    next(error);
  }
});
router.post("/register", async (req, res, next) => {
  try {
    res.json(await controller.register(req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/change_password/:id", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.changePassword(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
