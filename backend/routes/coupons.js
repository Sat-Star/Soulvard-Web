const express = require("express");
const {
  getAllCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllCoupons);
router.post("/validate", validateCoupon);

// Admin routes
router.post("/", verifyToken, isAdmin, createCoupon);
router.put("/:id", verifyToken, isAdmin, updateCoupon);
router.delete("/:id", verifyToken, isAdmin, deleteCoupon);

module.exports = router;
