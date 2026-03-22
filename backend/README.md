# Soulvard E-Commerce Backend Setup Guide

## 📋 Overview

Complete backend implementation for the Soulvard E-Commerce platform with:

- ✅ JWT-based authentication (Client & Admin roles)
- ✅ Product & Category management
- ✅ Shopping cart with automatic calculations
- ✅ Wishlist functionality
- ✅ Order management and tracking
- ✅ Coupon/discount system
- ✅ Newsletter subscriptions
- ✅ Stock notifications
- ✅ MongoDB database integration
- ✅ Cloudinary image storage

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

### 3. Run Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server will start on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Order.js
│   ├── Coupon.js
│   ├── Newsletter.js
│   └── StockNotification.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   ├── orderController.js
│   ├── couponController.js
│   └── notificationController.js
├── routes/              # API endpoints
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── cart.js
│   ├── wishlist.js
│   ├── orders.js
│   ├── coupons.js
│   └── notifications.js
├── middleware/          # Authentication & error handling
│   ├── auth.js
│   └── errorHandler.js
├── utils/               # Helper functions
│   ├── cloudinary.js
│   └── validators.js
├── db.js               # MongoDB connection
└── API_DOCUMENTATION.md
```

---

## 🔐 Authentication

### Token-Based Authentication

The system uses JWT tokens for authentication:

1. **User registers/logs in** → Receives JWT token
2. **Client stores token** → In localStorage
3. **Every request** → Includes token in Authorization header
4. **Server validates** → Token and grants access

### Token Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Roles

- **client** - Regular customer (default)
- **admin** - Can manage products, categories, coupons, and orders

---

## 📦 Database Models

### User

```javascript
{
  name, email, password (hashed), phone,
  role: 'client' | 'admin',
  defaultAddress: { name, phone, address, city, state, pincode },
  addresses: [{ ... }],
  isActive: Boolean
}
```

### Product

```javascript
{
  name, price, mrp, description,
  category (ref),
  image, badge,
  colors: [{ name, value, hex, images }],
  sizes: [{ size, inStock }],
  inStock, stock, rating, reviews, sku
}
```

### Cart

```javascript
{
  userId (ref),
  items: [{
    productId, name, price, quantity,
    size, color, colorValue, image
  }]
}
```

### Order

```javascript
{
  orderId (auto-generated),
  userId (ref),
  items: [{ productId, name, price, quantity, size, color, total }],
  deliveryInfo: { name, phone, email, address, pincode, city, state },
  pricing: { subtotal, discount, tax, shipping, total },
  couponCode,
  paymentMethod, paymentStatus, status,
  trackingNumber, estimatedDelivery
}
```

### Coupon

```javascript
{
  code, description,
  discountType: 'percentage' | 'fixed',
  discount, minAmount, maxDiscount,
  usageLimit, usageCount,
  expiryDate, isActive,
  freeShipping
}
```

---

## 🔌 API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart

- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `PUT /api/cart/update/:itemId` - Update quantity (Protected)
- `DELETE /api/cart/remove/:itemId` - Remove from cart (Protected)
- `DELETE /api/cart/clear` - Clear entire cart (Protected)

### Wishlist

- `GET /api/wishlist` - Get wishlist (Protected)
- `POST /api/wishlist/add` - Add to wishlist (Protected)
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist (Protected)
- `GET /api/wishlist/check/:productId` - Check if in wishlist (Protected)

### Orders

- `POST /api/orders/create` - Create order (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update status (Admin only)

### Coupons

- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (Admin only)
- `PUT /api/coupons/:id` - Update coupon (Admin only)
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)

### Notifications

- `POST /api/notifications/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/notifications/stock-notification` - Register for stock alert
- `GET /api/notifications/newsletter/subscribers` - Get subscribers (Admin only)
- `GET /api/notifications/stock-notifications` - Get alerts (Admin only)

---

## 💳 Order Flow

1. **Client adds items to cart**
   - `POST /api/cart/add` with productId, quantity, size, color

2. **Client proceeds to checkout**
   - `GET /api/cart` to get current cart
   - Optional: `POST /api/coupons/validate` to apply coupon

3. **Client creates order**
   - `POST /api/orders/create` with cart items and delivery info
   - Coupon is applied automatically (if provided)
   - Order total = subtotal - discount + tax + shipping

4. **Order is created with status "pending"**
   - User receives orderId (e.g., ORD-20260315-0001)
   - Cart is automatically cleared

5. **Admin can track/update order**
   - `PUT /api/orders/:id/status` to update status
   - Status flow: pending → processing → shipped → delivered

6. **Client can cancel order**
   - `PUT /api/orders/:id/cancel` (only if not shipped)

---

## 🛒 Cart Calculation Rules

```javascript
Subtotal = Sum of (price × quantity) for all items
Discount = Applied if valid coupon provided
Tax = 18% GST on (subtotal - discount)
Shipping = ₹499 (free if subtotal > ₹5000)
Total = Subtotal - Discount + Tax + Shipping
```

---

## 🎯 Key Features Implementation

### 1. Automatic Cart Calculations

- Quantity limits: 1-10 items
- Tax automatically calculated (18%)
- Shipping automatically reduced based on subtotal
- Coupon discounts subtracted from total

### 2. Product Variants

- Multiple colors per product with hex codes
- Multiple product images per color
- Size availability with individual stock status
- Automatic discount percentage calculation

### 3. Order Management

- Auto-generated order IDs (format: ORD-YYYYMMDD-XXXX)
- Order status tracking (pending → shipped → delivered)
- Coupon usage limit tracking
- Delivery address storage

### 4. User Management

- Password hashing with bcryptjs
- Multiple delivery addresses per user
- Role-based access control (admin/client)
- User profile management

### 5. Stock Notifications

- Register for out-of-stock product alerts
- Newsletter subscriptions
- Email notification system (backend ready for integration)

---

## 🧪 Testing API with Postman

1. **Register a user:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body:

   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "role": "client"
   }
   ```

