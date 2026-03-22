# Soulvard E-Commerce API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 1. AUTH ENDPOINTS

### 1.1 Register User

- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "client" // optional, default is "client", can be "admin"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "createdAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.2 Login User

- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

- **Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.3 Logout

- **Endpoint:** `POST /auth/logout`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Logout successful. Please remove the token from client side."
}
```

### 1.4 Get User Profile

- **Endpoint:** `GET /auth/profile`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "role": "client",
    "defaultAddress": {
      "name": "John Doe",
      "phone": "+91 98765 43210",
      "address": "123 Main St",
      "pincode": "400001",
      "city": "Mumbai",
      "state": "Maharashtra"
    },
    "addresses": [...]
  }
}
```

### 1.5 Update User Profile

- **Endpoint:** `PUT /auth/profile`
- **Access:** Protected
- **Request Body:**

```json
{
  "name": "John Doe Updated",
  "phone": "+91 98765 43210",
  "defaultAddress": {
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "address": "123 Main St",
    "pincode": "400001",
    "city": "Mumbai",
    "state": "Maharashtra"
  }
}
```

### 1.6 Add Delivery Address

- **Endpoint:** `POST /auth/address`
- **Access:** Protected
- **Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "address": "123 Main Street, Apartment 4B",
  "pincode": "400001",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

### 1.7 Delete Delivery Address

- **Endpoint:** `DELETE /auth/address/:addressId`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": {...}
}
```

---

## 2. PRODUCTS ENDPOINTS

### 2.1 Get All Products

- **Endpoint:** `GET /products`
- **Access:** Public
- **Query Parameters:**
  - `category` - Filter by category slug
  - `inStock` - Filter by stock status (true/false)
  - `sort` - Sort by (featured, newest, oldest, price-low, price-high, name)
  - `search` - Search by name or description
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 20)
- **Example:** `GET /products?category=couple-tshirts&sort=price-low&page=1&limit=20`
- **Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Classic Wool Blazer",
      "price": 8999,
      "mrp": 12999,
      "discount": 31,
      "category": {...},
      "image": "https://...",
      "badge": "BESTSELLER",
      "inStock": true,
      "colors": [...],
      "sizes": [...]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### 2.2 Get Single Product

- **Endpoint:** `GET /products/:id`
- **Access:** Public
- **Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Duo Moqueen x Sally Tees",
    "price": 3599,
    "mrp": 4999,
    "discount": 28,
    "description": "...",
    "category": {...},
    "image": "https://...",
    "badge": "NEW",
    "colors": [
      {
        "name": "Black",
        "value": "black",
        "hex": "#1a1a1a",
        "images": ["url1", "url2", "url3"]
      }
    ],
    "sizes": [
      {"size": "S", "inStock": true},
      {"size": "M", "inStock": true},
      {"size": "L", "inStock": false}
    ],
    "inStock": true
  }
}
```

### 2.3 Create Product (Admin)

- **Endpoint:** `POST /products`
- **Access:** Protected (Admin only)
- **Request Body:**

```json
{
  "name": "New Product",
  "price": 2999,
  "mrp": 3999,
  "description": "Product description",
  "category": "categoryId",
  "image": "https://image-url.com/image.jpg",
  "badge": "NEW",
  "colors": [
    {
      "name": "Black",
      "value": "black",
      "hex": "#1a1a1a",
      "images": ["url1", "url2"]
    }
  ],
  "sizes": [
    { "size": "M", "inStock": true },
    { "size": "L", "inStock": true }
  ],
  "inStock": true,
  "stock": 50,
  "sku": "PROD-001"
}
```

### 2.4 Update Product (Admin)

- **Endpoint:** `PUT /products/:id`
- **Access:** Protected (Admin only)
- **Request Body:** Same as Create Product

### 2.5 Delete Product (Admin)

- **Endpoint:** `DELETE /products/:id`
- **Access:** Protected (Admin only)
- **Response (200):**

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {...}
}
```

---

## 3. CATEGORIES ENDPOINTS

### 3.1 Get All Categories

- **Endpoint:** `GET /categories`
- **Access:** Public
- **Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "...",
      "image": "https://...",
      "icon": "👕",
      "isActive": true
    }
  ],
  "total": 18
}
```

### 3.2 Get Single Category

- **Endpoint:** `GET /categories/:id`
- **Access:** Public

### 3.3 Create Category (Admin)

- **Endpoint:** `POST /categories`
- **Access:** Protected (Admin only)
- **Request Body:**

```json
{
  "name": "New Category",
  "description": "Category description",
  "image": "https://...",
  "icon": "🎽"
}
```

### 3.4 Update Category (Admin)

- **Endpoint:** `PUT /categories/:id`
- **Access:** Protected (Admin only)

