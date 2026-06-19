const express = require("express");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
  verifyOTP,
  getProfile,
} = require("../controllers/authController");

const protect = require(
  "../middleware/authMiddleware"
);

// REGISTER
router.post(
  "/register",
  registerUser
);

// LOGIN
router.post(
  "/login",
  loginUser
);

// VERIFY OTP
router.post(
  "/verify-otp",
  verifyOTP
);

// PROFILE
router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;