const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discount: {
      type: Number,
      required: true,
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: Number,
    usageLimit: Number,
    usageCount: {
      type: Number,
      default: 0,
    },
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
