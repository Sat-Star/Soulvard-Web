# Soulvard E-Commerce - Code Review Fixes & Solutions

## CRITICAL FIXES - IMPLEMENT IMMEDIATELY

---

### FIX #1: Remove User Role from localStorage (XSS Prevention)

**Current Code (VULNERABLE):**

```javascript
// client/scripts/api.js - Lines 46-47
function setCurrentUser(user) {
  safeSetItem("currentUser", JSON.stringify(user));
}

// Used in isAdmin() - Lines 407-409
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin"; // CLIENT-SIDE ONLY!
}
```

**FIXED Code:**

```javascript
// client/scripts/api.js
function setCurrentUser(user) {
  // Only store userId and basic info, NOT role
  const safeUser = {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    // DO NOT store: role, addresses, phone
  };
  safeSetItem("currentUser", JSON.stringify(safeUser));
}

// Fetch role from backend API only
async function isAdmin() {
  try {
    const user = await authAPI.getProfile();
    return user && user.role === "admin";
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
}

// Always verify on backend before admin operations
async function requireAdmin() {
  const isAdmin = await isAdmin();
  if (!isAdmin) {
    alert("Admin access required");
    window.location.href = getHomePagePath();
  }
}
```

**Backend Verification (Already Correct - backend/middleware/auth.js):**

```javascript
// This already exists - good!
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking admin role",
      error: error.message,
    });
  }
};
```

---

### FIX #2: Add Phone & Pincode Validation (Input Validation)

**Current Code (INCOMPLETE):**

```javascript
// client/scripts/cart.js - Lines 210-214
function saveDeliveryInfo(event) {
  event.preventDefault();

  deliveryInfo = {
    name: document.getElementById("editName").value,
    phone: document.getElementById("editPhone").value, // NO VALIDATION
    email: document.getElementById("editEmail").value, // NO VALIDATION
    address: document.getElementById("editAddress").value,
    pincode: document.getElementById("editPincode").value, // NO VALIDATION
    city: document.getElementById("editCity").value,
    state: document.getElementById("editState").value,
  };

  updateDeliveryDisplay();
  closeDeliveryModal();
}
```

**FIXED Code:**

```javascript
// Add these validators at top of cart.js (copy from backend)
function validateEmail(email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/; // At least 10 digits
  return phoneRegex.test(phone);
}

function validatePincode(pincode) {
  const pincodeRegex = /^\d{5,6}$/; // 5-6 digits for India
  return pincodeRegex.test(pincode);
}

function saveDeliveryInfo(event) {
  event.preventDefault();

  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const address = document.getElementById("editAddress").value.trim();
  const pincode = document.getElementById("editPincode").value.trim();
  const city = document.getElementById("editCity").value.trim();
  const state = document.getElementById("editState").value.trim();

  // Validation with specific error messages
  if (!name || name.length < 2) {
    showToast("Name must be at least 2 characters", "error");
    return;
  }

  if (!validateEmail(email)) {
    showToast("Please enter a valid email address", "error");
    return;
  }

  if (!validatePhone(phone)) {
    showToast("Please enter a valid phone number (10+ digits)", "error");
    return;
  }

  if (!address || address.length < 5) {
    showToast("Please enter a valid address", "error");
    return;
  }

  if (!validatePincode(pincode)) {
    showToast("Please enter a valid pincode (5-6 digits)", "error");
    return;
  }

  if (!city || city.length < 2) {
    showToast("Please select a valid city", "error");
    return;
  }

  if (!state || state.length < 2) {
    showToast("Please select a valid state", "error");
    return;
  }

  // Save to backend
  authAPI
    .addAddress({
      name,
      email,
      phone,
      address,
      pincode,
      city,
      state,
    })
    .then((response) => {
      if (response.success) {
        deliveryInfo = { name, email, phone, address, pincode, city, state };
        updateDeliveryDisplay();
        closeDeliveryModal();
        showToast("Address saved successfully", "success");
      } else {
        showToast("Failed to save address: " + response.message, "error");
      }
    })
    .catch((error) => {
      showToast("Error saving address: " + error.message, "error");
    });
}
```

---

### FIX #3: Remove Client-Side Coupon Validation (Security)

**Current Code (VULNERABLE):**

