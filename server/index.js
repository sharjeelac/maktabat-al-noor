import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookRoute from "./routes/Book.Routes.js";
import authRoute from "./routes/auth.route.js";
import seedAdmin from "./seed.js";
import uploadRoute from "./routes/upload.js";

// 2 :Inilialize the app
dotenv.config(); // load Enviromental vaiables
const app = express();

// connect mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    seedAdmin();
  })
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });

// 3 :Middlewares (The GateKeepers)
app.use(cors()); // Allow Frontend to talk to the backend
app.use(express.json()); // Allow Backend to understand JSON

// 4 : Simple Test Route
app.get("/", (req, res) => {
  res.send("Welcome to Maktabat Al-Noor API");
});

// Routes
app.use("/api/books", bookRoute);
app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);

// 5 : Define PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
