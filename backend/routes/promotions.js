const express = require("express");
const Promotion = require("../models/Promotion");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get current promotion (public)
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find({ active: true });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create promotion (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, endDate, active } = req.body;

    const promotion = new Promotion({
      title,
      description,
      endDate,
      active: active !== undefined ? active : true,
    });

    await promotion.save();
    res.status(201).json({
      message: "Promotion created successfully",
      promotion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update promotion (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, endDate, active } = req.body;

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { title, description, endDate, active },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json({
      message: "Promotion updated successfully",
      promotion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete promotion (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