```javascript
// client/scripts/cart.js - Lines 124-140
function validateCoupon(code, subtotal) {
  const validCoupons = {
    SOULVARD10: {
      minAmount: 10000,
      discount: 0.1,
      message: "10% discount applied!",
    },
    SOULVARD15: {
      minAmount: 50000,
      discount: 0.15,
      message: "15% discount applied!",
    },
    // ALL COUPONS EXPOSED IN CLIENT-SIDE CODE
  };
  // Attacker can:
  // 1. See all valid codes
  // 2. Modify discount percentages
  // 3. Lower minAmount requirements
}

function calculateDiscount(subtotal, couponCode) {
  const validCoupons = {
    SOULVARD10: { discount: 0.1 },
    SOULVARD15: { discount: 0.15 },
    // DUPLICATE CODE
  };
}
```

**FIXED Code:**

```javascript
// client/scripts/cart.js - REMOVE validateCoupon() function entirely
// REMOVE calculateDiscount() function entirely
// These functions will be called via API only

// Update processCouponApplication to use ONLY API
function processCouponApplication(couponCode, couponMessage, applyBtn) {
  const originalText = applyBtn.textContent;
  applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  applyBtn.disabled = true;

  if (!couponCode) {
    couponMessage.textContent = "Please enter a coupon code";
    couponMessage.className = "coupon-message error";
    applyBtn.textContent = originalText;
    applyBtn.disabled = false;
    return;
  }

  if (cartItems.length === 0) {
    couponMessage.textContent = "Your cart is empty";
    couponMessage.className = "coupon-message error";
    applyBtn.textContent = originalText;
    applyBtn.disabled = false;
    return;
  }

  // Calculate subtotal
  const subtotal = calculateSubtotal();

  // ONLY validate on backend
  couponsAPI
    .validate(couponCode, subtotal) // API does validation now
    .then((response) => {
      if (response.success && response.data.valid) {
        // Backend returns discount amount (not percentage)
        localStorage.setItem("appliedCoupon", couponCode);
        localStorage.setItem("appliedDiscount", response.data.discountAmount);

        document.getElementById("couponMessage").textContent =
          response.data.message || "Coupon applied successfully!";
        document.getElementById("couponMessage").className =
          "coupon-message success";
        document.getElementById("couponMessageMobile").textContent =
          response.data.message || "Coupon applied successfully!";
        document.getElementById("couponMessageMobile").className =
          "coupon-message success";

        document.getElementById("couponCode").value = couponCode;
        document.getElementById("couponCodeMobile").value = couponCode;

        updateOrderSummary();
        showToast("Coupon applied successfully!", "success");
      } else {
        const errorMsg = response.data?.message || "Invalid coupon code";
        couponMessage.textContent = errorMsg;
        couponMessage.className = "coupon-message error";
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("appliedDiscount");
        updateOrderSummary();
      }
    })
    .catch((error) => {
      console.error("Error validating coupon:", error);
      couponMessage.textContent = "Error validating coupon";
      couponMessage.className = "coupon-message error";
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("appliedDiscount");
      updateOrderSummary();
    })
    .finally(() => {
      applyBtn.textContent = originalText;
      applyBtn.disabled = false;
    });
}

// Update discount calculation to use backend value
function updateOrderSummary() {
  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  // Use backend-calculated discount
  let discount = 0;
  const appliedDiscount = localStorage.getItem("appliedDiscount");
  if (appliedDiscount) {
    discount = parseInt(appliedDiscount);
  }

  const shipping = subtotal > 5000 ? 0 : 499;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  document.getElementById("subtotal").textContent =
    "₹" + formatCurrency(subtotal);
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : "₹" + formatCurrency(shipping);
  document.getElementById("tax").textContent = "₹" + formatCurrency(tax);

  const discountRow = document.getElementById("discount-row");
  const discountValue = document.getElementById("discount-value");

  if (discount > 0) {
    discountRow.style.display = "flex";
    discountValue.textContent = "−₹" + formatCurrency(discount);
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("total").textContent = "₹" + formatCurrency(total);
}
```

**Backend Endpoint Update Needed (backend/routes/coupons.js):**

```javascript
// Make sure validate endpoint returns discount amount, not percentage
router.post("/validate", async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    // Validate coupon
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Calculate actual discount amount
    const discountAmount = Math.round(
      (orderAmount * coupon.discountPercent) / 100,
    );

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        discountAmount: discountAmount, // Send amount, not percentage
        message: `${coupon.discountPercent}% discount applied!`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating coupon",
      error: error.message,
    });
  }
});
```

