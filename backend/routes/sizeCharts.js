const express = require("express");
const SizeChart = require("../models/SizeChart");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all size charts (public)
router.get("/", async (req, res) => {
  try {
    const sizeCharts = await SizeChart.find();
    res.json(sizeCharts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single size chart (public)
router.get("/:category", async (req, res) => {
  try {
    const sizeChart = await SizeChart.findOne({
      category: req.params.category,
    });
    if (!sizeChart) {
      return res.status(404).json({ message: "Size chart not found" });
    }
    res.json(sizeChart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create size chart (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { category, sizes } = req.body;

    const existingSizeChart = await SizeChart.findOne({ category });
    if (existingSizeChart) {
      return res
        .status(400)
        .json({ message: "Size chart for this category already exists" });
    }

    const sizeChart = new SizeChart({ category, sizes });
    await sizeChart.save();

    res.status(201).json({
      message: "Size chart created successfully",
      sizeChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update size chart (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { category, sizes } = req.body;

    const sizeChart = await SizeChart.findByIdAndUpdate(
      req.params.id,
      { category, sizes },
      { new: true }
    );

    if (!sizeChart) {
      return res.status(404).json({ message: "Size chart not found" });
    }

    res.json({
      message: "Size chart updated successfully",
      sizeChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete size chart (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndDelete(req.params.id);
    if (!sizeChart) {
      return res.status(404).json({ message: "Size chart not found" });
    }
    res.json({ message: "Size chart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
