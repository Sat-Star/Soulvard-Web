# Soulvard E-Commerce Frontend - Data Models & API Expectations

## Executive Summary

The frontend uses **client-side localStorage** for persistence with no current backend API integration. All data is hardcoded in JavaScript objects and managed through localStorage keys. This document outlines the complete data structures and form fields the frontend expects.

---

## 1. PRODUCT ATTRIBUTES / PROPERTIES

### Basic Product Model (Used in index.js, collection.js, Matching_Product.js)

```javascript
{
  id: Number,                    // Unique product identifier (1-26)
  name: String,                  // Product name (e.g., "Classic Wool Blazer")
  price: Number,                 // Current selling price in INR (₹)
  mrp: Number,                   // Maximum Retail Price (original price)
  category: String,              // Product category (e.g., "couple-tshirts", "hoodie", "t-shirt")
  image: String,                 // Main product image URL
  badge: String,                 // Category badge (e.g., "BESTSELLER", "NEW", "PREMIUM", "LIMITED EDITION")
  inStock: Boolean               // Stock availability status
}
```

**Example Product (from index.js):**

```javascript
{
  id: 1,
  name: "Classic Wool Blazer",
  price: 8999,
  mrp: 12999,
  badge: "Bestseller",
  image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?..."
}
```

### Extended Product Model with Variants (Used in product_cart.js)

```javascript
{
  id: Number,
  name: String,
  price: Number,
  mrp: Number,
  category: String,
  colors: Array[{
    name: String,              // Color name (e.g., "Black", "White")
    value: String,             // Color code (e.g., "black", "white")
    hex: String,               // Hex color code (e.g., "#1a1a1a")
    images: Array[String]      // Multiple product images per color
  }],
  sizes: Array[{
    size: String,              // Size designation (e.g., "S", "M", "L", "XL")
    inStock: Boolean           // Per-size stock availability
  }]
}
```

**Example Extended Product (from product_cart.js):**

```javascript
{
  id: 1,
  name: "Duo Moqueen x Sally Tees",
  price: 3599,
  mrp: 4999,
  category: "couple-tshirts",
  colors: [
    {
      name: "Black",
      value: "black",
      hex: "#1a1a1a",
      images: ["url1", "url2", "url3", "url4"]
    }
  ],
  sizes: [
    { size: "S", inStock: true },
    { size: "M", inStock: true }
  ]
}
```

### Product Categories Found in Code:

- `hoodie`
- `t-shirt`
- `shirts`
- `trousers`
- `coats`
- `jackets`
- `blazers`
- `couple-tshirts`
- `couple-hoodies`
- `trio-tees`
- `Writing`
- `Desk Accessories`

### Product Badges Used:

- BESTSELLER, NEW, PREMIUM, LIMITED, NEW ARRIVAL, GRAPHIC, OVERSIZED, LOGO, STRIPED, LIMITED EDITION, HANDCRAFTED, ZIPPERED, PULLOVER, BASIC, EVENING, SET, TRENDING, LUXURY, ESSENTIAL, ICONIC, SUSTAINABLE, VINTAGE, SALE, CLASSIC, DENIM, LOVE, FRIENDS, FAMILY, SQUAD, MINIMAL, SCRIPT, CREWNECK, EMBROIDERED, CAMO, SIBLINGS, BEST FRIENDS, ARTISAN

---

## 2. USER DATA MODEL

### Delivery Information (Stored in cart.js)

```javascript
{
  name: String,              // Full name (required)
  phone: String,             // Phone number with country code (e.g., "+91 98765 43210")
  email: String,             // Email address (required, must contain '@')
  address: String,           // Full delivery address (multiline)
  pincode: String,           // Postal/ZIP code
  city: String,              // City name
  state: String              // State/Province name
}
```

**Example User Data:**

```javascript
{
  name: "John Doe",
  phone: "+91 98765 43210",
  email: "john@example.com",
  address: "123, Main Street, Mumbai",
  pincode: "400001",
  city: "Mumbai",
  state: "Maharashtra"
}
```

### Form Fields Expected in Delivery Modal (cart.html):

- `editName` - Full Name (text input)
- `editPhone` - Phone Number (tel input)
- `editEmail` - Email Address (email input)
- `editAddress` - Delivery Address (textarea)
- `editPincode` - Pincode (text input)
- `editCity` - City (text input)
- `editState` - State (text input)

### Newsletter Subscription

- Email address via `.newsletter-input` field
- Simple email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

---

## 3. CART / ORDER STRUCTURE

### Cart Item Model (localStorage key: `soulvardCart`, `cart`)