---

### FIX #4: Fix Cart Race Condition (Concurrent Operations)

**Current Code (VULNERABLE):**

```javascript
// client/scripts/cart.js - Lines 91-125
function updateQuantity(itemId, change) {
  const item = cartItems.find(
    (item) => item._id === itemId || item.id === itemId,
  );
  if (!item) return;

  const newQuantity = item.quantity + change;
  if (newQuantity < 1) {
    removeItem(itemId);
    return;
  }
  if (newQuantity > 10) {
    showToast("Maximum quantity is 10", "error");
    return;
  }

  // PROBLEM: Updates local state before API confirms
  const cartItemId = item._id || item.id;
  cartAPI
    .update(cartItemId, newQuantity)
    .then((response) => {
      if (response.success) {
        item.quantity = newQuantity; // Updated here but UI already changed!
        renderCartItems();
        updateOrderSummary();
        updateMobileShippingNote();
        showToast("Quantity updated", "success");
      } else {
        showToast("Failed to update quantity", "error");
        // UI already changed - never reverts!
      }
    })
    .catch((error) => {
      console.error("Error updating quantity:", error);
      showToast("Error updating quantity: " + error.message, "error");
      // Quantity never reverted!
    });
}
```

**FIXED Code:**

```javascript
// client/scripts/cart.js
// Track in-flight operations
let inFlightOperations = new Set();

function updateQuantity(itemId, change) {
  const item = cartItems.find(
    (item) => item._id === itemId || item.id === itemId,
  );
  if (!item) return;

  const newQuantity = item.quantity + change;

  // Validation
  if (newQuantity < 1) {
    removeItem(itemId);
    return;
  }
  if (newQuantity > 10) {
    showToast("Maximum quantity is 10", "error");
    return;
  }

  // Disable button during operation
  const cartItemId = item._id || item.id;
  if (inFlightOperations.has(cartItemId)) {
    showToast("Please wait for previous update to complete", "error");
    return;
  }

  inFlightOperations.add(cartItemId);
  const originalQuantity = item.quantity; // Store original for rollback

  // Store old state for rollback
  const oldQuantity = item.quantity;

  // Disable UI while updating
  disableQuantityButtons(cartItemId, true);

  cartAPI
    .update(cartItemId, newQuantity)
    .then((response) => {
      if (response.success) {
        item.quantity = newQuantity;
        renderCartItems();
        updateOrderSummary();
        updateMobileShippingNote();
        showToast("Quantity updated", "success");
      } else {
        // Rollback on failure
        item.quantity = oldQuantity;
        renderCartItems();
        showToast("Failed to update quantity: " + response.message, "error");
      }
    })
    .catch((error) => {
      // Rollback on error
      item.quantity = oldQuantity;
      renderCartItems();
      console.error("Error updating quantity:", error);
      showToast("Error updating quantity. Please try again.", "error");
    })
    .finally(() => {
      inFlightOperations.delete(cartItemId);
      disableQuantityButtons(cartItemId, false);
    });
}

function disableQuantityButtons(itemId, disabled) {
  const element = document.querySelector(`[data-id="${itemId}"]`);
  if (element) {
    const buttons = element.querySelectorAll(".qty-btn");
    buttons.forEach((btn) => (btn.disabled = disabled));
  }
}

// Apply same pattern to removeItem() and addToCart()
function removeItem(itemId) {
  const item = cartItems.find(
    (item) => item._id === itemId || item.id === itemId,
  );
  if (!item) return;

  const cartItemId = item._id || item.id;

  // Prevent duplicate operations
  if (inFlightOperations.has(cartItemId)) {
    showToast("Please wait for previous operation to complete", "error");
    return;
  }

  inFlightOperations.add(cartItemId);
  const itemIndex = cartItems.indexOf(item);

  // Disable button
  const removeBtn = document.querySelector(
    `[data-id="${cartItemId}"] .remove-btn`,
  );
  if (removeBtn) removeBtn.disabled = true;

  cartAPI
    .remove(cartItemId)
    .then((response) => {
      if (response.success) {
        cartItems.splice(itemIndex, 1);
        renderCartItems();
        updateOrderSummary();
        updateCartCount();
        updateMobileShippingNote();
        showToast("Item removed from cart", "success");
      } else {
        showToast("Failed to remove item", "error");
      }
    })
    .catch((error) => {
      console.error("Error removing item:", error);
      showToast("Error removing item: " + error.message, "error");
    })
    .finally(() => {
      inFlightOperations.delete(cartItemId);
      if (removeBtn) removeBtn.disabled = false;
    });
}
```

