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
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicableProducts: [String], // Product IDs or "all"
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Auto-calculate status based on dates
couponSchema.pre("save", function (next) {
  const now = new Date();
  if (now < this.startDate) {
    this.status = "Inactive";
  } else if (now > this.endDate) {
    this.status = "Expired";
  } else if (this.usageLimit && this.usageCount >= this.usageLimit) {
    this.status = "Expired";
  } else {
    this.status = "Active";
  }
  next();
});

module.exports = mongoose.model("Coupon", couponSchema);
