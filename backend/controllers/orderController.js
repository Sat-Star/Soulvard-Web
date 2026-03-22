const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const { calculateTotals } = require("../utils/validators");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { cartItems, deliveryInfo, paymentMethod, couponCode } = req.body;

    // Validation
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    if (!deliveryInfo) {
      return res.status(400).json({
        success: false,
        message: "Delivery information is required",
      });
    }

    const { name, phone, email, address, pincode, city, state } = deliveryInfo;
    if (!name || !phone || !email || !address || !pincode || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "All delivery fields are required",
      });
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired",
        });
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit exceeded",
        });
      }

      if (subtotal < coupon.minAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minAmount} required for this coupon`,
        });
      }

      // Calculate discount
      if (coupon.discountType === "percentage") {
        discount = Math.round((subtotal * coupon.discount) / 100);
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discount;
      }

      // Update coupon usage
      coupon.usageCount += 1;
      await coupon.save();
    }

    // Calculate shipping
    const shipping = subtotal - discount > 5000 ? 0 : 499;

    // Calculate totals
    const totals = calculateTotals(subtotal, discount, shipping);

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: cartItems.map((item) => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
        total: item.price * item.quantity,
      })),
      deliveryInfo: {
        name,
        phone,
        email,
        address,
        pincode,
        city,
        state,
      },
      pricing: totals,
      couponCode: couponCode || null,
      paymentMethod: paymentMethod || "card",
    });

    await order.save();

    // Clear user's cart
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.orderId,
        status: order.status,
        total: order.pricing.total,
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        paymentLink: `http://localhost:${process.env.PORT}/api/orders/${order._id}/payment`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (
      order.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filter = { userId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
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
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.userId = userId;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
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
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        trackingNumber: trackingNumber || order?.trackingNumber,
        notes: notes || order?.notes,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (
      order.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to cancel this order",
      });
    }

    // Can't cancel if already shipped or delivered
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};
