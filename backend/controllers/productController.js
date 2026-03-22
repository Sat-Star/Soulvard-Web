const Product = require("../models/Product");
const Category = require("../models/Category");
const { calculateDiscount } = require("../utils/validators");

// Get all products - OPTIMIZED
exports.getAllProducts = async (req, res) => {
  try {
    const { category, inStock, sort, search, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    let filter = {};

    // Filter by category - only if provided
    if (category && category.trim()) {
      try {
        const categoryDoc = await Category.findOne({
          $or: [{ slug: category }, { _id: category }],
        }).lean();
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          // Category not found, return empty results
          return res.status(200).json({
            success: true,
            data: [],
            pagination: {
              total: 0,
              page: pageNum,
              limit: limitNum,
              pages: 0,
            },
          });
        }
      } catch (err) {
        console.error("Category lookup error:", err);
      }
    }

    // Filter by stock
    if (inStock === "true") {
      filter.inStock = true;
    }

    // Search by name or description using text index
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    switch (sort) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "price-low":
        sortObj = { price: 1 };
        break;
      case "price-high":
        sortObj = { price: -1 };
        break;
      case "name":
        sortObj = { name: 1 };
        break;
      case "featured":
        sortObj = { badge: 1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    // Execute both queries in parallel for better performance
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use .lean() for read-only data to improve performance
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      mrp,
      description,
      category,
      image,
      badge,
      colors,
      sizes,
      inStock,
      stock,
      sku,
    } = req.body;

    if (!name || !price || !mrp || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = new Product({
      name,
      price,
      mrp,
      description,
      category,
      image,
      badge,
      colors,
      sizes,
      inStock: inStock !== undefined ? inStock : true,
      stock: stock || 0,
      sku,
    });

    await product.save();
    await product.populate("category", "name slug");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      mrp,
      description,
      category,
      image,
      badge,
      colors,
      sizes,
      inStock,
      stock,
      sku,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        mrp,
        description,
        category,
        image,
        badge,
        colors,
        sizes,
        inStock,
        stock,
        sku,
      },
      { new: true, runValidators: true },
    ).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
