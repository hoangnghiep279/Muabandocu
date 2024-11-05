import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người bán
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // Mảng chứa đường dẫn hoặc URL của ảnh sản phẩm
  status: { type: String, enum: ["available", "sold"], default: "available" }, // Trạng thái sản phẩm
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
