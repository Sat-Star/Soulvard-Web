/**
 * Seed script for initial data setup
 * Run with: node backend/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Coupon = require("./models/Coupon");
const Playlist = require("./models/Playlist");
const SizeChart = require("./models/SizeChart");
const Promotion = require("./models/Promotion");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected for seeding...");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Drop all collections to clear indexes
    const collections = [
      "users",
      "products",
      "categories",
      "coupons",
      "playlists",
      "sizecharts",
      "promotions",
    ];
    for (const collection of collections) {
      try {
        await mongoose.connection.collection(collection).drop();
      } catch (error) {
        // Collection may not exist, that's fine
      }
    }

    console.log("Cleared existing data...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin User",
      email: "admin@soulvard.com",
      password: hashedPassword,
      role: "admin",
      phone: "+91 1234567890",
    });
    await admin.save();
    console.log("✓ Admin user created");

    // Create categories
    const categories = await Category.insertMany([
      { name: "Shirts" },
      { name: "Trousers" },
      { name: "Coats" },
      { name: "Jackets" },
      { name: "Accessories" },
      { name: "Top Picks" },
      { name: "New Arrivals" },
    ]);
    console.log("✓ Categories created");

    // Create products
    const products = await Product.insertMany([
      {
        id: "001",
        name: "Silk Shirt",
        category: "Top Picks",
        price: 24917,
        stock: 15,
        status: "Active",
        description: "Luxurious silk shirt with premium finish",
        shipping: 200,
        colors: [
          {
            name: "Black",
            value: "#000000",
            image:
              "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
          },
        ],
        sizes: ["XS", "S", "M"],
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
        ],
        featured: true,
      },
      {
        id: "002",
        name: "Tailored Trousers",
        category: "New Arrivals",
        price: 33117,
        stock: 8,
        status: "Active",
        description: "Perfectly tailored trousers for a sharp look",
        shipping: 250,
        colors: [
          {
            name: "Navy",
            value: "#1a1a2e",
            image:
              "https://lh3.googleusercontent.com/p/AF1QipMIV1C6dppvP91qcgn6e8qDTcH0HCE2Qc5wWtQK",
          },
        ],
        sizes: ["S", "M", "L"],
        images: [
          "https://lh3.googleusercontent.com/p/AF1QipMIV1C6dppvP91qcgn6e8qDTcH0HCE2Qc5wWtQK",
        ],
        featured: false,
      },
    ]);
    console.log("✓ Products created");

    // Create coupons
    await Coupon.insertMany([
      {
        code: "SOULVARD20",
        discount: 20,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        applicableProducts: ["all"],
        usageLimit: 100,
        usageCount: 45,
        status: "Active",
      },
      {
        code: "WELCOME10",
        discount: 10,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        applicableProducts: ["all"],
        usageLimit: null,
        usageCount: 128,
        status: "Active",
      },
    ]);
    console.log("✓ Coupons created");

    // Create playlists
    const topPicksPlaylist = new Playlist({
      name: "Top Picks",
      products: [{ productId: products[0]._id, position: 0 }],
    });
    await topPicksPlaylist.save();

    const newArrivalsPlaylist = new Playlist({
      name: "New Arrivals",
      products: [{ productId: products[1]._id, position: 0 }],
    });
    await newArrivalsPlaylist.save();
    console.log("✓ Playlists created");

    // Create size charts
    await SizeChart.insertMany([
      {
        category: "Shirts",
        sizes: [
          {
            size: "XS",
            chest: "32-34",
            waist: "26-28",
            hip: "34-36",
            length: "26",
          },
          {
            size: "S",
            chest: "34-36",
            waist: "28-30",
            hip: "36-38",
            length: "27",
          },
          {
            size: "M",
            chest: "36-38",
            waist: "30-32",
            hip: "38-40",
            length: "28",
          },
        ],
      },
    ]);
    console.log("✓ Size charts created");

    // Create promotions
    await Promotion.insertMany([
      {
        title: "SPECIAL OFFER",
        description: "Enjoy 20% off your first purchase with code: SOULVARD20",
        endDate: new Date("2025-12-31"),
        active: true,
      },
    ]);
    console.log("✓ Promotions created");

    console.log("\n✅ All data seeded successfully!");
    console.log("\nAdmin Login Credentials:");
    console.log("Email: admin@soulvard.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
};

main();
