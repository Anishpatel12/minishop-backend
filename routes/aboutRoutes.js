const express =
  require("express");

const router =
  express.Router();

const {
  getAbout,
  updateAbout,
} = require(
  "../controllers/aboutController"
);

const protect =
  require(
    "../middleware/authMiddleware"
  );

const adminOnly =
  require(
    "../middleware/adminMiddleware"
  );

router.get(
  "/",
  getAbout
);

router.put(
  "/",
  protect,
  adminOnly,
  updateAbout
);

module.exports =
  router;