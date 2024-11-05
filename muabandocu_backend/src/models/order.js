import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Sản phẩm được mua
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người mua
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người bán
  status: {
    type: String,
    enum: ["pending", "approved", "shipped", "completed"],
    default: "pending",
  }, // Trạng thái đơn hàng
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