---

### FIX #5: Validate ObjectId Before API Call (NoSQL Injection Prevention)

**Current Code (VULNERABLE):**

```javascript
// client/scripts/api.js - Lines 176-177
getById: async (productId) => {
  return await apiCall(`/products/${productId}`, { method: "GET" });
  // No validation - productId could be: 1; db.products.drop(); --
},

// client/scripts/product_cart.js - Line 120
const productId = getProductIdFromURL();
if (!productId) {
  showNotification("Product ID not found", "error");
  return false;
}
// Still calls API without validating ObjectId format!
```

**FIXED Code:**

```javascript
// client/scripts/api.js - Add ObjectId validator

/**
 * Validates if string is a valid MongoDB ObjectId (24 hex characters)
 * @param {string} id - String to validate
 * @returns {boolean} True if valid ObjectId format
 */
function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

const productsAPI = {
  // Get single product
  getById: async (productId) => {
    if (!productId || !isValidObjectId(productId)) {
      throw new Error("Invalid product ID format");
    }
    return await apiCall(`/products/${productId}`, { method: "GET" });
  },

  // Update product (with validation)
  update: async (productId, productData) => {
    if (!productId || !isValidObjectId(productId)) {
      throw new Error("Invalid product ID format");
    }
    return await apiCall(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  // Delete product (with validation)
  delete: async (productId) => {
    if (!productId || !isValidObjectId(productId)) {
      throw new Error("Invalid product ID format");
    }
    return await apiCall(`/products/${productId}`, {
      method: "DELETE",
    });
  },
};

// client/scripts/product_cart.js - Update load function
async function loadProductData() {
  try {
    const productId = getProductIdFromURL();

    if (!productId) {
      showNotification("Product ID not found", "error");
      return false;
    }

    // NEW: Validate ObjectId format
    if (!isValidObjectId(productId)) {
      showNotification("Invalid product ID", "error");
      return false;
    }

    console.log("Loading product:", productId);
    const response = await productsAPI.getById(productId);
    console.log("Product API Response:", response);

    if (response.success && response.data) {
      product = response.data;
      const displayColors = getDisplayColors();
      selectedColor = displayColors.length > 0 ? displayColors[0] : null;
      console.log("Product loaded successfully:", product.name);
      return true;
    } else {
      showNotification("Product not found", "error");
      return false;
    }
  } catch (error) {
    console.error("Error loading product:", error);
    showNotification("Error loading product: " + error.message, "error");
    return false;
  }
}
```

---

### FIX #6: Add CSRF Protection (CSRF Token)

**Backend - Add CSRF Middleware:**

```javascript
// backend/middleware/csrf.js
const crypto = require("crypto");

exports.generateCSRFToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

exports.verifyCSRFToken = (req, res, next) => {
  const token = req.headers["x-csrf-token"] || req.body._csrf;

  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed",
    });
  }

  next();
};

// backend/server.js - Add middleware
const csrf = require("./middleware/csrf");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(csrf.generateCSRFToken);
app.post("/api/*", csrf.verifyCSRFToken); // Protect all POST requests
```

**Frontend - Include CSRF Token:**

```javascript
// client/scripts/api.js

// Get CSRF token from response headers or meta tag
function getCSRFToken() {
  // Method 1: From meta tag (if backend adds it to HTML)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) return metaTag.getAttribute("content");

  // Method 2: Fetch from server endpoint
  // (Make this a separate endpoint that returns token)
  return sessionStorage.getItem("csrfToken");
}

// Initialize CSRF token on page load
async function initializeCSRFToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/csrf-token`, {
      method: "GET",
      credentials: "include", // Include cookies
    });
    const data = await response.json();
    if (data.token) {
      sessionStorage.setItem("csrfToken", data.token);
    }
  } catch (error) {
    console.warn("Could not fetch CSRF token:", error);
  }
}

