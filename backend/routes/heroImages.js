const express = require("express");
const HeroImage = require("../models/HeroImage");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Get all hero images (public)
router.get("/", async (req, res) => {
  try {
    const heroImages = await HeroImage.find().sort("position");
    res.json(heroImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hero image (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, position } = req.body;
      const imageUrl = req.file ? req.file.path : null;

      if (!imageUrl) {
        return res.status(400).json({ message: "Image is required" });
      }

      const heroImage = new HeroImage({
        imageUrl,
        title,
        position: position || 0,
      });

      await heroImage.save();
      res.status(201).json({
        message: "Hero image created successfully",
        heroImage,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update hero image (Admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, position } = req.body;

      const heroImage = await HeroImage.findById(req.params.id);
      if (!heroImage) {
        return res.status(404).json({ message: "Hero image not found" });
      }

      if (req.file) {
        heroImage.imageUrl = req.file.path;
      }
      heroImage.title = title || heroImage.title;
      heroImage.position =
        position !== undefined ? position : heroImage.position;

      await heroImage.save();
      res.json({
        message: "Hero image updated successfully",
        heroImage,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete hero image (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const heroImage = await HeroImage.findByIdAndDelete(req.params.id);
    if (!heroImage) {
      return res.status(404).json({ message: "Hero image not found" });
    }
    res.json({ message: "Hero image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
