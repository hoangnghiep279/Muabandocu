const express = require("express");
const cors = require("cors");
const userRoutes = require("./routers/user");
const productRoutes = require("./routers/product");
const categoryRoutes = require("./routers/category");
const cartitem = require("./routers/cartitem");
const address = require("./routers/address");
const order = require("./routers/order");
const notification = require("./routers/notification");
const path = require("path");
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
app.use("/order", order);
app.use("/notification", notification);

module.exports = app;
