const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createVoter,
  updateVoter,
  deleteVoter,
  getAllVoters,
  getVotersPaginated,
  exportVotersExcel,
  exportVoterListPDF,
} = require("../controllers/voterController");

router.use(protect);

// GET
router.get("/all", getAllVoters);
router.get("/paginated", getVotersPaginated);

// CREATE
router.post("/", upload.single("photo"), createVoter);

// UPDATE
router.patch("/:id", upload.single("photo"), updateVoter);

// DELETE
router.delete("/:id", deleteVoter);

// EXPORT
router.get("/export/excel", exportVotersExcel);

router.get("/export/pdf", exportVoterListPDF);

module.exports = router;
