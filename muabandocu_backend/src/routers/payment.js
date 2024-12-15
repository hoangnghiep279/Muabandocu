const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/payment");

router.post("/", processPayment);
module.exports = router;
