import express from "express";
import Book from "../models/Book.Schema.js";
// --- IMPORT THE GUARD ---
import { verifyTokenAndAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// 1. ADD A NEW BOOK (LOCKED 🔒)
// Only Admin can do this
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(200).json(savedBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. UPDATE A BOOK (LOCKED 🔒)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE A BOOK (LOCKED 🔒)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json("Book has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. GET ALL BOOKS (PUBLIC 🔓)
// Anyone can see the books, so NO middleware here
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. GET SINGLE BOOK (PUBLIC 🔓)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
