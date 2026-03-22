const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/address", verifyToken, addAddress);
router.delete("/address/:addressId", verifyToken, deleteAddress);

module.exports = router;
