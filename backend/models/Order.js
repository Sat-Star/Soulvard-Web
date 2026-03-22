const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
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
        quantity: Number,
        size: String,
        color: String,
        image: String,
        total: Number,
      },
    ],
    deliveryInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    pricing: {
      subtotal: Number,
      discount: {
        type: Number,
        default: 0,
      },
      tax: Number,
      shipping: {
        type: Number,
        default: 499,
      },
      total: Number,
    },
    couponCode: String,
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    notes: String,
  },
  { timestamps: true },
);

// Auto-generate order ID
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    this.orderId = `ORD-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Index for faster queries
orderSchema.index({ userId: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
