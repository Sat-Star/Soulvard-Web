const Newsletter = require("../models/Newsletter");
const StockNotification = require("../models/StockNotification");
const { validateEmail } = require("../utils/validators");

// Subscribe to newsletter
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if already subscribed
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    const subscription = new Newsletter({
      email,
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: {
        email,
        subscribedAt: subscription.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error subscribing to newsletter",
      error: error.message,
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await Newsletter.findOneAndDelete({ email });

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error unsubscribing from newsletter",
      error: error.message,
    });
  }
};

// Register for stock notification
exports.registerStockNotification = async (req, res) => {
  try {
    const { productId, email } = req.body;

    if (!productId || !email) {
      return res.status(400).json({
        success: false,
        message: "Product ID and email are required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if already registered
    const existingNotification = await StockNotification.findOne({
      productId,
      email,
    });
    if (existingNotification) {
      return res.status(400).json({
        success: false,
        message: "Already registered for stock notification",
      });
    }

    const notification = new StockNotification({
      productId,
      email,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "You'll be notified when this product is back in stock",
      data: {
        productId,
        email,
        registeredAt: notification.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering for stock notification",
      error: error.message,
    });
  }
};

// Get all newsletter subscribers (Admin)
exports.getNewsletterSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments();

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subscribers",
      error: error.message,
    });
  }
};

// Get all stock notifications (Admin)
exports.getStockNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 50, productId } = req.query;

    let filter = {};
    if (productId) {
      filter.productId = productId;
    }

    const skip = (page - 1) * limit;

    const notifications = await StockNotification.find(filter)
      .populate("productId", "name sku")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await StockNotification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};
