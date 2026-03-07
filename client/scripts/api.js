/**
 * API Utilities for Customer Portal
 * Handles all API requests with authentication
 */

// Auto-detect API URL based on current location
// If running on localhost, use the same host/port for API
const API_URL = window.location.origin;

// ===== HELPER FUNCTIONS =====

/**
 * Get JWT token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem("token");
}

/**
 * Make API request with authentication
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle unauthorized
    if (response.status === 401 || response.status === 403) {
      localStorage.clear();
      window.location.href = "/login.html";
      return null;
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);
    return null;
  }
}

// ===== PRODUCTS =====

/**
 * Get all products from API
 */
async function getProducts() {
  try {
    const response = await apiRequest("/api/products");
    if (!response || !response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Get single product by ID
 */
async function getProductById(productId) {
  try {
    const response = await apiRequest(`/api/products/${productId}`);
    if (!response || !response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// ===== CATEGORIES =====

/**
 * Get all categories
 */
async function getCategories() {
  try {
    const response = await apiRequest("/api/categories");
    if (!response || !response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ===== COUPONS =====

/**
 * Validate coupon code
 */
async function validateCoupon(code) {
  try {
    const response = await apiRequest("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (!response || !response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error validating coupon:", error);
    return null;
  }
}

// ===== WISHLIST =====

/**
 * Load wishlist from localStorage
 */
function getWishlist() {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
}

/**
 * Save wishlist to localStorage
 */
function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/**
 * Add product to wishlist
 */
function addToWishlist(product) {
  const wishlist = getWishlist();
  const exists = wishlist.find((item) => item._id === product._id);

  if (!exists) {
    wishlist.push(product);
    saveWishlist(wishlist);
    return true;
  }
  return false;
}

/**
 * Remove product from wishlist
 */
function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((item) => item._id !== productId);
  saveWishlist(wishlist);
  return true;
}

/**
 * Check if product is in wishlist
 */
function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some((item) => item._id === productId);
}

// ===== CART =====

/**
 * Load cart from localStorage
 */
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Add product to cart
 */
function addToCart(
  product,
  quantity = 1,
  selectedColor = "",
  selectedSize = "",
) {
  const cart = getCart();

  // Check if product already exists in cart
  const existingItem = cart.find(
    (item) =>
      item._id === product._id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
      cartItemId: Date.now(), // Unique ID for this cart item
    });
  }

  saveCart(cart);
  updateCartCount();
  return true;
}

/**
 * Remove product from cart
 */
function removeFromCart(cartItemId) {
  let cart = getCart();
  cart = cart.filter((item) => item.cartItemId !== cartItemId);
  saveCart(cart);
  updateCartCount();
  return true;
}

/**
 * Update cart item quantity
 */
function updateCartQuantity(cartItemId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.cartItemId === cartItemId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
      updateCartCount();
    }
    return true;
  }
  return false;
}

/**
 * Get cart total
 */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Get cart item count
 */
function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Update cart count display
 */
function updateCartCount() {
  const count = getCartCount();
  const cartCounter = document.querySelector(".cart-count");
  if (cartCounter) {
    cartCounter.textContent = count;
    cartCounter.style.display = count > 0 ? "flex" : "none";
  }
}

/**
 * Clear cart
 */
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  return true;
}

// ===== USER =====

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

/**
 * Logout user
 */
function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}

// ===== UTILITIES =====

/**
 * Format price in Indian currency
 */
function formatPrice(price) {
  return "₹" + Math.round(price).toLocaleString("en-IN");
}

/**
 * Format product for display
 */
function formatProduct(product) {
  return {
    ...product,
    priceFormatted: formatPrice(product.price),
    imageUrl:
      product.images && product.images.length > 0
        ? product.images[0]
        : "https://via.placeholder.com/300",
  };
}

/**
 * Filter products by category
 */
function filterProductsByCategory(products, category) {
  if (!category || category === "all") return products;
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Search products
 */
function searchProducts(products, query) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)),
  );
}

/**
 * Sort products
 */
function sortProducts(products, sortBy = "name") {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return sorted;
}

// ===== HERO IMAGES =====

/**
 * Get all hero images from API
 */
async function getHeroImages() {
  try {
    const response = await apiRequest("/api/hero-images");
    if (!response || !response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }
}

// ===== PROMOTIONS =====

/**
 * Get active promotion from API
 */
async function getActivePromotion() {
  try {
    const response = await apiRequest("/api/promotions");
    if (!response || !response.ok) return null;
    const promotions = await response.json();
    // Return first active promotion
    return promotions.find((p) => p.active) || promotions[0] || null;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return null;
  }
}

// ===== TESTIMONIALS =====

/**
 * Get all testimonials from API
 */
async function getTestimonials() {
  try {
    const response = await apiRequest("/api/testimonials");
    if (!response || !response.ok) {
      // If endpoint doesn't exist, return empty array (graceful degradation)
      console.warn("Testimonials endpoint not available");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// ===== SIZE CHARTS =====

/**
 * Get all size charts from API
 */
async function getSizeCharts() {
  try {
    const response = await apiRequest("/api/size-charts");
    if (!response || !response.ok) {
      console.warn("Size charts endpoint not available");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching size charts:", error);
    return [];
  }
}

/**
 * Get size chart by category from API
 */
async function getSizeChartByCategory(category) {
  try {
    const response = await apiRequest(`/api/size-charts/${category}`);
    if (!response || !response.ok) {
      console.warn(`Size chart not found for category: ${category}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching size chart for ${category}:`, error);
    return null;
  }
}
