const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Get user wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Format response to include full product details
    const products = wishlist.products.map((item) => ({
      productId: item.productId._id,
      ...item.productId.toObject(),
    }));

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        products: [{ productId }],
      });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.products.some(
        (item) => item.productId.toString() === productId,
      );

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }

      wishlist.products.push({ productId });
    }

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlistCount: wishlist.products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId,
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlistCount: wishlist.products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
};

// Check if product in wishlist
exports.isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      userId: req.user._id,
      "products.productId": productId,
    });

    res.status(200).json({
      success: true,
      inWishlist: !!wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking wishlist",
      error: error.message,
    });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing wishlist",
      error: error.message,
    });
  }
};
