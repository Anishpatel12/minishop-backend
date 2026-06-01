const express = require("express");

const router =
  express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");

const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

// GET ALL PRODUCTS
router.get(
  "/",
  getProducts
);


// CREATE PRODUCT
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// SEARCH PRODUCTS
router.get(
  "/search",
  searchProducts
);
// GET SINGLE PRODUCT
// GET SINGLE PRODUCT
router.get(
  "/:id",
  getProduct
);


module.exports = router;