Used in **index.js** and **product_cart.js**:

```javascript
{
  id: Number,                // Product ID
  name: String,              // Product name
  price: Number,             // Current price
  quantity: Number,          // Units in cart (min: 1, max: 10)
  image: String,             // Product image URL

  // Optional fields when adding from product detail page:
  size: String,              // Selected size (e.g., "M", "L")
  color: String,             // Selected color name (e.g., "Black")
  colorValue: String,        // Color code (e.g., "black")
  mrp: Number,               // Original price
  badge: String,             // Product badge
  total: Number              // price * quantity
}
```

### Detailed Cart Item Model (from cart.js - demo data)

```javascript
{
  id: Number,
  name: String,
  image: String,
  size: String,              // Size designation (e.g., "M", "32", "L")
  color: String,             // Color name (e.g., "Ivory", "Charcoal")
  code: String,              // Product code (e.g., "SV-SS01")
  quantity: Number,          // Quantity (1-10)
  price: Number,             // Current price
  originalPrice: Number,     // MRP
  badge: String,             // Badge (e.g., "BESTSELLER", "NEW")
  available: Boolean         // Stock status
}
```

### Order Summary Calculation (Updated in cart.js)

```javascript
const subtotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
);

// Applied coupon discount
const discount = subtotal < coupon.minAmount ? 0 : subtotal * coupon.discount;

// Tax (18% GST)
const tax = (subtotal - discount) * 0.18;

// Shipping (free if subtotal > ₹5000, otherwise ₹499)
const shipping = subtotal > 5000 ? 0 : 499;

// Total
const total = subtotal - discount + shipping + tax;
```

### Coupon System (Hardcoded in cart.js)

```javascript
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
  WELCOME: {
    minAmount: 0,
    discount: 0.2,
    message: "20% welcome discount applied!",
  },
  FREESHIP: {
    minAmount: 0,
    discount: 0,
    shippingFree: true,
    message: "Free shipping applied!",
  },
  SUMMER25: {
    minAmount: 30000,
    discount: 0.25,
    message: "25% summer discount applied!",
  },
};
```

### Checkout Item (Temporary, for Order Processing)

```javascript
// localStorage key: 'checkoutItem'
{
  productId: Number,
  name: String,
  price: Number,
  size: String,
  color: String,
  colorValue: String,
  quantity: Number,
  image: String,
  total: Number              // price * quantity
}
```

---

## 4. WISHLIST STRUCTURE

### Wishlist Item Model (localStorage keys: `soulvardWishlist`, `wishlist`)

**Basic Wishlist Item (from index.js & whishlist.js)**:

```javascript
{
  id: Number,                // Product ID
  name: String,              // Product name
  price: Number,             // Current price
  mrp: Number,               // Original price (optional)
  category: String,          // Product category
  image: String,             // Product image URL
  badge: String,             // Product badge
  inStock: Boolean           // Stock availability
}
```

**Detailed Wishlist Item (from product_cart.js)**:

```javascript
{
  productId: Number,
  name: String,
  price: Number,
  color: String,
  image: String
}
```

### Sample Wishlist Data (from whishlist.js):

```javascript
[
  {
    id: 1,
    name: "Premium Leather Journal Set",
    price: 3599,
    mrp: 4999,
    category: "Writing",
    image: "https://...",
    badge: "PREMIUM",
    inStock: true,
  },
  {
    id: 2,
    name: "Artisanal Fountain Pen Collection",
    price: 8599,
    mrp: 9999,
    category: "Writing",
    image: "https://...",
    badge: "LIMITED",
    inStock: false,
  },
];
```

---

## 5. LOCAL STORAGE KEYS & PERSISTENCE

### Storage Keys Used Across Frontend:

| Key                 | Page(s)                | Data Type                        | Purpose                         |
| ------------------- | ---------------------- | -------------------------------- | ------------------------------- |
| `soulvardCart`      | index.js               | JSON Array                       | Cart items on homepage          |
| `soulvardWishlist`  | index.js, whishlist.js | JSON Array                       | Wishlist items                  |
| `cart`              | product_cart.js        | JSON Array                       | Cart from product detail page   |
| `cartCount`         | product_cart.js        | Number (String stored)           | Total quantity counter          |
| `wishlist`          | product_cart.js        | JSON Array                       | Wishlist from product page      |
| `wishlistCount`     | product_cart.js        | Number (String stored)           | Wishlist item count             |
| `productInWishlist` | product_cart.js        | Boolean (String: 'true'/'false') | Current product wishlist status |
| `appliedCoupon`     | cart.js                | String                           | Applied coupon code for order   |
| `checkoutItem`      | product_cart.js        | JSON Object                      | Single item checkout            |
| `soulvardCartCount` | whishlist.js           | Number (String stored)           | Cart count on wishlist page     |

