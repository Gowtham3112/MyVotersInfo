const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getAllWards,
  getWards,
  getWardsByCategory,
  createWard,
  updateWard,
  deleteWard,
} = require("../controllers/wardController");

router.use(protect);

// GET ALL
router.get("/all", getAllWards);

// PAGINATION
router.get("/", getWards);

// CATEGORY BASED
router.get("/category", getWardsByCategory);

// CREATE
router.post("/", createWard);

// UPDATE
router.patch("/:id", updateWard);

// DELETE
router.delete("/:id", deleteWard);

module.exports = router;