// Call on app load
document.addEventListener("DOMContentLoaded", initializeCSRFToken);

// Update apiCall to include CSRF token
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add CSRF token for state-changing operations
  if (["POST", "PUT", "DELETE", "PATCH"].includes(options.method || "GET")) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include cookies for session
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        window.location.href = getHomePagePath();
        throw new Error("Session expired. Please login again.");
      }
      if (response.status === 403 && data.message.includes("CSRF")) {
        // Refresh token and retry once
        await initializeCSRFToken();
        throw new Error("Security validation failed, please try again.");
      }
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

---

### FIX #7: Implement Token Refresh Mechanism

**Backend - Add Refresh Token:**

```javascript
// backend/middleware/auth.js
const TOKEN_EXPIRY = "1h"; // Short-lived access token
const REFRESH_TOKEN_EXPIRY = "7d"; // Long-lived refresh token

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

exports.generateRefreshToken = (id) => {
  return jwt.sign({ id, type: "refresh" }, process.env.REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const newAccessToken = exports.generateToken(user._id);
    const newRefreshToken = exports.generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
      error: error.message,
    });
  }
};
```

**Frontend - Implement Token Refresh:**

```javascript
// client/scripts/api.js
let accessToken = localStorage.getItem("authToken");
let refreshToken = localStorage.getItem("refreshToken");
let tokenRefreshPromise = null;

function setAuthToken(token, newRefreshToken) {
  safeSetItem("authToken", token);
  accessToken = token;
  if (newRefreshToken) {
    safeSetItem("refreshToken", newRefreshToken);
    refreshToken = newRefreshToken;
  }
}

async function refreshAccessToken() {
  // Prevent multiple simultaneous refresh attempts
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token refresh failed");
      }

      setAuthToken(data.accessToken, data.refreshToken);
      return data.accessToken;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}

// Update apiCall to handle token expiry
async function apiCall(endpoint, options = {}) {
  let retries = 0;
  const maxRetries = 1;

  async function makeRequest() {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401 && retries < maxRetries) {
          if (data.message && data.message.includes("token expired")) {
            retries++;
            try {
              await refreshAccessToken();
              return makeRequest(); // Retry with new token
            } catch (refreshError) {
              clearAuthToken();
              window.location.href = getHomePagePath();
              throw new Error("Session expired. Please login again.");
            }
          }
        }

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

  return makeRequest();
}
```

---

## MAJOR FIXES

### FIX #8: Complete Checkout Workflow

**Create checkout.html** with proper form and validation (detailed in separate document)

**Add Checkout API Endpoint:**

```javascript
// backend/routes/orders.js
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { items, deliveryAddress, billingAddress, couponCode } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.phone) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // Validate all items still exist and are in stock
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }
      // Check size is in stock
      const size = product.sizes?.find((s) => s.size === item.size);
      if (!size || !size.inStock) {
        return res.status(400).json({
          success: false,
          message: `${product.name} size ${item.size} is out of stock`,
        });
      }
    }

    // Validate coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }
      // Calculate discount
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order of ₹${coupon.minOrderAmount} required`,
        });
      }
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    }

    // Create order
    const order = new Order({
      userId: req.user._id,
      items,
      deliveryAddress,
      billingAddress,
      couponCode,
      discount,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();
    await order.populate("items.productId");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
});
```

---

## SUMMARY OF ALL FIXES

| Issue                            | File                    | Lines          | Fix Type                   |
| -------------------------------- | ----------------------- | -------------- | -------------------------- |
| XSS in localStorage              | api.js                  | 46-47, 407-409 | Move role to backend       |
| Missing phone/pincode validation | cart.js                 | 210-214        | Add validators             |
| Client-side coupon validation    | cart.js                 | 124-140        | Remove, use API only       |
| Cart race condition              | cart.js                 | 91-125         | Disable buttons, queue ops |
| No ObjectId validation           | api.js, product_cart.js | 176, 120       | Add validator function     |
| No CSRF protection               | api.js                  | 51-88          | Add CSRF token header      |
| No token refresh                 | api.js                  | Various        | Implement refresh flow     |
| Missing checkout                 | product_cart.js         | 540            | Create page & API          |

---

**Total Critical Fixes: 7**
**Total Major Fixes: 5+**
**Estimated Implementation Time: 4-6 hours**
