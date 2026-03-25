// userRoutes
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMe, updateMe } = require("../controllers/userController");
const router = express.Router();

router.use(protect);

router.get("/me", getMe);
router.patch("/update", updateMe);

module.exports = router;
