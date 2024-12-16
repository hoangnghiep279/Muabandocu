const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification");
const { checkLogin } = require("../middleware/checkLogin");

router.get("/", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.getNotifications(req.payload.id));
  } catch (error) {
    next(error);
  }
});
router.post("/mark-read", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.markNotificationsAsRead(req.payload.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
