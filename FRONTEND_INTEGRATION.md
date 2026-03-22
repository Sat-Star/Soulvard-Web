# 🔗 Frontend Integration Guide

This guide shows how to update your frontend code to use the new backend API instead of hardcoded data.

---

## 🎯 Overview

Your frontend currently uses:

- Hardcoded product data in JavaScript arrays
- localStorage for cart/wishlist persistence
- No user authentication

Update to:

- API calls to fetch dynamic data
- JWT token-based authentication
- Server-side cart/wishlist storage

---

## 📱 Client-Side Setup

### Step 1: Store Token After Login

**File:** `client/scripts/index.js` (or create `client/scripts/auth.js`)

```javascript
// Authentication utilities
const auth = {
  // Store token after login
  setToken(token) {
    localStorage.setItem("token", token);
  },

  // Get token for API calls
  getToken() {
    return localStorage.getItem("token");
  },

  // Clear token on logout
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirect to home
  },

  // Store user info
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken();
  },
};
```

---

## 🔐 API Helper Functions

**File:** `client/scripts/api.js` (new file)

```javascript
const API_BASE = "/api";

// Generic API call function with auth
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API Error");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);

    // Handle token expiry
    if (response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    throw error;
  }
}

// ========== PRODUCTS ==========
const productsAPI = {
  // Get all products
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const queryString = params.toString();
    return apiCall(`/products${queryString ? "?" + queryString : ""}`);
  },

  // Get single product
  async getOne(id) {
    return apiCall(`/products/${id}`);
  },
};

// ========== AUTHENTICATION ==========
const authAPI = {
  // Register
  async register(userData) {
    const response = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    auth.setToken(response.token);
    auth.setUser(response.data);
    return response;
  },

  // Login
  async login(email, password) {
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    auth.setToken(response.token);
    auth.setUser(response.data);
    return response;
  },

  // Get profile
  async getProfile() {
    return apiCall("/auth/profile");
  },

  // Update profile
  async updateProfile(data) {
    return apiCall("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ========== CART ==========
const cartAPI = {
  // Get cart
  async get() {
    return apiCall("/cart");
  },

  // Add to cart
  async add(productId, quantity = 1, size, color) {
    return apiCall("/cart/add", {
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity,
        size,
        color,
        colorValue: color?.toLowerCase(),
      }),
    });
  },

  // Update quantity
  async update(itemId, quantity) {
    return apiCall(`/cart/update/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item
  async remove(itemId) {
    return apiCall(`/cart/remove/${itemId}`, {
      method: "DELETE",
    });
  },

  // Clear cart
  async clear() {
    return apiCall("/cart/clear", {
      method: "DELETE",
    });
  },
};

// ========== WISHLIST ==========
const wishlistAPI = {
  // Get wishlist
  async get() {
    return apiCall("/wishlist");
  },

  // Add to wishlist
  async add(productId) {
    return apiCall("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  // Remove from wishlist
  async remove(productId) {
    return apiCall(`/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
  },

  // Check if in wishlist
  async check(productId) {
    return apiCall(`/wishlist/check/${productId}`);
  },
};

// ========== ORDERS ==========
const ordersAPI = {
  // Create order
  async create(cartItems, deliveryInfo, couponCode = null) {
    return apiCall("/orders/create", {
      method: "POST",
      body: JSON.stringify({
        cartItems,
        deliveryInfo,
        couponCode,
        paymentMethod: "card",
      }),
    });
  },

  // Get user orders
  async getMyOrders(page = 1) {
    return apiCall(`/orders/my-orders?page=${page}`);
  },

  // Get single order
  async getOne(id) {
    return apiCall(`/orders/${id}`);
  },
};

// ========== COUPONS ==========
const couponsAPI = {
  // Validate coupon
  async validate(code, subtotal) {
    return apiCall("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({
        couponCode: code,
        subtotal: subtotal,
      }),
    });
  },
};

// ========== NOTIFICATIONS ==========
const notificationsAPI = {
  // Subscribe to newsletter
  async subscribeNewsletter(email) {
    return apiCall("/notifications/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Register for stock notification
  async registerStockAlert(productId, email) {
    return apiCall("/notifications/stock-notification", {
      method: "POST",
      body: JSON.stringify({ productId, email }),
    });
  },
};
```

---

## 🛒 Update Product Display (index.js)

### Before (Hardcoded)

```javascript
const products = [
  { id: 1, name: "Classic Wool Blazer", price: 8999, ... },
  { id: 2, name: "Duo Moqueen x Sally Tees", price: 3599, ... }
];

function displayProducts() {
  productContainer.innerHTML = products.map(p => `
    <div><h3>${p.name}</h3><p>₹${p.price}</p></div>
  `).join('');
}
```

### After (API Call)

```javascript
async function displayProducts(filters = {}) {
  try {
    const response = await productsAPI.getAll(filters);
    const products = response.data;

    productContainer.innerHTML = products
      .map(
        (p) => `
      <div class="product">
        <h3>${p.name}</h3>
        <p>₹${p.price} <s>₹${p.mrp}</s></p>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    showError("Failed to load products");
  }
}

// Call on page load
displayProducts();
```

---

## 💳 Update Cart Operations (cart.js)

### Before (localStorage)

```javascript
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("soulvardCart")) || [];
  cart.push(product);
  localStorage.setItem("soulvardCart", JSON.stringify(cart));
}
```

### After (API)

```javascript
async function addToCart(productId, quantity, size, color) {
  if (!auth.isLoggedIn()) {
    window.location.href = "/login";
    return;
  }

  try {
    const response = await cartAPI.add(productId, quantity, size, color);
    showSuccess("Added to cart!");
    updateCartCount(response.data.cartCount);
  } catch (error) {
    showError(error.message);
  }
}

async function updateCartDisplay() {
  try {
    const response = await cartAPI.get();
    const { items, subtotal, tax, shipping, total } = response.data;

    cartContainer.innerHTML = items
      .map(
        (item) => `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>₹${item.price} x ${item.quantity}</p>
        <button onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    `,
      )
      .join("");

    // Update totals
    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("tax").textContent = tax;
    document.getElementById("shipping").textContent = shipping;
    document.getElementById("total").textContent = total;
  } catch (error) {
    showError("Failed to load cart");
  }
}

// Call on page load
updateCartDisplay();
```

---

## ❤️ Update Wishlist (whishlist.js)

### Before (localStorage)

```javascript
function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem("soulvardWishlist")) || [];
  wishlist.push(product);
  localStorage.setItem("soulvardWishlist", JSON.stringify(wishlist));
}
```

### After (API)

```javascript
async function addToWishlist(productId) {
  if (!auth.isLoggedIn()) {
    window.location.href = "/login";
    return;
  }

  try {
    await wishlistAPI.add(productId);
    showSuccess("Added to wishlist!");
  } catch (error) {
    showError(error.message);
  }
}