2. **Login and get token:**
   - Copy the token from response
   - Use it in Authorization header for other requests

3. **Add to cart:**
   - Method: POST
   - URL: `http://localhost:5000/api/cart/add`
   - Headers: `Authorization: Bearer <token>`
   - Body:
   ```json
   {
     "productId": "product_id_here",
     "quantity": 1,
     "size": "M",
     "color": "Black"
   }
   ```

---

## 📝 Environment Variables Explanation

- **PORT** - Server port (default: 5000)
- **NODE_ENV** - Environment (development/production)
- **MONGODB_URL** - MongoDB connection string
- **JWT_SECRET** - Secret key for JWT tokens
- **CLOUDINARY\_\*** - Image upload configuration

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected routes with role checks
- ✅ Input validation
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Secure password comparison

---

## 📊 Data Validation

- **Email:** Valid email format
- **Phone:** Min 10 digits
- **Pincode:** 5-6 digits
- **Quantity:** 1-10 items per product
- **Coupon:** Minimum order validation
- **Password:** Min 6 characters

---

## 🚨 Error Handling

All errors follow standard format:

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details"
}
```

HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📚 Frontend Integration

### 1. User Authentication

```javascript
// Login
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { token } = await response.json();
localStorage.setItem("token", token);

// Use token in protected requests
fetch("/api/cart", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### 2. Product Fetching

```javascript
// Get products with filters
const products = await fetch(
  "/api/products?category=couple-tshirts&sort=price-low&limit=20",
).then((r) => r.json());
```

### 3. Cart Operations

```javascript
// Add to cart
await fetch("/api/cart/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ productId, quantity, size, color }),
});
```

### 4. Order Creation

```javascript
// Create order
const order = await fetch("/api/orders/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ cartItems, deliveryInfo, couponCode }),
}).then((r) => r.json());
```

---

## 📖 Additional Resources

- See `backend/API_DOCUMENTATION.md` for detailed endpoint documentation
- Check individual controller files for business logic
- Review model files for database schema structure

---

## 🤝 Support

For issues or questions:

1. Check API_DOCUMENTATION.md
2. Review error messages
3. Verify .env configuration
4. Check MongoDB connection
5. Ensure all dependencies are installed

---

## 📅 Version

Backend Version: 1.0.0
Last Updated: March 15, 2026
