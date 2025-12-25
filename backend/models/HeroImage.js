const mongoose = require("mongoose");

const heroImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroImage", heroImageSchema);
