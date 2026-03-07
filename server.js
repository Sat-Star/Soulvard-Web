require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./backend/db");

// Import routes
const authRoutes = require("./backend/routes/auth");
const productRoutes = require("./backend/routes/products");
const categoryRoutes = require("./backend/routes/categories");
const couponRoutes = require("./backend/routes/coupons");
const playlistRoutes = require("./backend/routes/playlists");
const heroImageRoutes = require("./backend/routes/heroImages");
const sizeChartRoutes = require("./backend/routes/sizeCharts");
const promotionRoutes = require("./backend/routes/promotions");

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (Images now served from Cloudinary)
// API routes MUST be before static file serving
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/hero-images", heroImageRoutes);
app.use("/api/size-charts", sizeChartRoutes);
app.use("/api/promotions", promotionRoutes);

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
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/login.html"));
});

app.get("/collection.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/collection.html"));
});

app.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/cart.html"));
});

app.get("/wishlist.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client/wishlist.html"));
});

// Handle /client/* paths - redirect to root paths for backward compatibility
app.get("/client/index.html", (req, res) => {
  res.redirect("/index.html");
});

app.get("/client/login.html", (req, res) => {
  res.redirect("/login.html");
});

app.get("/client/collection.html", (req, res) => {
  res.redirect("/collection.html");
});

app.get("/client/cart.html", (req, res) => {
  res.redirect("/cart.html");
});

app.get("/client/wishlist.html", (req, res) => {
  res.redirect("/wishlist.html");
});

// Admin routes
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/admin.html"));
});

app.get("/admin/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/admin.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