---

## 6. API ENDPOINTS & REQUEST/RESPONSE EXPECTATIONS

### Current Status: NO BACKEND INTEGRATION

The frontend currently has **NO running API calls**. All data is hardcoded and localStorage-based.

### Expected API Endpoints for Future Backend Integration

#### 6.1 Products Endpoints

**GET /api/products**

```javascript
// Expected Response:
{
  success: true,
  data: [
    {
      id: 1,
      name: "Classic Wool Blazer",
      price: 8999,
      mrp: 12999,
      category: "blazers",
      image: "https://...",
      badge: "Bestseller",
      inStock: true
    }
    // ... more products
  ],
  total: 100,
  page: 1,
  limit: 20
}
```

**GET /api/products/:id**

```javascript
// Expected Response:
{
  success: true,
  data: {
    id: 1,
    name: "Duo Moqueen x Sally Tees",
    price: 3599,
    mrp: 4999,
    category: "couple-tshirts",
    colors: [
      {
        name: "Black",
        value: "black",
        hex: "#1a1a1a",
        images: ["url1", "url2", "url3", "url4"]
      }
    ],
    sizes: [
      { size: "S", inStock: true },
      { size: "M", inStock: true }
    ]
  }
}
```

**GET /api/products?category=couple-tshirts&inStock=true**

```javascript
// Query parameters expected:
// - category: string
// - inStock: boolean
// - sort: "featured" | "newest" | "price-low" | "price-high" | "name"
// - page: number
// - limit: number
```

#### 6.2 User/Auth Endpoints

**POST /api/users/register**

```javascript
// Expected Request:
{
  email: "user@example.com",
  password: "secure_password",
  name: "John Doe"
}

// Expected Response:
{
  success: true,
  data: {
    id: 1,
    name: "John Doe",
    email: "user@example.com",
    createdAt: "2026-03-15T10:00:00Z"
  },
  token: "jwt_token_here"
}
```

**POST /api/users/login**

```javascript
// Expected Request:
{
  email: "user@example.com",
  password: "secure_password"
}

// Expected Response:
{
  success: true,
  data: {
    id: 1,
    name: "John Doe",
    email: "user@example.com"
  },
  token: "jwt_token_here"
}
```

**GET /api/users/:id/profile**

```javascript
// Expected Response:
{
  success: true,
  data: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    defaultAddress: {
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "john@example.com",
      address: "123, Main Street",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra"
    }
  }
}
```

#### 6.3 Cart Endpoints

**GET /api/cart**

```javascript
// Expected Response:
{
  success: true,
  data: {
    items: [
      {
        id: 1,
        name: "Silk Shirt",
        price: 22499,
        originalPrice: 24999,
        size: "M",
        color: "Ivory",
        code: "SV-SS01",
        quantity: 1,
        image: "https://...",
        available: true
      }
    ],
    subtotal: 86397,
    tax: 15551,
    shipping: 0,
    discount: 0,
    total: 101948
  }
}
```

**POST /api/cart/add**

```javascript
// Expected Request:
{
  productId: 1,
  quantity: 1,
  size: "M",
  color: "Black"
}

// Expected Response:
{
  success: true,
  message: "Item added to cart",
  data: {
    cartItems: [...],
    cartCount: 5
  }
}
```

**PUT /api/cart/update/:itemId**

```javascript
// Expected Request:
{
  quantity: 2
}

// Expected Response:
{
  success: true,
  message: "Cart updated",
  data: { cartItems: [...] }
}
```

**DELETE /api/cart/:itemId**

```javascript
// Expected Response:
{
  success: true,
  message: "Item removed",
  data: { cartItems: [...] }
}
```

**POST /api/cart/validate-coupon**

```javascript
// Expected Request:
{
  couponCode: "SOULVARD10",
  subtotal: 25000
}

// Expected Response:
{
  success: true,
  valid: true,
  discount: 2500,
  message: "10% discount applied!",
  coupon: {
    code: "SOULVARD10",
    minAmount: 10000,
    discount: 0.10
  }
}
```

#### 6.4 Order/Checkout Endpoints

**POST /api/orders/create**

