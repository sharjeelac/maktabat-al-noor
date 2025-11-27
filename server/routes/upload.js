import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();
const router = express.Router();

cloudinary.config({
  cloud_name: "dyafmh1ht",
  api_key: "493667498826181",
  api_secret: "a3a69m_QIGE6XfigphYw1DSpjJI",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "maktabat-al-noor",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
