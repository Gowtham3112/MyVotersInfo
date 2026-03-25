const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getAllParts,
  getParts,
  createPart,
  updatePart,
  deletePart,
  getPartsByCategory
} = require("../controllers/partController");

router.use(protect);

// GET ALL PARTS (NO PAGINATION)
router.get("/all", getAllParts);

// GRID API (PAGINATION + SEARCH)
router.get("/", getParts);

// CREATE
router.post("/", createPart);

// UPDATE
router.patch("/:id", updatePart);

// DELETE
router.delete("/:id", deletePart);

// GET PARTS BY CATEGORY
router.get("/category/:categoryId", getPartsByCategory); 

module.exports = router;