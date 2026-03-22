const mongoose = require("mongoose");

const stockNotificationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Index for faster queries
stockNotificationSchema.index({ productId: 1, email: 1 });

module.exports = mongoose.model("StockNotification", stockNotificationSchema);
