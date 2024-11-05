import mongoose from "mongoose";
import "dotenv/config";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Kết nối thành công đến MongoDB"))
  .catch((error) => console.error("Kết nối thất bại:", error));
