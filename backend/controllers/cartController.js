const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { calculateTotals } = require("../utils/validators");

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 5000 ? 0 : 499;

    const totals = calculateTotals(subtotal, 0, shipping);

    res.status(200).json({
      success: true,
      data: {
        items: cart.items,
        ...totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color, colorValue } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    // Validate quantity
    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 10",
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color,
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity = Math.min(existingItem.quantity + quantity, 10);
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        size,
        color,
        colorValue,
        image: product.image,
        mrp: product.mrp,
        badge: product.badge,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart.items,
      cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 10",
      });
    }

    const cart = await Cart.findOne({
      userId: req.user._id,
      "items._id": itemId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (item) {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};
