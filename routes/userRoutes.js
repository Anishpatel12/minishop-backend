const express = require("express");

const router =
  express.Router();

// CONTROLLERS
const {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
} = require(
  "../controllers/userController"
);

// MIDDLEWARE
const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

//
// AUTH ROUTES
//

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

//
// PROFILE ROUTES
//

// GET PROFILE
router.get(
  "/profile",
  protect,
  getProfile
);

// UPDATE PROFILE
router.put(
  "/profile",
  protect,
  updateProfile
);

//
// ADMIN ROUTES
//

// GET USERS
router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

// DELETE USER
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;