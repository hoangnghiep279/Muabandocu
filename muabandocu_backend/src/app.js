const express = require("express");
const cors = require("cors");
const userRoutes = require("./routers/user");
const productRoutes = require("./routers/product");
const categoryRoutes = require("./routers/category");
const cartitem = require("./routers/cartitem");
const address = require("./routers/address");
const payment = require("./routers/payment");
const order = require("./routers/order");
const path = require("path");
const { default: axios } = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/resources/products-img",
  express.static(path.join(__dirname, "resources/products-img"))
);

app.use(
  "/resources/user-img",
  express.static(path.join(__dirname, "resources/user-img"))
);

app.use("/resources", express.static(path.join(__dirname, "resources")));

// Routes
app.use("/api/users", userRoutes);
app.use("/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/cartitem", cartitem);
app.use("/address", address);
app.use("/payment", payment);
app.use("/order", order);

module.exports = app;
