# 🔗 Frontend to Backend API Integration Guide

Your frontend is now ready to connect to the fully functional backend API. This guide shows exactly how to update each JavaScript file.

## ✅ What's Already Done

1. ✅ **api.js** created - Contains all API wrapper functions
2. ✅ **auth.js** created - Handles authentication UI and token management
3. ✅ **All HTML files updated** - Includes api.js and auth.js scripts
4. ✅ **Backend API** running on http://localhost:5000

## 🚀 Integration Steps

### Step 1: Start Your Backend Server

```bash
npm run dev
```

You should see:

```
MongoDB Connected
Server running on http://localhost:5000
```

### Step 2: Test API is Working

In another terminal:

```bash
curl http://localhost:5000/api/products
```

Should return JSON array of products from your database.

---

## 📱 Frontend File Updates

### **1. collection.js** - Load Products from API

**Current:** Hardcoded `collectionsProducts` array (lines 1-250)

**Replace with:**

```javascript
// Replace the entire hardcoded const collectionsProducts = [...]
// with this:

let collectionsProducts = [];
let allProducts = [];

// Load products from API on page load
async function loadProducts() {
  try {
    const response = await productsAPI.getAll({
      limit: 100, // Load all products
    });

    if (response.success) {
      allProducts = response.data;
      collectionsProducts = response.data;
      renderCollections();
      applyFilters(); // Call existing filter function
    }
  } catch (error) {
    console.error("Failed to load products:", error);
    showError("Failed to load products");
  }
}

// Update existing applyFilters function to work with API
function applyFilters() {
  const selectedCategory = document.querySelector(
    'input[name="filter"]:checked',
  );
  const selectedSort = document.getElementById("sortDropdown")?.value;
  const searchQuery = document.getElementById("searchInput")?.value;

  let filtered = [...allProducts];

  // Category filter
  if (selectedCategory && selectedCategory.value !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // Sort
  if (selectedSort) {
    switch (selectedSort) {
      case "featured":
        filtered.sort(
          (a, b) => (b.badge === "FEATURED") - (a.badge === "FEATURED"),
        );
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "best-rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  collectionsProducts = filtered;
  renderCollections();
}

// Call loadProducts on page load
document.addEventListener("DOMContentLoaded", loadProducts);
```

**Update existing functions:**

- Replace the old `renderCollections()` `map()` to use the new API fields:

  ```javascript
  // Old: id, name, price, mrp, image, badge, inStock
  // New from API: _id, name, price, mrp, image, badge, inStock, discount, rating

  // Update image references - API returns image URLs directly
  // Update product link: onclick="viewProduct('${product._id}')" // Use _id instead of id
  ```

### **2. index.js** - Load Featured Products

**Current:** May have hardcoded featured products

**Add after existing code:**

```javascript
// Load featured/trending products from API
async function loadFeaturedProducts() {
  try {
    const response = await productsAPI.getAll({
      limit: 6,
      sort: "featured", // Get featured products
    });

    if (response.success) {
      const products = response.data;
      const featuredContainer = document.getElementById("featuredProducts");
      if (featuredContainer) {
        featuredContainer.innerHTML = products
          .map(
            (p) => `
          <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${formatPrice(p.price)}</p>
            <button onclick="viewProduct('${p._id}')">VIEW</button>
          </div>
        `,
          )
          .join("");
      }
    }
  } catch (error) {
    console.error("Failed to load featured products:", error);
  }
}

// Call on page load
document.addEventListener("DOMContentLoaded", loadFeaturedProducts);
```

### **3. cart.js** - Fully Updated (See below)

The complete API-integrated cart.js is provided in [CART_API_INTEGRATION.md](CART_API_INTEGRATION.md)

**Key changes:**

- Load cart from API instead of localStorage
- Add items via `/api/cart/add` endpoint
- Update quantities via `/api/cart/update` endpoint
- Remove items via `/api/cart/remove` endpoint
- Get cart totals from server (ensures accuracy)
- Save delivery addresses via `/api/auth/address` endpoint
- Create orders via `/api/orders/create` endpoint

### **4. whishlist.js** - Load from API

**Replace hardcoded: `const sampleWishlistItems = [...]`**

```javascript
let sampleWishlistItems = [];

async function loadWishlist() {
  if (!isLoggedIn()) {
    // Handle not logged in - show login prompt
    document.getElementById("wishlistContent").innerHTML = `
      <p>Please <a href="#" onclick="openLoginModal()">login</a> to view your wishlist</p>
    `;
    return;
  }

  try {
    const response = await wishlistAPI.get();
    if (response.success) {
      sampleWishlistItems = response.data.products || [];
      renderWishlist();
    }
  } catch (error) {
    console.error("Failed to load wishlist:", error);
    showError("Failed to load wishlist");
  }
}

// Update existing removeFromWishlist function:
async function removeFromWishlist(index) {
  const product = sampleWishlistItems[index];
  try {
    const response = await wishlistAPI.remove(product._id);
    if (response.success) {
      sampleWishlistItems.splice(index, 1);
      renderWishlist();
      showSuccess("Removed from wishlist");
    }
  } catch (error) {
    showError("Failed to remove from wishlist");
  }
}

// Update moveToCart function:
async function moveToCart(index) {
  const product = sampleWishlistItems[index];

  // First add to cart
  try {
    await cartAPI.add(product._id, 1, "M", "Black");
    // Then remove from wishlist
    await wishlistAPI.remove(product._id);
    sampleWishlistItems.splice(index, 1);
    renderWishlist();
    showSuccess("Moved to cart");
  } catch (error) {
    showError("Failed to move to cart");
  }
}

document.addEventListener("DOMContentLoaded", loadWishlist);
```

