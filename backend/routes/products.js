const express = require("express");
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const {
        id,
        name,
        description,
        category,
        price,
        stock,
        shipping,
        colors,
        sizes,
        featured,
      } = req.body;

      // Handle image URLs from Cloudinary
      const imageUrls = req.files ? req.files.map((file) => file.path) : [];

      // Auto-generate ID if not provided (format: SKU_TIMESTAMP)
      const productId = id || `SKU_${Date.now()}`;

      const product = new Product({
        id: productId,
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        shipping: Number(shipping),
        colors: colors ? JSON.parse(colors) : [],
        sizes: sizes ? JSON.parse(sizes) : [],
        images: imageUrls,
        featured: featured === "true",
        status: stock > 0 ? "Active" : "Out of Stock",
      });

      await product.save();
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update product (Admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        price,
        stock,
        shipping,
        colors,
        sizes,
        featured,
        existingImages,
      } = req.body;

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Handle image URLs - preserve existing ones and add new ones
      let images = [];

      // Start with existing images if provided
      if (existingImages) {
        try {
          images = JSON.parse(existingImages);
        } catch (e) {
          images = [];
        }
      }

      // Add new uploaded images
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map((file) => file.path);
        images = [...images, ...newImageUrls];
      }

      // Update images array (keep existing if no changes)
      if (images.length > 0) {
        product.images = images;
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price ? Number(price) : product.price;
      product.stock = stock ? Number(stock) : product.stock;
      product.shipping = shipping ? Number(shipping) : product.shipping;
      product.colors = colors ? JSON.parse(colors) : product.colors;
      product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
      product.featured =
        featured !== undefined ? featured === "true" : product.featured;
      product.status = product.stock > 0 ? "Active" : "Out of Stock";

      await product.save();
      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete product (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
