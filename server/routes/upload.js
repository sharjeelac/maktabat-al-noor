import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 1. Config Cloudinary (Use Env variables normally now)
// Agar env kaam na kare to hardcode use kar lena wapis
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dyafmh1ht",
  api_key: process.env.CLOUDINARY_API_KEY || "493667498826181",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "a3a69m_QIGE6XfigphYw1DSpjJI",
});

// 2. Use Memory Storage (RAM) instead of Disk/CloudinaryStorage
// Vercel ke liye ye best hai.
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 3. Convert Buffer to Base64
    // Kyunke file RAM mein hai, humay usay text (Base64) bana kar bhejna hoga
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // 4. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "maktabat-al-noor",
    });

    // Success!
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
