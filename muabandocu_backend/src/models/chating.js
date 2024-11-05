import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ID của người tham gia chat
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID của người gửi
      content: { type: String, required: true }, // Nội dung tin nhắn
      timestamp: { type: Date, default: Date.now }, // Thời gian gửi tin nhắn
    },
  ],
});

export default mongoose.model("Chat", chatSchema);
