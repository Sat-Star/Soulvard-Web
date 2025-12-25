/\*\*

- API Testing Guide - Using Postman or curl
-
- Base URL: http://localhost:5000/api
  \*/

// ============================================
// 1. AUTHENTICATION ENDPOINTS
// ============================================

// Sign Up (Create Customer Account)
POST /api/auth/signup
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "password123",
"phone": "+91 9876543210",
"address": "123 Main Street"
}

// Response:
{
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "user_id",
"name": "John Doe",
"email": "john@example.com",
"role": "customer"
}
}

// Login (Customer or Admin)
POST /api/auth/login
Content-Type: application/json

{
"email": "admin@soulvard.com",
"password": "admin123"
}

// Response:
{
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "admin_id",
"name": "Admin User",
"email": "admin@soulvard.com",
"role": "admin"
}
}

// ============================================
// 2. PRODUCTS ENDPOINTS
// ============================================

// Get All Products (Public)
GET /api/products

// Get Single Product (Public)
GET /api/products/{productId}

// Create Product (Admin Only)
POST /api/products
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:

- id: "003"
- name: "Cashmere Coat"
- description: "Premium cashmere coat"
- category: "Coats"
- price: 45000
- stock: 10
- shipping: 300
- images: [file1, file2, file3]
- colors: JSON string: [{"name": "Black", "value": "#000000"}]
- sizes: JSON string: ["S", "M", "L"]
- featured: "true"

// Update Product (Admin Only)
PUT /api/products/{productId}
Authorization: Bearer {token}
Content-Type: multipart/form-data
(Same as POST)

// Delete Product (Admin Only)
DELETE /api/products/{productId}
Authorization: Bearer {token}

// ============================================
// 3. CATEGORIES ENDPOINTS
// ============================================

// Get All Categories (Public)
GET /api/categories

// Create Category (Admin Only)
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
"name": "Dresses"
}

// Delete Category (Admin Only)
DELETE /api/categories/{categoryId}
Authorization: Bearer {token}

// ============================================
// 4. COUPONS ENDPOINTS
// ============================================

// Get Active Coupons (Public)
GET /api/coupons

// Validate Coupon (Public)
POST /api/coupons/validate
Content-Type: application/json

{
"code": "SOULVARD20"
}

// Response:
{
"valid": true,
"discount": 20,
"coupon": { ... }
}

// Create Coupon (Admin Only)
POST /api/coupons
Authorization: Bearer {token}
Content-Type: application/json

{
"code": "NEWYEAR25",
"discount": 25,
"startDate": "2025-01-01",
"endDate": "2025-01-31",
"applicableProducts": ["all"],
"usageLimit": 100
}

// Update Coupon (Admin Only)
PUT /api/coupons/{couponId}
Authorization: Bearer {token}
(Same fields as POST)

// Delete Coupon (Admin Only)
DELETE /api/coupons/{couponId}
Authorization: Bearer {token}

// ============================================
// 5. PLAYLISTS ENDPOINTS
// ============================================

// Get All Playlists (Public)
GET /api/playlists

// Get Single Playlist (Public)
GET /api/playlists/{slug}

// Create Playlist (Admin Only)
POST /api/playlists
Authorization: Bearer {token}
Content-Type: application/json

{
"name": "Summer Collection"
}

// Add Product to Playlist (Admin Only)
POST /api/playlists/{playlistId}/products
Authorization: Bearer {token}
Content-Type: application/json

{
"productId": "product_id",
"position": 0
}

// Remove Product from Playlist (Admin Only)
DELETE /api/playlists/{playlistId}/products/{productId}
Authorization: Bearer {token}

// Delete Playlist (Admin Only)
DELETE /api/playlists/{playlistId}
Authorization: Bearer {token}

// ============================================
// 6. HERO IMAGES ENDPOINTS
// ============================================

// Get All Hero Images (Public)
GET /api/hero-images

// Create Hero Image (Admin Only)
POST /api/hero-images
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:

- image: [file]
- title: "Summer Sale"
- position: 0

// Update Hero Image (Admin Only)
PUT /api/hero-images/{heroImageId}
Authorization: Bearer {token}
Content-Type: multipart/form-data
(Same as POST, image field is optional)

// Delete Hero Image (Admin Only)
DELETE /api/hero-images/{heroImageId}
Authorization: Bearer {token}

// ============================================
// 7. SIZE CHARTS ENDPOINTS
// ============================================

// Get All Size Charts (Public)
GET /api/size-charts

// Get Single Size Chart (Public)
GET /api/size-charts/{category}

// Create Size Chart (Admin Only)
POST /api/size-charts
Authorization: Bearer {token}
Content-Type: application/json

{
"category": "Dresses",
"sizes": [
{
"size": "XS",
"chest": "32-34",
"waist": "26-28",
"hip": "34-36",
"length": "26"
},
{
"size": "S",
"chest": "34-36",
"waist": "28-30",
"hip": "36-38",
"length": "27"
}
]
}

// Update Size Chart (Admin Only)
PUT /api/size-charts/{sizeChartId}
Authorization: Bearer {token}
(Same as POST)

// Delete Size Chart (Admin Only)
DELETE /api/size-charts/{sizeChartId}
Authorization: Bearer {token}

// ============================================
// 8. PROMOTIONS ENDPOINTS
// ============================================

// Get Active Promotions (Public)
GET /api/promotions

// Create Promotion (Admin Only)
POST /api/promotions
Authorization: Bearer {token}
Content-Type: application/json

{
"title": "Winter Clearance",
"description": "Up to 50% off on selected items",
"endDate": "2025-02-28",
"active": true
}

// Update Promotion (Admin Only)
PUT /api/promotions/{promotionId}
Authorization: Bearer {token}
(Same as POST)

// Delete Promotion (Admin Only)
DELETE /api/promotions/{promotionId}
Authorization: Bearer {token}

// ============================================
// IMPORTANT NOTES
// ============================================

/\*

1. For all Admin-only endpoints, include Authorization header with Bearer token
2. Get token from /api/auth/login endpoint
3. For multipart/form-data requests, use form data instead of JSON
4. Image upload uses multer - max 10MB per file
5. When sending JSON in form data fields (like colors, sizes), stringify them
6. Dates should be in ISO format: "2025-01-01" or "2025-01-01T00:00:00Z"
7. Price and numeric fields should be sent as numbers, not strings
   \*/
