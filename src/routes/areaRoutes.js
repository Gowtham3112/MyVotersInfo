const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllAreas,
  getAreasPaginated,
  getAreasByFilters,
  createArea,
  updateArea,
  deleteArea,
} = require("../controllers/areaController");

router.use(protect);

// GET ALL AREAS
router.get("/all", getAllAreas);

// PAGINATION + SEARCH
router.get("/paginated", getAreasPaginated);

// FILTER BY CATEGORY / PART / WARD
router.get("/filter", getAreasByFilters);

// CREATE AREA
router.post("/", createArea);

// UPDATE AREA
router.patch("/:id", updateArea);

// DELETE AREA
router.delete("/:id", deleteArea);

module.exports = router;