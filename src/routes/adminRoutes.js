// adminRoutes
const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUserStatus,
} = require("../controllers/adminController");

router.use(protect, isAdmin);

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", updateUserStatus);

module.exports = router;
