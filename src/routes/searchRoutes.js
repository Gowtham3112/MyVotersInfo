const express = require("express");
const router = express.Router();

const {
  searchVoters,
} = require("../controllers/searchController");

// SEARCH + PAGINATION
router.get("/search", searchVoters);

module.exports = router;