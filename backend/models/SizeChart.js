const mongoose = require("mongoose");

const sizeChartSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sizes: [
      {
        size: String, // XS, S, M, L, XL
        chest: String, // inches
        waist: String,
        hip: String,
        length: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SizeChart", sizeChartSchema);
