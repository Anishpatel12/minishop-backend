const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  processAICommand,
} = require("../controllers/aiController");

router.post(
  "/inventory",
  protect,
  adminOnly,
  processAICommand
);

module.exports = router;