```javascript
// Expected Request:
{
  cartItems: [
    {
      productId: 1,
      quantity: 1,
      size: "M",
      color: "Black"
    }
  ],
  deliveryInfo: {
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john@example.com",
    address: "123, Main Street",
    pincode: "400001",
    city: "Mumbai",
    state: "Maharashtra"
  },
  paymentMethod: "card" | "upi" | "netbanking",
  couponCode: "SOULVARD10" // optional
}

// Expected Response:
{
  success: true,
  data: {
    orderId: "ORD-20260315-001",
    status: "pending",
    total: 101948,
    estimatedDelivery: "2026-03-20",
    paymentLink: "https://payment-gateway.com/pay/..."
  }
}
```

**GET /api/orders/:orderId**

```javascript
// Expected Response:
{
  success: true,
  data: {
    orderId: "ORD-20260315-001",
    status: "processing", // pending, processing, shipped, delivered
    items: [...],
    total: 101948,
    createdAt: "2026-03-15T10:00:00Z",
    deliveryInfo: {...},
    trackingNumber: "TRK-123456"
  }
}
```

#### 6.5 Wishlist Endpoints

**GET /api/wishlist**

```javascript
// Expected Response:
{
  success: true,
  data: [
    {
      id: 1,
      name: "Premium Leather Journal",
      price: 3599,
      mrp: 4999,
      image: "https://...",
      badge: "PREMIUM",
      inStock: true,
      category: "Writing"
    }
  ]
}
```

**POST /api/wishlist/add**

```javascript
// Expected Request:
{
  productId: 1
}

// Expected Response:
{
  success: true,
  message: "Added to wishlist",
  wishlistCount: 5
}
```

**DELETE /api/wishlist/:productId**

```javascript
// Expected Response:
{
  success: true,
  message: "Removed from wishlist",
  wishlistCount: 4
}
```

#### 6.6 Newsletter Endpoint

**POST /api/newsletter/subscribe**

```javascript
// Expected Request:
{
  email: "user@example.com"
}

// Expected Response:
{
  success: true,
  message: "Successfully subscribed",
  data: {
    email: "user@example.com",
    subscribedAt: "2026-03-15T10:00:00Z"
  }
}
```

#### 6.7 Out-of-Stock Notification Endpoint

**POST /api/notifications/register**

```javascript
// Expected Request:
{
  productId: 2,
  email: "user@example.com"
}

// Expected Response:
{
  success: true,
  message: "You'll be notified when this product is back in stock"
}
```

---

## 7. FORM INPUTS ACROSS PAGES

### Cart Page (cart.html)

- `couponCode` - Coupon code input (desktop)
- `couponCodeMobile` - Coupon code input (mobile)
- `editName` - Customer name
- `editPhone` - Phone number
- `editEmail` - Email address
- `editAddress` - Delivery address
- `editPincode` - Postal code
- `editCity` - City name
- `editState` - State name

### Product Detail Page (product_cart.html)

- `colorOptions` - Color selector (dynamically generated)
- `sizeOptions` - Size selector (dynamically generated)
- `quantityInput` - Product quantity (1-10)
- `newsletterEmail` - Newsletter subscription

### Home Page (index.html)

- `.newsletter-input` - Newsletter email subscription

### All Pages

- Mobile menu toggle elements
- Cart/Wishlist icon counters

---

## 8. DATA VALIDATION RULES

### Price Calculation Rules

```javascript
discount = Math.round(((mrp - price) / mrp) * 100);
// Example: (₹12999 - ₹8999) / ₹12999 * 100 = 30.77% → 31% OFF
```

### Quantity Constraints

```javascript
min: 1;
max: 10;
```

### Size Availability

- Some sizes may be out of stock (inStock: false)
- Out-of-stock sizes are disabled in UI
- Selecting out-of-stock size shows error: "Selected size is out of stock"

### Shipping Rules

```javascript
FREE if subtotal > ₹5000
₹499 if subtotal ≤ ₹5000
```

### Tax Calculation

```javascript
GST = 18 % on(subtotal - discount);
```

### Email Validation

```javascript
Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Coupon Minimum Order Requirements

```javascript
SOULVARD10: ₹10,000 minimum
SOULVARD15: ₹50,000 minimum
WELCOME: ₹0 (no minimum)
FREESHIP: ₹0 (no minimum)
SUMMER25: ₹30,000 minimum
```

---

## 9. SORTING & FILTERING OPTIONS

### Sorting Options (from collection.js & Matching_Product.js)

- `featured` - Default/Featured sorting
- `newest` - Newest products first (by ID descending)
- `price-low` - Price: Low to High
- `price-high` - Price: High to Low
- `name` - Alphabetical A-Z
- `availability` - In-stock first

### Filter Options

- **By Category**: Different categories like "hoodie", "t-shirt", "blazers", "couple-tshirts", etc.
- **By Stock Status**: In-stock vs Out-of-stock

### Pagination

- Load More button increases visible products by 8-12 items at a time
- Dynamically shows/hides based on total products available

---

## 10. NOTIFICATION/MESSAGE TYPES

### Toast Notifications (showNotification function)

```javascript
// Success notifications
"Item added to cart!";
"Item removed from cart";
"Wishlist cleared";

