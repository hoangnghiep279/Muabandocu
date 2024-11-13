// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routers/user");
const app = express();

app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
