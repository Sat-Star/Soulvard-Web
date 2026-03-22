const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Protected routes - all wishlist operations require authentication
router.get("/", verifyToken, getWishlist);
router.post("/add", verifyToken, addToWishlist);
router.delete("/remove/:productId", verifyToken, removeFromWishlist);
router.get("/check/:productId", verifyToken, isInWishlist);
router.delete("/clear", verifyToken, clearWishlist);

module.exports = router;
