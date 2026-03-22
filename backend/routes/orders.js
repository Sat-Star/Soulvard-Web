const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Client routes
router.post("/create", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/cancel", verifyToken, cancelOrder);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
