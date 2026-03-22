const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        size: String,
        color: String,
        colorValue: String,
        image: String,
        mrp: Number,
        badge: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

// Index for faster user queries
cartSchema.index({ userId: 1 });

module.exports = mongoose.model("Cart", cartSchema);