### **5. product_cart.js** - Load Product Details from URL

**Add at the top:**

```javascript
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

async function loadProduct() {
  if (!productId) {
    showError("Product not found");
    return;
  }

  try {
    const response = await productsAPI.getById(productId);
    if (response.success) {
      const product = response.data;
      displayProductDetails(product);
    }
  } catch (error) {
    showError("Failed to load product");
  }
}

function displayProductDetails(product) {
  // Update all product display elements with API data
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = formatPrice(
    product.price,
  );
  document.getElementById("productMRP").textContent = formatPrice(product.mrp);
  document.getElementById("productDiscount").textContent =
    `${product.discount}% OFF`;
  document.getElementById("productImage").src = product.image;
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("productRating").textContent =
    `${product.rating} / 5 (${product.reviews} reviews)`;

  // Display colors
  const colorContainer = document.getElementById("colorOptions");
  colorContainer.innerHTML = product.colors
    .map(
      (color) => `
    <div class="color-option" style="background: ${color.hex}" 
         onclick="selectColor('${color.value}')" title="${color.name}"></div>
  `,
    )
    .join("");

  // Display sizes
  const sizeContainer = document.getElementById("sizeOptions");
  sizeContainer.innerHTML = product.sizes
    .map(
      (size) => `
    <button class="size-btn" onclick="selectSize('${size.size}')" 
            ${!size.inStock ? "disabled" : ""}>
      ${size.size}
    </button>
  `,
    )
    .join("");
}

// Update Add to Cart button:
async function addToCart() {
  if (!isLoggedIn()) {
    openLoginModal();
    return;
  }

  const selectedSize =
    document.querySelector(".size-btn.selected")?.textContent;
  const selectedColor = document.querySelector(".color-option.selected")?.title;
  const quantity = parseInt(document.getElementById("quantity")?.value || 1);

  if (!selectedSize || !selectedColor) {
    showError("Please select size and color");
    return;
  }

  try {
    const response = await cartAPI.add(
      productId,
      quantity,
      selectedSize,
      selectedColor,
    );
    if (response.success) {
      showSuccess("Added to cart!");
      setTimeout(() => {
        window.location.href = "cart.html";
      }, 1000);
    }
  } catch (error) {
    showError(error.message || "Failed to add to cart");
  }
}

// Update Add to Wishlist button:
async function addToWishlist() {
  if (!isLoggedIn()) {
    openLoginModal();
    return;
  }

  try {
    const response = await wishlistAPI.add(productId);
    if (response.success) {
      showSuccess("Added to wishlist!");
      document.getElementById("wishlistBtn").textContent = "❤️ In Wishlist";
      document.getElementById("wishlistBtn").disabled = true;
    }
  } catch (error) {
    showError("Failed to add to wishlist");
  }
}

document.addEventListener("DOMContentLoaded", loadProduct);
```

### **6. Update Product Links** - Pass product ID

In `collection.js`, `Matching_Product.js`, and `index.js`:

**Old:**

```html
<div class="product-card" onclick="viewProduct(${product.id})"></div>
```

**New:**

```html
<div
  class="product-card"
  onclick="window.location.href = '/product_cart.html?id=${product._id}'"
></div>
```

Or create a navigation function:

```javascript
function viewProduct(productId) {
  window.location.href = `/product_cart.html?id=${productId}`;
}
```

### **7. Matching_Product.js** - Load from API

**Similar to collection.js:**

```javascript
let matchingProducts = [];
let allMatchingProducts = [];

async function loadMatchingProducts() {
  try {
    const response = await productsAPI.getAll({ limit: 100 });
    if (response.success) {
      allMatchingProducts = response.data;
      matchingProducts = response.data;
      renderMatchingProducts();
    }
  } catch (error) {
    showError("Failed to load products");
  }
}

document.addEventListener("DOMContentLoaded", loadMatchingProducts);
```

---

## 🔐 Authentication Integration

All HTML files now have `auth.js` loaded, which provides:

### Login Modal Example

