const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Protected routes - all cart operations require authentication
router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/update/:itemId", verifyToken, updateCartItem);
router.delete("/remove/:itemId", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);

module.exports = router;