// Error notifications
"Selected size is out of stock";
"Your cart is empty";
"Maximum quantity is 10";

// Info notifications
"Color changed to [color]";
"Thank you for subscribing!";
```

### Messages for Out-of-Stock Items

```javascript
"Will be back soon";
"NOTIFY ME WHEN AVAILABLE";
"OUT OF STOCK";
```

---

## 11. BADGE CATEGORIES

**Product Status Badges:**

- Promotional: BESTSELLER, NEW, LIMITED, SALE, TRENDING
- Quality: PREMIUM, LUXURY, ESSENTIAL, ICONIC
- Type: SET, GRAPHIC, STRIPED, BASIC, OVERSIZED, LOGO, ZIPPERED, PULLOVER, CREWNECK, EMBROIDERED, CAMO
- Special: HANDCRAFTED, SUSTAINABLE, VINTAGE, CUSTOM, ARTISAN
- Couples/Groups: DUO, COUPLE, FRIENDS, FAMILY, SQUAD, SIBLINGS, BEST FRIENDS
- Style: MINIMAL, SCRIPT, DENIM, LOVE

---

## 12. IMAGE HANDLING

### Image Storage

- All product images sourced from Unsplash (https://images.unsplash.com)
- Multiple images per color variant stored in array
- Main image viewable at full size with zoom functionality

### Image Zoom Feature (product_cart.js)

- Click main image to open modal with zoomed view
- Close with ×, Escape key, or click outside

### Color-Specific Images

Each color has 4 product images showing different angles/perspectives

---

## 13. CURRENT DEMO DATA RANGES

### Product Count

- **index.js**: 18 products (Top Picks, New Arrivals, Matching Products)
- **collection.js**: 16 products (various categories)
- **Matching_Product.js**: 26 products (couple & group sets)
- **product_cart.js**: 1 product detail
- **whishlist.js**: 6 sample items

### Price Ranges

- **Low**: ₹1,499 - ₹2,999
- **Mid**: ₹3,000 - ₹7,999
- **Premium**: ₹8,000 - ₹15,999
- **Luxury**: ₹20,000 - ₹89,999

### Color Options (Standard)

- Black, White, Navy Blue, Grey, Charcoal, Ivory, Camel

### Size Options (Standard)

- S, M, L, XL, XXL (some out of stock)

**Clothing Size Categories:**

- Regular: S, M, L, XL, XXL
- Pants: 28, 30, 32, 34, 36
- One-size items: XS to XXXL

---

## 14. BROWSER STORAGE RECOMMENDATIONS

### Maximum localStorage Size

- ~5-10MB per domain
- Current usage minimal (mostly product data on-page only)

### Data Persistence Strategy

```javascript
// Save to localStorage
localStorage.setItem("soulvardCart", JSON.stringify(cartArray));

// Read from localStorage
const cart = JSON.parse(localStorage.getItem("soulvardCart")) || [];

// Clear on logout/reset
localStorage.removeItem("appliedCoupon");
localStorage.removeItem("soulvardCart");
```

---

## 15. RECOMMENDED BACKEND IMPLEMENTATION

### Essential Tables/Collections

1. **Products** - Full product catalog with variants
2. **Users** - User accounts and profiles
3. **Cart** - User shopping carts
4. **Wishlist** - User saved items
5. **Orders** - Order history and status
6. **Coupons** - Coupon codes and validation rules
7. **Reviews** - Product reviews and ratings
8. **Newsletter** - Email subscribers
9. **Notifications** - Back-in-stock alerts

### Authentication

- JWT token-based authentication
- Store token in localStorage or session storage
- Validate on each API request

### Payment Integration Readiness

- `paymentLink` in order response
- Support multiple payment methods: card, UPI, NetBanking
- Payment gateway callback handling

---

## CONCLUSION

The Soulvard frontend is a well-structured, premium e-commerce interface with:

- ✅ Clear data models for products, carts, wishlist, and orders
- ✅ Comprehensive form validation
- ✅ Flexible product variants (colors, sizes)
- ✅ Professional discount/coupon system
- ✅ Responsive design with mobile/desktop variants
- ❌ Missing backend API integration (currently localStorage-only)

**Next Step**: Implement REST API backend with the endpoint specifications provided above to fully activate the e-commerce functionality.
