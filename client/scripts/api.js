/**
 * API Helper - All backend API calls
 * Base URL: http://localhost:5000/api
 */

const API_BASE_URL = "http://localhost:5000/api";

function getHomePagePath() {
  return window.location.pathname.includes("/admin/")
    ? "../client/index.html"
    : "index.html";
}

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem("authToken");
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Storage write skipped for ${key}:`, error);
  }
}

// Set auth token
function setAuthToken(token) {
  safeSetItem("authToken", token);
}

// Clear auth token
function clearAuthToken() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
}

// Get current user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

// Set current user (SECURITY: Don't store role to prevent privilege escalation)
function setCurrentUser(user) {
  // Only store essential user info, NOT role
  const safeUser = {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    // DO NOT store: role, addresses, phone, sensitive data
  };
  safeSetItem("currentUser", JSON.stringify(safeUser));
}

// Helper function for API calls with auth
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if it exists
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - token expired or invalid
      if (response.status === 401) {
        clearAuthToken();
        window.location.href = getHomePagePath();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ==================== AUTHENTICATION ====================

const authAPI = {
  // Register new user
  register: async (name, email, password, phone) => {
    const response = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
    if (response.token) {
      setAuthToken(response.token);
      setCurrentUser(response.data);
    }
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setAuthToken(response.token);
      setCurrentUser(response.data);
    }
    return response;
  },

  // Get user profile
  getProfile: async () => {
    return await apiCall("/auth/profile", { method: "GET" });
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await apiCall("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Add delivery address
  addAddress: async (addressData) => {
    return await apiCall("/auth/address", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
  },

  // Delete delivery address
  deleteAddress: async (addressId) => {
    return await apiCall(`/auth/address/${addressId}`, {
      method: "DELETE",
    });
  },

  // Logout
  logout: () => {
    clearAuthToken();
  },
};

// ==================== PRODUCTS ====================

const productsAPI = {
  // Get all products with filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    if (filters.sort) queryParams.append("sort", filters.sort);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? "?" + queryString : ""}`;
    return await apiCall(endpoint, { method: "GET" });
  },

  // Get single product
  getById: async (productId) => {
    return await apiCall(`/products/${productId}`, { method: "GET" });
  },

  // Create product (admin only)
  create: async (productData) => {
    return await apiCall("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  // Update product (admin only)
  update: async (productId, productData) => {
    return await apiCall(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  // Delete product (admin only)
  delete: async (productId) => {
    return await apiCall(`/products/${productId}`, {
      method: "DELETE",
    });
  },
};

// ==================== CATEGORIES ====================

const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return await apiCall("/categories", { method: "GET" });
  },

  // Get single category
  getById: async (categoryId) => {
    return await apiCall(`/categories/${categoryId}`, { method: "GET" });
  },

  // Create category (admin only)
  create: async (categoryData) => {
    return await apiCall("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  // Update category (admin only)
  update: async (categoryId, categoryData) => {
    return await apiCall(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category (admin only)
  delete: async (categoryId) => {
    return await apiCall(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  },
};

// ==================== CART ====================

const cartAPI = {
  // Get cart
  get: async () => {
    return await apiCall("/cart", { method: "GET" });
  },

  // Add to cart
  add: async (productId, quantity, size, color) => {
    return await apiCall("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, size, color }),
    });
  },

  // Update cart item
  update: async (itemId, quantity) => {
    return await apiCall(`/cart/update/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove from cart
  remove: async (itemId) => {
    return await apiCall(`/cart/remove/${itemId}`, {
      method: "DELETE",
    });
  },

  // Clear cart
  clear: async () => {
    return await apiCall("/cart/clear", {
      method: "DELETE",
    });
  },
};

// ==================== WISHLIST ====================

const wishlistAPI = {
  // Get wishlist
  get: async () => {
    return await apiCall("/wishlist", { method: "GET" });
  },

  // Add to wishlist
  add: async (productId) => {
    return await apiCall("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  // Remove from wishlist
  remove: async (productId) => {
    return await apiCall(`/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
  },

  // Check if product is in wishlist
  check: async (productId) => {
    return await apiCall(`/wishlist/check/${productId}`, {
      method: "GET",
    });
  },

  // Clear wishlist
  clear: async () => {
    return await apiCall("/wishlist/clear", {
      method: "DELETE",
    });
  },
};

// ==================== ORDERS ====================

const ordersAPI = {
  // Create order
  create: async (orderData) => {
    return await apiCall("/orders/create", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // Get user's orders
  getMyOrders: async () => {
    return await apiCall("/orders/my-orders", { method: "GET" });
  },

  // Get single order
  getById: async (orderId) => {
    return await apiCall(`/orders/${orderId}`, { method: "GET" });
  },

  // Cancel order
  cancel: async (orderId) => {
    return await apiCall(`/orders/cancel/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({}),
    });
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    return await apiCall("/orders/all", { method: "GET" });
  },

  // Update order status (admin only)
  updateStatus: async (orderId, status) => {
    return await apiCall(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== COUPONS ====================

const couponsAPI = {
  // Get all coupons
  getAll: async () => {
    return await apiCall("/coupons", { method: "GET" });
  },

  // Validate coupon
  validate: async (code, orderAmount) => {
    return await apiCall("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, orderAmount }),
    });
  },

  // Create coupon (admin only)
  create: async (couponData) => {
    return await apiCall("/coupons", {
      method: "POST",
      body: JSON.stringify(couponData),
    });
  },

  // Update coupon (admin only)
  update: async (couponId, couponData) => {
    return await apiCall(`/coupons/${couponId}`, {
      method: "PUT",
      body: JSON.stringify(couponData),
    });
  },

  // Delete coupon (admin only)
  delete: async (couponId) => {
    return await apiCall(`/coupons/${couponId}`, {
      method: "DELETE",
    });
  },
};

// ==================== NOTIFICATIONS ====================

const notificationsAPI = {
  // Subscribe to newsletter
  subscribeNewsletter: async (email) => {
    return await apiCall("/notifications/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Register for stock notification
  registerStockNotification: async (productId, email) => {
    return await apiCall("/notifications/stock-alert", {
      method: "POST",
      body: JSON.stringify({ productId, email }),
    });
  },

  // Get newsletter subscribers (admin only)
  getSubscribers: async () => {
    return await apiCall("/notifications/subscribers", { method: "GET" });
  },

  // Get stock notifications (admin only)
  getStockNotifications: async () => {
    return await apiCall("/notifications/stock-alerts", { method: "GET" });
  },
};

// ==================== UTILITY FUNCTIONS ====================

// Check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Check if user is admin (SECURITY: Always verify with backend)
async function isAdmin() {
  try {
    const user = await authAPI.getProfile();
    return user && user.role === "admin";
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
}

// Get user role (SECURITY: Always verify with backend)
async function getUserRole() {
  try {
    const user = await authAPI.getProfile();
    return user ? user.role : null;
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
}

// Get user name
function getUserName() {
  const user = getCurrentUser();
  return user ? user.name : "Guest";
}

// Redirect to login if not authenticated
function requireLogin() {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = getHomePagePath();
  }
}

// Redirect to login if not admin (SECURITY: Always verify with backend)
async function requireAdmin() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    alert("Admin access required");
    window.location.href = getHomePagePath();
  }
}

// Show success notification
function showSuccess(message) {
  const notification = document.createElement("div");
  notification.className = "notification success";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Show error notification
function showError(message) {
  const notification = document.createElement("div");
  notification.className = "notification error";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Format price in INR
function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN");
}
