
// backend/routes/orderRoutes.js

const express = require("express");

const router =
  express.Router();

//
// MIDDLEWARE
//
const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

//
// CONTROLLERS
//
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  getLatestOrder,
  trackOrder,
  searchOrders
} = require(
  "../controllers/orderController"
);

//
// =====================================
// USER ROUTES
// =====================================
//

// CREATE ORDER
router.post(
  "/",
  protect,
  createOrder
);

// GET MY ORDERS
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// GET LATEST ORDER
router.get(
  "/latest",
  protect,
  getLatestOrder
);

// TRACK ORDER
router.get(
  "/track/:id",
  protect,
  trackOrder
);

// CANCEL ORDER
router.put(
  "/cancel/:id",
  protect,
  cancelOrder
);
router.get(
  "/search",
  protect,
  adminOnly,
  searchOrders
);
//
// =====================================
// ADMIN ROUTES
// =====================================
//

// GET ALL ORDERS
router.get(
  "/",
  protect,
  adminOnly,
  getOrders
);

// UPDATE ORDER STATUS
router.put(
  "/:id",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;

