const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const { checkLogin } = require("../middleware/checkLogin");
const {
  checkMyAccount,
  checkDeleteUser,
  checkAdmin,
  checkAdministrator,
} = require("../middleware/checkPermission");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../resources/user-img"));
  },
});

const upload = multer({ storage });
// Đăng ký
router.post("/register", async (req, res, next) => {
  try {
    res.json(await controller.register(req.body));
  } catch (error) {
    next(error);
  }
});
// Đăng ký manager
router.post(
  "/registerManager",
  checkLogin,
  checkAdmin,
  async (req, res, next) => {
    try {
      res.json(await controller.resgisterManager(req.body));
    } catch (error) {
      next(error);
    }
  }
);
// Đăng nhập
router.post("/login", async (req, res, next) => {
  try {
    res.json(await controller.login(req.body));
  } catch (error) {
    next(error);
  }
});
// Danh sách nguoi dung
router.get("/", checkLogin, checkAdmin, async (req, res, next) => {
  try {
    res.json(await controller.getUser());
  } catch (error) {
    next(error);
  }
});
// Danh sach manager
router.get("/manager", checkLogin, checkAdmin, async (req, res, next) => {
  try {
    res.json(await controller.getManager());
  } catch (error) {
    next(error);
  }
});
// Thong tin nguoi dung
router.get("/profile", checkLogin, async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const user = await controller.getUserById(userId);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});
// Cap nhat nguoi dung
router.put(
  "/profile",
  checkLogin,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = req.body;
      const result = await controller.updateUser(
        req.payload.id,
        user,
        req.file
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);
// Doi mat khau
router.put("/change_password", checkLogin, async (req, res, next) => {
  try {
    res.json(await controller.changePassword(req.payload.id, req.body));
  } catch (error) {
    next(error);
  }
});
// Xoa nguoi dung
router.delete("/:id", checkLogin, checkAdmin, async (req, res, next) => {
  try {
    const result = await controller.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
