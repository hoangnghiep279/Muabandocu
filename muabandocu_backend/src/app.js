// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routers/user");
const productRoutes = require("./routers/product");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// Cấu hình Express phục vụ ảnh tĩnh từ thư mục resources/products-img
app.use(
  "/resources/products-img",
  express.static(path.join(__dirname, "resources/products-img"))
);
app.use("/resources", express.static(path.join(__dirname, "resources")));
// Routes
app.use("/api/users", userRoutes);
app.use("/products", productRoutes);

module.exports = app;
