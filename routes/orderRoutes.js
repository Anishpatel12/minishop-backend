// backend/routes/orderRoutes.js

const express = require("express");
const router = express.Router();

// Middleware
const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

// Controllers
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  getLatestOrder,
  trackOrder,
  searchOrders,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require(
  "../controllers/orderController"
);

//
// USER ROUTES
//

// Create COD Order
router.post(
  "/",
  protect,
  createOrder
);

// Razorpay Create Order
router.post(
  "/razorpay/create-order",
  protect,
  createRazorpayOrder
);

// Razorpay Verify Payment
router.post(
  "/razorpay/verify",
  protect,
  verifyRazorpayPayment
);
router.get("/razorpay/test", (req, res) => {
  res.json({
    success: true,
    message: "Razorpay Working",
  });
});

// User Orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Latest Order
router.get(
  "/latest",
  protect,
  getLatestOrder
);

// Track Order
router.get(
  "/track/:id",
  protect,
  trackOrder
);

// Cancel Order
router.put(
  "/cancel/:id",
  protect,
  cancelOrder
);

//
// ADMIN ROUTES
//

// Search Orders
router.get(
  "/search",
  protect,
  adminOnly,
  searchOrders
);

// Get All Orders
router.get(
  "/",
  protect,
  adminOnly,
  getOrders
);

// Update Order Status
router.put(
  "/:id",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;