### 3.5 Delete Category (Admin)

- **Endpoint:** `DELETE /categories/:id`
- **Access:** Protected (Admin only)

---

## 4. CART ENDPOINTS

### 4.1 Get User Cart

- **Endpoint:** `GET /cart`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "...",
        "productId": "...",
        "name": "Classic Wool Blazer",
        "price": 8999,
        "quantity": 1,
        "size": "M",
        "color": "Black",
        "image": "https://...",
        "mrp": 12999,
        "badge": "BESTSELLER"
      }
    ],
    "subtotal": 8999,
    "discount": 0,
    "tax": 1620,
    "shipping": 499,
    "total": 11118
  }
}
```

### 4.2 Add to Cart

- **Endpoint:** `POST /cart/add`
- **Access:** Protected
- **Request Body:**

```json
{
  "productId": "productId",
  "quantity": 1,
  "size": "M",
  "color": "Black",
  "colorValue": "black"
}
```

- **Response (200):**

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": [...],
  "cartCount": 5
}
```

### 4.3 Update Cart Item

- **Endpoint:** `PUT /cart/update/:itemId`
- **Access:** Protected
- **Request Body:**

```json
{
  "quantity": 2
}
```

### 4.4 Remove from Cart

- **Endpoint:** `DELETE /cart/remove/:itemId`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": [...]
}
```

### 4.5 Clear Cart

- **Endpoint:** `DELETE /cart/clear`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## 5. WISHLIST ENDPOINTS

### 5.1 Get Wishlist

- **Endpoint:** `GET /wishlist`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Premium Leather Journal",
      "price": 3599,
      "mrp": 4999,
      "image": "https://...",
      "badge": "PREMIUM",
      "inStock": true,
      "category": {...}
    }
  ],
  "total": 5
}
```

### 5.2 Add to Wishlist

- **Endpoint:** `POST /wishlist/add`
- **Access:** Protected
- **Request Body:**

```json
{
  "productId": "productId"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "Added to wishlist",
  "wishlistCount": 6
}
```

### 5.3 Remove from Wishlist

- **Endpoint:** `DELETE /wishlist/remove/:productId`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Removed from wishlist",
  "wishlistCount": 5
}
```

### 5.4 Check if in Wishlist

- **Endpoint:** `GET /wishlist/check/:productId`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "inWishlist": true
}
```

### 5.5 Clear Wishlist

- **Endpoint:** `DELETE /wishlist/clear`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Wishlist cleared"
}
```

---

## 6. ORDERS ENDPOINTS

### 6.1 Create Order

- **Endpoint:** `POST /orders/create`
- **Access:** Protected
- **Request Body:**

```json
{
  "cartItems": [
    {
      "productId": "...",
      "name": "Classic Wool Blazer",
      "price": 8999,
      "quantity": 1,
      "size": "M",
      "color": "Black",
      "image": "https://...",
      "id": "..." // Alternative to productId
    }
  ],
  "deliveryInfo": {
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "email": "john@example.com",
    "address": "123 Main Street",
    "pincode": "400001",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "paymentMethod": "card",
  "couponCode": "SOULVARD10" // optional
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD-20260315-0001",
    "status": "pending",
    "total": 11118,
    "estimatedDelivery": "2026-03-20T10:00:00.000Z",
    "paymentLink": "http://localhost:5000/api/orders/.../payment"
  }
}
```

### 6.2 Get User Orders

- **Endpoint:** `GET /orders/my-orders`
- **Access:** Protected
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `status` - Filter by status (pending, processing, shipped, delivered, cancelled)

### 6.3 Get Single Order

- **Endpoint:** `GET /orders/:id`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "orderId": "ORD-20260315-0001",
    "userId": "...",
    "items": [...],
    "deliveryInfo": {...},
    "pricing": {
      "subtotal": 8999,
      "discount": 300,
      "tax": 1540,
      "shipping": 0,
      "total": 10239
    },
    "couponCode": "SOULVARD10",
    "paymentMethod": "card",
    "paymentStatus": "pending",
    "status": "pending",
    "estimatedDelivery": "...",
    "createdAt": "..."
  }
}
```

### 6.4 Cancel Order

- **Endpoint:** `PUT /orders/:id/cancel`
- **Access:** Protected
- **Response (200):**

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {...}
}
```

### 6.5 Get All Orders (Admin)

- **Endpoint:** `GET /orders`
- **Access:** Protected (Admin only)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `status` - Filter by status
  - `userId` - Filter by user ID

### 6.6 Update Order Status (Admin)

- **Endpoint:** `PUT /orders/:id/status`
- **Access:** Protected (Admin only)
- **Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "TRK-123456",
  "notes": "Order shipped via courier"
}
```

---

## 7. COUPONS ENDPOINTS

