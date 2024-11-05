import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    emailVerified: { type: Boolean, default: false }, // Trạng thái xác thực email
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Phân quyền
    token: { type: String },
  },
  {
    collection: "User",
  }
);

export default mongoose.model("User", userSchema);