async function updateWishlistDisplay() {
  try {
    const response = await wishlistAPI.get();
    const products = response.data;

    wishlistContainer.innerHTML = products
      .map(
        (p) => `
      <div class="wishlist-item">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="removeFromWishlist('${p._id}')">Remove</button>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    showError("Failed to load wishlist");
  }
}
```

---

## 💰 Update Checkout (cart.js)

### Before (No backend)

```javascript
// Just validated locally
function validateCoupon(code) {
  const coupon = validCoupons[code.toUpperCase()];
  // ...
}

function createOrder(items, address) {
  // Just saved to localStorage
  localStorage.setItem('order', JSON.stringify({...}));
}
```

### After (API Integration)

```javascript
async function validateCoupon(code) {
  try {
    const cart = await cartAPI.get();
    const response = await couponsAPI.validate(code, cart.data.subtotal);

    if (response.valid) {
      showSuccess(response.message);
      appliedCoupon = response.coupon;
      updateOrderTotal(); // Recalculate with discount
    }
  } catch (error) {
    showError(error.message);
  }
}

async function createOrder() {
  if (!auth.isLoggedIn()) {
    window.location.href = "/login";
    return;
  }

  const deliveryInfo = {
    name: document.getElementById("editName").value,
    phone: document.getElementById("editPhone").value,
    email: document.getElementById("editEmail").value,
    address: document.getElementById("editAddress").value,
    pincode: document.getElementById("editPincode").value,
    city: document.getElementById("editCity").value,
    state: document.getElementById("editState").value,
  };

  try {
    const cart = await cartAPI.get();
    const response = await ordersAPI.create(
      cart.data.items,
      deliveryInfo,
      appliedCoupon?.code,
    );

    showSuccess(`Order created! ID: ${response.data.orderId}`);
    // Redirect to order confirmation
    window.location.href = `/orders/${response.data.orderId}`;
  } catch (error) {
    showError(error.message);
  }
}
```

---

## 🔐 Update Login Page (new login.html)

```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required />
  <input type="password" id="password" placeholder="Password" required />
  <button type="submit">Login</button>
  <p>Don't have account? <a href="/register">Register</a></p>
</form>

<script>
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await authAPI.login(email, password);
      showSuccess("Login successful!");
      window.location.href = "/";
    } catch (error) {
      showError(error.message);
    }
  });
</script>
```

---

## 📝 Update Newsletter Signup

### Before

```javascript
function subscribeNewsletter(email) {
  // Just saved locally
  localStorage.setItem("newsletter", email);
}
```

### After

```javascript
async function subscribeNewsletter(email) {
  try {
    await notificationsAPI.subscribeNewsletter(email);
    showSuccess("Thanks for subscribing!");
  } catch (error) {
    showError("Already subscribed or invalid email");
  }
}
```

---

## 📱 Global Changes Needed

### 1. Update HTML Script Includes

```html
<!-- Add at beginning of body or head -->
<script src="/scripts/api.js"></script>
<script src="/scripts/auth.js"></script>

<!-- Then load your page scripts -->
<script src="/scripts/index.js"></script>
```

### 2. Update Navigation Bar

```html
<!-- Show different nav based on login status -->
<nav>
  <div id="userAuth">
    <span id="userGreeting" style="display:none">
      Welcome, <span id="userName"></span>!
      <button onclick="auth.logout()">Logout</button>
    </span>
    <div id="loginButtons" style="display:none">
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    </div>
  </div>
</nav>

<script>
  // Update on page load
  function updateNavBar() {
    if (auth.isLoggedIn()) {
      const user = auth.getCurrentUser();
      document.getElementById("userName").textContent = user.name;
      document.getElementById("userGreeting").style.display = "block";
      document.getElementById("loginButtons").style.display = "none";
    } else {
      document.getElementById("userGreeting").style.display = "none";
      document.getElementById("loginButtons").style.display = "block";
    }
  }

  updateNavBar();
</script>
```

### 3. Update Cart Count Display

```javascript
async function updateCartCount() {
  if (!auth.isLoggedIn()) {
    document.getElementById("cartCount").textContent = "0";
    return;
  }

  try {
    const response = await cartAPI.get();
    const count = response.data.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    document.getElementById("cartCount").textContent = count;
  } catch (error) {
    console.error("Failed to update cart count");
  }
}

// Update on page load and after cart changes
updateCartCount();
```

---

## 🔄 Protected Pages

Some pages should only be accessible to logged-in users:

```javascript
// Add to top of cart.html, checkout, my-orders, etc.
if (!auth.isLoggedIn()) {
  window.location.href = "/login";
}
```

---

## ⚠️ Error & Success Messages

```javascript
function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

function showError(message) {
  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

// CSS
<style>
.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  z-index: 9999;
}

.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #f44336;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  z-index: 9999;
}
</style>
```

---

## 📋 Checklists

### Phase 1: Setup

- [ ] Copy `api.js` and `auth.js` helpers to `client/scripts/`
- [ ] Update HTML to include new scripts
- [ ] Create login/register pages
- [ ] Update navbar with auth status

### Phase 2: Products

- [ ] Update `index.js` to use `productsAPI.getAll()`
- [ ] Update `collection.js` for filtering
- [ ] Update product detail page

### Phase 3: Cart

- [ ] Replace localStorage cart with `cartAPI`
- [ ] Update cart display
- [ ] Update quantity changes
- [ ] Test add/remove operations

### Phase 4: Wishlist

- [ ] Replace localStorage wishlist with `wishlistAPI`
- [ ] Update wishlist display
- [ ] Test add/remove

### Phase 5: Checkout

- [ ] Update coupon validation
- [ ] Update order creation
- [ ] Add delivery info form
- [ ] Test complete order flow

### Phase 6: Testing

- [ ] Test login/register
- [ ] Test product browsing
- [ ] Test cart operations
- [ ] Test wishlist
- [ ] Test order creation
- [ ] Test coupon validation

---

## 🚀 Gradual Migration Strategy

**Don't update everything at once!** Follow this approach:

1. **Week 1:** Setup auth system (login, register, localStorage token)
2. **Week 2:** Migrate products & categories
3. **Week 3:** Migrate cart operations
4. **Week 4:** Migrate wishlist & orders
5. **Week 5:** Testing & bug fixes

This way you can test each part independently.

---

## 💡 Tips

- Always check if user is logged in before protected operations
- Handle 401 errors (expired token) by redirecting to login
- Update UI immediately (optimistic update) while API call is in progress
- Show loading spinners during API calls
- Validate form data before sending to API
- Keep error messages user-friendly

---

## 🆘 Common Issues

### "Unauthorized" error

- Check token is stored correctly
- Verify token format: `Bearer token_here` (with space)
- Ensure token isn't expired

### "CORS error"

- Check browsers console for details
- Server has CORS enabled, should work
- Verify request headers are correct

### "Product not found"

- Use API response `_id` not just `id`
- Check product ID format in database

### Cart operations not working

- Make sure user is logged in
- Add to cart requires authentication
- Check product ID is correct

---

## 📚 Complete Example

Here's a complete working example for adding to cart:

```javascript
// HTML
<button onclick="handleAddToCart('productId', 'M', 'Black')">
  Add to Cart
</button>;

// JavaScript
async function handleAddToCart(productId, size, color) {
  // 1. Check if logged in
  if (!auth.isLoggedIn()) {
    window.location.href = "/login";
    return;
  }

  // 2. Show loading state
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = "Adding...";

  try {
    // 3. Call API
    const response = await cartAPI.add(productId, 1, size, color);

    // 4. Update UI
    showSuccess("Added to cart!");
    updateCartCount();
    updateCartDisplay();
  } catch (error) {
    // 5. Handle error
    showError(error.message);
  } finally {
    // 6. Reset button
    btn.disabled = false;
    btn.textContent = "Add to Cart";
  }
}
```

---

You're all set! Start with Step 1 and take it gradually. Your backend is ready—now it's time to connect the frontend! 🚀
