const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// protected routes
router.use(protect);

// GET ALL
router.get("/", getAllCategories);

// CREATE
router.post("/", createCategory);

// UPDATE
router.patch("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

module.exports = router;