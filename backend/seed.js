const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Coupon = require("./models/Coupon");

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Drop indexes that might be causing issues
    try {
      await Product.collection.dropIndexes();
    } catch (e) {
      // Index might not exist, that's fine
    }

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    console.log("Cleared existing data...");

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@soulvard.com",
      password: "admin123", // Will be hashed by pre-save hook
      role: "admin",
      phone: "+91 9876543210",
    });
    await adminUser.save();
    console.log("✓ Admin user created");

    // Create regular user
    const regularUser = new User({
      name: "John Doe",
      email: "user@soulvard.com",
      password: "user123",
      role: "client",
      phone: "+91 9876543211",
      defaultAddress: {
        name: "John Doe",
        phone: "+91 9876543211",
        address: "123 Main Street, Mumbai",
        pincode: "400001",
        city: "Mumbai",
        state: "Maharashtra",
      },
    });
    await regularUser.save();
    console.log("✓ Regular user created");

    // Create categories
    const categories = [
      {
        name: "T-Shirts",
        slug: "t-shirt",
        description: "Comfortable and stylish t-shirts",
        icon: "👕",
      },
      {
        name: "Hoodies",
        slug: "hoodie",
        description: "Cozy hoodies for all seasons",
        icon: "🧥",
      },
      {
        name: "Couple T-Shirts",
        slug: "couple-tshirts",
        description: "Perfect matching tees for couples",
        icon: "👫",
      },
      {
        name: "Shirts",
        slug: "shirts",
        description: "Formal and casual shirts",
        icon: "👔",
      },
      {
        name: "Blazers",
        slug: "blazers",
        description: "Professional blazers",
        icon: "🧥",
      },
      {
        name: "Writing",
        slug: "writing",
        description: "Premium writing accessories",
        icon: "✏️",
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log("✓ Categories created");

    // Create sample products
    const products = [
      {
        name: "Classic Wool Blazer",
        price: 8999,
        mrp: 12999,
        description: "Premium wool blazer for professional settings",
        category: createdCategories[4]._id, // Blazers
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        badge: "BESTSELLER",
        colors: [
          {
            name: "Black",
            value: "black",
            hex: "#1a1a1a",
            images: [
              "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
            ],
          },
        ],
        sizes: [
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
          { size: "XL", inStock: false },
        ],
        inStock: true,
        stock: 50,
      },
      {
        name: "Duo Moqueen x Sally Tees",
        price: 3599,
        mrp: 4999,
        description: "Fun couple tees perfect for matching outfits",
        category: createdCategories[2]._id, // Couple T-Shirts
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        badge: "NEW",
        colors: [
          {
            name: "Black",
            value: "black",
            hex: "#1a1a1a",
            images: [
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            ],
          },
          {
            name: "White",
            value: "white",
            hex: "#ffffff",
            images: [
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            ],
          },
        ],
        sizes: [
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
        ],
        inStock: true,
        stock: 75,
      },
      {
        name: "Premium Leather Journal Set",
        price: 3599,
        mrp: 4999,
        description: "High-quality leather journal with pen set",
        category: createdCategories[5]._id, // Writing
        image:
          "https://images.unsplash.com/photo-1507842620282-688a09869e09?w=500",
        badge: "PREMIUM",
        colors: [
          {
            name: "Brown",
            value: "brown",
            hex: "#8b6914",
            images: [
              "https://images.unsplash.com/photo-1507842620282-688a09869e09?w=500",
            ],
          },
        ],
        sizes: [{ size: "One Size", inStock: true }],
        inStock: true,
        stock: 30,
      },
      {
        name: "Artisanal Fountain Pen Collection",
        price: 8599,
        mrp: 9999,
        description: "Limited edition fountain pens with premium nibs",
        category: createdCategories[5]._id, // Writing
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
        badge: "LIMITED",
        colors: [
          {
            name: "Gold",
            value: "gold",
            hex: "#ffd700",
            images: [
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
            ],
          },
        ],
        sizes: [{ size: "One Size", inStock: false }],
        inStock: false,
        stock: 0,
      },
      {
        name: "Comfortable Cotton T-Shirt",
        price: 1299,
        mrp: 1999,
        description: "Breathable 100% cotton t-shirt",
        category: createdCategories[0]._id, // T-Shirts
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        badge: "ESSENTIAL",
        colors: [
          {
            name: "Navy",
            value: "navy",
            hex: "#000080",
            images: [
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            ],
          },
          {
            name: "White",
            value: "white",
            hex: "#ffffff",
            images: [
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            ],
          },
          {
            name: "Red",
            value: "red",
            hex: "#ff0000",
            images: [
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            ],
          },
        ],
        sizes: [
          { size: "XS", inStock: true },
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
          { size: "XL", inStock: true },
          { size: "XXL", inStock: false },
        ],
        inStock: true,
        stock: 150,
      },
      {
        name: "Cozy Hoodie",
        price: 2499,
        mrp: 3999,
        description: "Warm and comfortable hoodie perfect for any season",
        category: createdCategories[1]._id, // Hoodies
        image:
          "https://images.unsplash.com/photo-1556821552-7cf14fad7cfb?w=500",
        badge: "BESTSELLER",
        colors: [
          {
            name: "Gray",
            value: "gray",
            hex: "#808080",
            images: [
              "https://images.unsplash.com/photo-1556821552-7cf14fad7cfb?w=500",
            ],
          },
          {
            name: "Black",
            value: "black",
            hex: "#1a1a1a",
            images: [
              "https://images.unsplash.com/photo-1556821552-7cf14fad7cfb?w=500",
            ],
          },
        ],
        sizes: [
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
          { size: "XL", inStock: true },
        ],
        inStock: true,
        stock: 100,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log("✓ Products created");

    // Create coupons
    const coupons = [
      {
        code: "SOULVARD10",
        description: "10% discount on orders above ₹10,000",
        discountType: "percentage",
        discount: 10,
        minAmount: 10000,
        usageLimit: 100,
        usageCount: 0,
        isActive: true,
        freeShipping: false,
      },
      {
        code: "WELCOME",
        description: "20% welcome discount for new users",
        discountType: "percentage",
        discount: 20,
        minAmount: 0,
        usageLimit: 500,
        usageCount: 0,
        isActive: true,
        freeShipping: false,
      },
      {
        code: "FREESHIP",
        description: "Free shipping on all orders",
        discountType: "fixed",
        discount: 0,
        minAmount: 0,
        usageLimit: 1000,
        usageCount: 0,
        isActive: true,
        freeShipping: true,
      },
      {
        code: "SUMMER25",
        description: "25% off this summer",
        discountType: "percentage",
        discount: 25,
        minAmount: 5000,
        maxDiscount: 5000,
        usageLimit: 200,
        usageCount: 0,
        isActive: true,
        freeShipping: false,
      },
      {
        code: "SOULVARD15",
        description: "15% discount on orders above ₹50,000",
        discountType: "percentage",
        discount: 15,
        minAmount: 50000,
        usageLimit: 50,
        usageCount: 0,
        isActive: true,
        freeShipping: false,
      },
    ];

    await Coupon.insertMany(coupons);
    console.log("✓ Coupons created");

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("Admin:");
    console.log("  Email: admin@soulvard.com");
    console.log("  Password: admin123");
    console.log("\nRegular User:");
    console.log("  Email: user@soulvard.com");
    console.log("  Password: user123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedDatabase();
});
