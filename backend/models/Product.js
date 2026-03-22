const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: function () {
        return Math.round(((this.mrp - this.price) / this.mrp) * 100);
      },
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: "NEW",
    },
    colors: [
      {
        name: String,
        value: String,
        hex: String,
        images: [String],
      },
    ],
    sizes: [
      {
        size: String,
        inStock: Boolean,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    sku: String,
  },
  { timestamps: true },
);

// Index for faster queries
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
