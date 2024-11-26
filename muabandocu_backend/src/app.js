const express = require("express");
const cors = require("cors");
const userRoutes = require("./routers/user");
const productRoutes = require("./routers/product");
const categoryRoutes = require("./routers/category");

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

module.exports = app;