```html
<!-- Add this to your HTML file -->
<div id="loginModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeModal('loginModal')">&times;</span>
    <h2>Login</h2>
    <form onsubmit="handleLogin(event)">
      <input type="email" id="loginEmail" placeholder="Email" required />
      <input
        type="password"
        id="loginPassword"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p>
      Don't have an account? <a href="#" onclick="openSignupModal()">Sign Up</a>
    </p>
  </div>
</div>

<!-- Signup Modal -->
<div id="signupModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeModal('signupModal')">&times;</span>
    <h2>Sign Up</h2>
    <form onsubmit="handleSignup(event)">
      <input type="text" id="signupName" placeholder="Full Name" required />
      <input type="email" id="signupEmail" placeholder="Email" required />
      <input type="tel" id="signupPhone" placeholder="Phone" required />
      <input
        type="password"
        id="signupPassword"
        placeholder="Password"
        required
      />
      <input
        type="password"
        id="signupConfirmPassword"
        placeholder="Confirm Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</div>
```

### Navigation Buttons

```html
<!-- In your header/nav -->
<button id="loginBtn" onclick="openLoginModal()">LOGIN</button>
<button id="signupBtn" onclick="openSignupModal()">SIGN UP</button>
<div id="userMenu" style="display: none;"></div>
```

### Protect Routes

```javascript
// At the top of cart.js, wishlist.js, etc:
if (!isLoggedIn()) {
  openLoginModal();
  return;
}
// OR
document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "/";
  }
});
```

---

## 🧪 Testing Your Integration

### Test Checklist

1. **Backend Running**

   ```bash
   npm run dev
   # Should show: MongoDB Connected, Server running on port 5000
   ```

2. **API Working**

   ```bash
   curl http://localhost:5000/api/products
   # Should return product array
   ```

3. **Frontend Loads Products**
   - Open http://localhost:5000/collection.html
   - Products should load and display
   - Check browser console for errors

4. **Login Works**
   - Click Login button
   - Use: user@soulvard.com / user123
   - Should redirect to home
   - User name should display in header

5. **Add to Cart**
   - Login first
   - Go to product page
   - Click "Add to Cart"
   - Should redirect to cart.html
   - Item should appear in cart
   - Quantities should be editable

6. **Compute Order**
   - Add multiple items to cart
   - View total calculation
   - Apply coupon code: WELCOME
   - Should show updated total

---

## 🚨 Common Issues & Solutions

### **Issue: "API is not defined"**

**Solution:** Ensure api.js is loaded before other scripts:

```html
<script src="scripts/api.js"></script>
<script src="scripts/auth.js"></script>
<script src="scripts/page-specific.js"></script>
```

### **Issue: "CORS error"**

**Solution:** CORS is enabled in backend. Check:

1. Browser console - what's the actual error?
2. API_BASE_URL in api.js is correct (http://localhost:5000/api)
3. Backend server is running

### **Issue: "Cannot read property of undefined"**

**Solution:** You're probably accessing an old property name. Check API response:

```javascript
console.log(response.data); // See what fields are available
```

### **Issue: "Token expired"**

**Solution:** Authentication failed. The system auto-redirects to login on 401 errors.

### **Issue: Products not loading**

**Solution:** Check:

1. Database was seeded: `npm run seed`
2. Backend returned products: `curl http://localhost:5000/api/products`
3. Browser console for error messages

---

## 📊 Data Structure Reference

### Product (from API)

```javascript
{
  _id: "ObjectId",
  name: "Product Name",
  price: 3999,
  mrp: 4999,
  discount: 20,
  description: "...",
  category: "ObjectId",
  image: "https://...",
  badge: "NEW/BESTSELLER/etc",
  colors: [{name, value, hex, images: []}],
  sizes: [{size, inStock}],
  inStock: true,
  stock: 50,
  rating: 4.5,
  reviews: 10,
  createdAt: "2024-03-15T...",
  updatedAt: "2024-03-15T..."
}
```

### Cart Item (from API)

```javascript
{
  _id: "ObjectId",
  userId: "ObjectId",
  productId: {_id, name, price, mrp, image, ...},
  quantity: 2,
  size: "M",
  color: "Black",
  addedAt: "2024-03-15T..."
}
```

### Order (from API)

```javascript
{
  _id: "ObjectId",
  orderId: "ORD-20240315-XXXX",
  userId: "ObjectId",
  items: [{productId, quantity, price, size, color}],
  deliveryAddress: {name, address, city, state, pincode, phone},
  pricing: {subtotal, discount, tax, shipping, total},
  paymentMethod: "cod",
  couponCode: "CODE",
  status: "pending/processing/shipped/delivered/cancelled",
  createdAt: "2024-03-15T..."
}
```

---

## ✨ Next Steps

1. **Complete Integration** - Update all .js files using patterns above
2. **Test All Flows** - Login → Browse → Cart → Checkout
3. **Style Login Modal** - Make it match your design
4. **Admin Panel** - Update admin.js to use API for CRUD
5. **Order Confirmation** - Create order-confirmation.html page
6. **Deploy** - Push to production when ready

---

## 📚 Quick Command Reference

```bash
# Start backend
npm run dev

# Seed database
npm run seed

# Test API endpoints
curl http://localhost:5000/api/products
curl http://localhost:5000/api/products?limit=5
curl http://localhost:5000/api/categories
```

---

**Your API is ready!** Follow the patterns above to integrate each file. The API helper functions in `api.js` handle all the complexity - just call them and use the responses!

Questions? Check the API documentation: [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
