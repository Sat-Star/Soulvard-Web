require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./backend/db");
const errorHandler = require("./backend/middleware/errorHandler");

// Import routes
const authRoutes = require("./backend/routes/auth");
const productRoutes = require("./backend/routes/products");
const categoryRoutes = require("./backend/routes/categories");
const cartRoutes = require("./backend/routes/cart");
const wishlistRoutes = require("./backend/routes/wishlist");
const orderRoutes = require("./backend/routes/orders");
const couponRoutes = require("./backend/routes/coupons");
const notificationRoutes = require("./backend/routes/notifications");

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// API routes MUST be before static file serving
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, "client")));
app.use("/admin", express.static(path.join(__dirname, "admin")));

// Root route - Customer homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

// Customer pages routes
app.get("/collection.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/collection.html"));
});

app.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/cart.html"));
});

app.get("/wishlist.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/whishlist.html"));
});

app.get("/product/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "client/product_cart.html"));
});

app.get("/custom.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/Custom.html"));
});

app.get("/ourstory.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/ourstory.html"));
});

// Admin routes
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/admin.html"));
});

app.get("/admin/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/admin.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