### 7.1 Get All Coupons

- **Endpoint:** `GET /coupons`
- **Access:** Public
- **Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "code": "SOULVARD10",
      "description": "10% off on orders above ₹10000",
      "discountType": "percentage",
      "discount": 10,
      "minAmount": 10000,
      "maxDiscount": null,
      "usageLimit": 100,
      "usageCount": 45,
      "expiryDate": "2026-12-31",
      "isActive": true,
      "freeShipping": false
    }
  ],
  "total": 5
}
```

### 7.2 Validate Coupon

- **Endpoint:** `POST /coupons/validate`
- **Access:** Public
- **Request Body:**

```json
{
  "couponCode": "SOULVARD10",
  "subtotal": 15000
}
```

- **Response (200):**

```json
{
  "success": true,
  "valid": true,
  "discount": 1500,
  "message": "10% discount applied!",
  "coupon": {
    "code": "SOULVARD10",
    "minAmount": 10000,
    "discount": 10,
    "discountType": "percentage",
    "freeShipping": false
  }
}
```

### 7.3 Create Coupon (Admin)

- **Endpoint:** `POST /coupons`
- **Access:** Protected (Admin only)
- **Request Body:**

```json
{
  "code": "SUMMER25",
  "description": "25% off this summer",
  "discountType": "percentage",
  "discount": 25,
  "minAmount": 5000,
  "maxDiscount": 5000,
  "usageLimit": 200,
  "expiryDate": "2026-06-30",
  "freeShipping": false
}
```

### 7.4 Update Coupon (Admin)

- **Endpoint:** `PUT /coupons/:id`
- **Access:** Protected (Admin only)

### 7.5 Delete Coupon (Admin)

- **Endpoint:** `DELETE /coupons/:id`
- **Access:** Protected (Admin only)

---

## 8. NOTIFICATIONS ENDPOINTS

### 8.1 Subscribe to Newsletter

- **Endpoint:** `POST /notifications/newsletter/subscribe`
- **Access:** Public
- **Request Body:**

```json
{
  "email": "user@example.com"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2026-03-15T10:00:00.000Z"
  }
}
```

### 8.2 Unsubscribe from Newsletter

- **Endpoint:** `POST /notifications/newsletter/unsubscribe`
- **Access:** Public
- **Request Body:**

```json
{
  "email": "user@example.com"
}
```

### 8.3 Register Stock Notification

- **Endpoint:** `POST /notifications/stock-notification`
- **Access:** Public
- **Request Body:**

```json
{
  "productId": "...",
  "email": "user@example.com"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "You'll be notified when this product is back in stock",
  "data": {
    "productId": "...",
    "email": "user@example.com",
    "registeredAt": "2026-03-15T10:00:00.000Z"
  }
}
```

### 8.4 Get Newsletter Subscribers (Admin)

- **Endpoint:** `GET /notifications/newsletter/subscribers`
- **Access:** Protected (Admin only)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page

### 8.5 Get Stock Notifications (Admin)

- **Endpoint:** `GET /notifications/stock-notifications`
- **Access:** Protected (Admin only)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `productId` - Filter by product ID

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information" // Optional
}
```

### Common HTTP Status Codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (not enough permissions)
- **404** - Not Found
- **500** - Internal Server Error

---

## Frontend Integration Guide

### 1. Store JWT Token

After login/register, store the token in localStorage:

```javascript
localStorage.setItem("token", response.data.token);
```

### 2. Include Token in Requests

Add Authorization header to all protected requests:

```javascript
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Example with fetch
fetch("/api/orders/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(orderData),
});
```

### 3. Handle Token Expiry

If you receive a 401 response:

```javascript
if (response.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/";
}
```

### 4. Default Product Attributes

Ensure frontend sends/expects these fields for products:

```javascript
{
  (id, // Product ID from database
    name, // Product name
    price, // Current selling price
    mrp, // Original price
    image, // Primary product image
    category, // Category ID or slug
    badge, // Badge like "BESTSELLER", "NEW", etc.
    inStock, // Boolean, is product in stock
    colors, // Array of color variants with hex codes
    sizes); // Array of available sizes with stock status
}
```

---

## Setup Instructions

1. **Install Dependencies:**

```bash
npm install
```

2. **Configure Environment Variables:**
   Create `.env` file with:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Run Server:**

```bash
npm start        # Production
npm run dev      # Development with nodemon
```

4. **Server will start on:** `http://localhost:5000`

---

## Notes

- All timestamps are in ISO 8601 format
- All prices are in Indian Rupees (₹)
- Coupon discounts are applied before tax calculation
- Shipping is free if subtotal > ₹5000
- Tax (GST) is 18% on (subtotal - discount)
- Default pagination: page 1, limit 20
- Product quantity range: 1-10
