const express = require("express");
const Coupon = require("../models/Coupon");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all coupons (public - for validation on client)
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find({ status: "Active" });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate coupon (public)
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.status !== "Active") {
      return res.status(400).json({ message: "Coupon is not active" });
    }

    res.json({
      valid: true,
      discount: coupon.discount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create coupon (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      code,
      discount,
      startDate,
      endDate,
      applicableProducts,
      usageLimit,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = new Coupon({
      code,
      discount: Number(discount),
      startDate,
      endDate,
      applicableProducts: applicableProducts || ["all"],
      usageLimit: usageLimit ? Number(usageLimit) : null,
    });

    await coupon.save();
    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update coupon (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      code,
      discount,
      startDate,
      endDate,
      applicableProducts,
      usageLimit,
    } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code,
        discount: Number(discount),
        startDate,
        endDate,
        applicableProducts,
        usageLimit: usageLimit ? Number(usageLimit) : null,
      },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete coupon (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
