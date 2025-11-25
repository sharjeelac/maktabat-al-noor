import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Like New", "Good", "Fair"],
    default: "Good",
  },
  thumbnail: { type: String, required: true },
  gallery: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Book", bookSchema);
