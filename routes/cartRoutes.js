const express = require("express");

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require(
  "../controllers/cartController"
);

// GET CART
router.get(
  "/",
  protect,
  getCart
);

// ADD TO CART
router.post(
  "/",
  protect,
  addToCart
);

// REMOVE ITEM
router.delete(
  "/:id",
  protect,
  removeFromCart
);

// CLEAR CART
router.delete(
  "/",
  protect,
  clearCart
);

module.exports = router;