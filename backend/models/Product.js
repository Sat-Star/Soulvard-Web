const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Out of Stock", "Discontinued"],
      default: "Active",
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    colors: [
      {
        name: String,
        value: String, // hex color code
        image: String, // URL to color variant image
      },
    ],
    sizes: [String], // e.g., ["XS", "S", "M", "L", "XL"]
    images: [String], // URLs to product images
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
