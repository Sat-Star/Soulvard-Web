const Coupon = require("../models/Coupon");

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: coupons,
      total: coupons.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupons",
      error: error.message,
    });
  }
};

// Validate coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { couponCode, subtotal } = req.body;

    if (!couponCode || !subtotal) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and subtotal are required",
      });
    }

    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid coupon code",
      });
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Coupon has expired",
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Coupon usage limit exceeded",
      });
    }

    // Check minimum amount
    if (subtotal < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order amount of ₹${coupon.minAmount} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((subtotal * coupon.discount) / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discount;
    }

    res.status(200).json({
      success: true,
      valid: true,
      discount,
      message: coupon.description || "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        minAmount: coupon.minAmount,
        discount: coupon.discount,
        discountType: coupon.discountType,
        freeShipping: coupon.freeShipping,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating coupon",
      error: error.message,
    });
  }
};

// Create coupon (Admin)
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discount,
      minAmount,
      maxDiscount,
      usageLimit,
      expiryDate,
      freeShipping,
    } = req.body;

    if (!code || !discount) {
      return res.status(400).json({
        success: false,
        message: "Code and discount are required",
      });
    }

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType: discountType || "percentage",
      discount,
      minAmount: minAmount || 0,
      maxDiscount,
      usageLimit,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      freeShipping: freeShipping || false,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating coupon",
      error: error.message,
    });
  }
};

// Update coupon (Admin)
exports.updateCoupon = async (req, res) => {
  try {
    const {
      description,
      discountType,
      discount,
      minAmount,
      maxDiscount,
      usageLimit,
      expiryDate,
      isActive,
      freeShipping,
    } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        description,
        discountType,
        discount,
        minAmount,
        maxDiscount,
        usageLimit,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive,
        freeShipping,
      },
      { new: true, runValidators: true },
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating coupon",
      error: error.message,
    });
  }
};

// Delete coupon (Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting coupon",
      error: error.message,
    });
  }
};
