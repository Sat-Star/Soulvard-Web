const express = require("express");
const Playlist = require("../models/Playlist");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all playlists (public)
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("products.productId");
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single playlist (public)
router.get("/:slug", async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ slug: req.params.slug }).populate(
      "products.productId"
    );
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create playlist (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    const existingPlaylist = await Playlist.findOne({ name });
    if (existingPlaylist) {
      return res.status(400).json({ message: "Playlist already exists" });
    }

    const playlist = new Playlist({ name, products: [] });
    await playlist.save();

    res.status(201).json({
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product to playlist (Admin only)
router.post(
  "/:id/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { productId, position } = req.body;

      const playlist = await Playlist.findById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      const existingProduct = playlist.products.find(
        (p) => p.productId.toString() === productId
      );
      if (existingProduct) {
        return res.status(400).json({ message: "Product already in playlist" });
      }

      playlist.products.push({ productId, position: position || 0 });
      await playlist.save();

      res.json({
        message: "Product added to playlist",
        playlist,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Remove product from playlist (Admin only)
router.delete(
  "/:id/products/:productId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const playlist = await Playlist.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { products: { productId: req.params.productId } },
        },
        { new: true }
      );

      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      res.json({
        message: "Product removed from playlist",
        playlist,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete playlist (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
