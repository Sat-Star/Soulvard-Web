const express = require("express");
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  registerStockNotification,
  getNewsletterSubscribers,
  getStockNotifications,
} = require("../controllers/notificationController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/newsletter/subscribe", subscribeNewsletter);
router.post("/newsletter/unsubscribe", unsubscribeNewsletter);
router.post("/stock-notification", registerStockNotification);

// Admin routes
router.get(
  "/newsletter/subscribers",
  verifyToken,
  isAdmin,
  getNewsletterSubscribers,
);
router.get("/stock-notifications", verifyToken, isAdmin, getStockNotifications);

module.exports = router;
