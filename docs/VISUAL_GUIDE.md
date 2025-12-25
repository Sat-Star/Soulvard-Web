# Visual Guide: Backend Implementation Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATIONS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐      ┌──────────────────────────┐    │
│  │   ADMIN PANEL            │      │  CUSTOMER PORTAL         │    │
│  │  /admin/admin.html       │      │  /client/index.html      │    │
│  │  /admin/admin.js         │      │  (To be updated)         │    │
│  │                          │      │                          │    │
│  │  - Product CRUD          │      │  - Product Browsing      │    │
│  │  - Category Mgmt         │      │  - Shopping Cart         │    │
│  │  - Coupon Creation       │      │  - Wishlist              │    │
│  │  - Playlist Mgmt         │      │  - Checkout              │    │
│  │  - Hero Images           │      │  - User Account          │    │
│  │  - Size Charts           │      │                          │    │
│  │  - Promotions            │      │  (Plus Login Page)       │    │
│  └──────────────────────────┘      └──────────────────────────┘    │
│           ▲                                    ▲                     │
│           │ JWT Token Header                  │ JWT Token Header   │
│           │ API Calls                         │ API Calls          │
└───────────┼────────────────────────────────────┼────────────────────┘
            │ HTTP/FETCH                        │ HTTP/FETCH
            │ Requests                          │ Requests
            └────────────────────┬───────────────┘
                                 ▼
        ┌──────────────────────────────────────────────┐
        │      EXPRESS.JS API SERVER (localhost:5000)  │
        ├──────────────────────────────────────────────┤
        │                                              │
        │  MIDDLEWARE LAYER:                          │
        │  ├─ CORS Handler                            │
        │  ├─ JSON Parser                             │
        │  ├─ JWT Verification                        │
        │  └─ File Upload (Multer)                    │
        │                                              │
        │  ROUTE HANDLERS:                            │
        │  ├─ /api/auth      (2 endpoints)            │
        │  ├─ /api/products  (5 endpoints)            │
        │  ├─ /api/categories (3 endpoints)           │
        │  ├─ /api/coupons   (5 endpoints)            │
        │  ├─ /api/playlists (6 endpoints)            │
        │  ├─ /api/hero-images (4 endpoints)          │
        │  ├─ /api/size-charts (5 endpoints)          │
        │  └─ /api/promotions (4 endpoints)           │
        │     TOTAL: 34 RESTful Endpoints             │
        │                                              │
        │  STATIC FILES:                              │
        │  ├─ /uploads/* (Uploaded images)            │
        │  └─ /admin & /client (Served files)         │
        │                                              │
        └────────────┬─────────────────────────────────┘
                     │ Mongoose ODM
                     │ Database Queries
                     ▼
        ┌──────────────────────────────────────────────┐
        │         MONGODB DATABASE                      │
        ├──────────────────────────────────────────────┤
        │                                              │
        │  Collections (Tables):                       │
        │  ├─ users        (Customer & Admin accounts) │
        │  ├─ products     (All products with info)   │
        │  ├─ categories   (Product categories)        │
        │  ├─ coupons      (Discount codes)            │
        │  ├─ playlists    (Product collections)       │
        │  ├─ heroimages   (Banner images)             │
        │  ├─ sizecharts   (Size guides)               │
        │  └─ promotions   (Active offers)             │
        │                                              │
        └──────────────────────────────────────────────┘
```

---

## 📊 Data Flow Examples

### Example 1: User Login Flow

```
┌──────────────┐
│ Customer     │
│ Login Form   │
└──────┬───────┘
       │ Email + Password
       ▼
┌──────────────────────────────┐
│ POST /api/auth/login         │
├──────────────────────────────┤
│ 1. Verify email exists       │
│ 2. Compare hashed passwords  │
│ 3. Generate JWT token        │
└──────┬───────────────────────┘
       │ Return token + user info
       ▼
┌──────────────────────┐
│ Store JWT in localStorage  │
│ Redirect to Dashboard      │
└──────────────────────┘
```

### Example 2: Create Product (Admin)

```
┌─────────────────────┐
│ Admin Form         │
│ - Product details  │
│ - Images (upload)  │
│ - Colors, Sizes    │
└──────┬──────────────┘
       │ FormData + JWT
       ▼
┌──────────────────────────────┐
│ POST /api/products           │
├──────────────────────────────┤
│ 1. Verify JWT token          │
│ 2. Verify admin role         │
│ 3. Save images with Multer   │
│ 4. Create product in MongoDB │
└──────┬───────────────────────┘
       │ Return new product
       ▼
┌─────────────────────────┐
│ Product created!       │
│ Display in table       │
│ Update product list    │
└─────────────────────────┘
```

### Example 3: Fetch Products (Customer)

```
┌──────────────────┐
│ Product Page     │
│ (No login needed)│
└──────┬───────────┘
       │ No auth header
       ▼
┌──────────────────────────┐
│ GET /api/products        │
├──────────────────────────┤
│ 1. No JWT verification   │
│ 2. Fetch all products    │
│ 3. Return product array  │
└──────┬───────────────────┘
       │ Product data
       ▼
┌──────────────────────┐
│ Display products    │
│ Show images         │
│ Add to cart button  │
└──────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                 AUTHENTICATION SYSTEM                    │
└─────────────────────────────────────────────────────────┘

Login Request:
  ├─ Username + Password
  ├─ Check in MongoDB
  ├─ If invalid: Return 401
  └─ If valid: Generate JWT → Return to client

JWT Token Structure:
  ├─ Header: Algorithm (HS256)
  ├─ Payload: user ID, email, role, expiry
  └─ Signature: Signed with JWT_SECRET

Subsequent Requests:
  ├─ Header: "Authorization: Bearer <JWT_TOKEN>"
  ├─ Server verifies signature
  ├─ If invalid: Return 401
  └─ If valid: Process request with user info

Admin Routes:
  ├─ Verify JWT
  ├─ Check role == "admin"
  ├─ If customer: Return 403
  └─ If admin: Process request
```

---

## 📦 API Endpoint Summary

```
┌─────────────────────────────────────────────────────────┐
│           COMPLETE API ENDPOINT OVERVIEW                │
└─────────────────────────────────────────────────────────┘

Authentication (2)
  ├─ POST   /api/auth/signup          (Customer signup)
  └─ POST   /api/auth/login           (Login any user)

Products (5)
  ├─ GET    /api/products             (List all)
  ├─ GET    /api/products/:id         (Get one)
  ├─ POST   /api/products             (Create - Admin)
  ├─ PUT    /api/products/:id         (Update - Admin)
  └─ DELETE /api/products/:id         (Delete - Admin)

Categories (3)
  ├─ GET    /api/categories           (List all)
  ├─ POST   /api/categories           (Create - Admin)
  └─ DELETE /api/categories/:id       (Delete - Admin)

Coupons (5)
  ├─ GET    /api/coupons             (Active only)
  ├─ POST   /api/coupons/validate    (Check validity)
  ├─ POST   /api/coupons            (Create - Admin)
  ├─ PUT    /api/coupons/:id        (Update - Admin)
  └─ DELETE /api/coupons/:id        (Delete - Admin)

Playlists (6)
  ├─ GET    /api/playlists          (List all)
  ├─ GET    /api/playlists/:slug    (Get one)
  ├─ POST   /api/playlists          (Create - Admin)
  ├─ POST   /api/playlists/:id/products     (Add - Admin)
  ├─ DELETE /api/playlists/:id/products/:pId (Remove)
  └─ DELETE /api/playlists/:id      (Delete - Admin)

Hero Images (4)
  ├─ GET    /api/hero-images        (List all)
  ├─ POST   /api/hero-images        (Create - Admin)
  ├─ PUT    /api/hero-images/:id   (Update - Admin)
  └─ DELETE /api/hero-images/:id   (Delete - Admin)

Size Charts (5)
  ├─ GET    /api/size-charts        (List all)
  ├─ GET    /api/size-charts/:cat   (Get one)
  ├─ POST   /api/size-charts        (Create - Admin)
  ├─ PUT    /api/size-charts/:id   (Update - Admin)
  └─ DELETE /api/size-charts/:id   (Delete - Admin)

Promotions (4)
  ├─ GET    /api/promotions         (Active only)
  ├─ POST   /api/promotions         (Create - Admin)
  ├─ PUT    /api/promotions/:id    (Update - Admin)
  └─ DELETE /api/promotions/:id    (Delete - Admin)

                    TOTAL: 34 Endpoints
```

---

## 🗂️ Database Schema Relationships

```
┌─────────────────────────────────────────────────────────┐
│            DATABASE SCHEMA RELATIONSHIPS                 │
└─────────────────────────────────────────────────────────┘

User (8 fields)
  ├─ _id (ObjectId)
  ├─ name (String)
  ├─ email (String, unique)
  ├─ password (String, hashed)
  ├─ role (enum: customer|admin)
  ├─ phone (String)
  ├─ address (String)
  └─ timestamps (createdAt, updatedAt)

Product (13 fields)
  ├─ _id (ObjectId)
  ├─ id (String, unique)
  ├─ name (String)
  ├─ description (String)
  ├─ category (String) ─────┐
  ├─ price (Number)         │
  ├─ stock (Number)         │
  ├─ status (enum)          │
  ├─ shipping (Number)      │
  ├─ colors (Array)         │
  ├─ sizes (Array)          │
  ├─ images (Array)         │
  ├─ featured (Boolean)     │
  └─ timestamps             │
                             │
Category (3 fields)          │
  ├─ _id (ObjectId)         │
  ├─ name (String) ◄────────┘
  ├─ slug (String)
  └─ timestamps

Coupon (8 fields)
  ├─ _id (ObjectId)
  ├─ code (String)
  ├─ discount (Number)
  ├─ startDate (Date)
  ├─ endDate (Date)
  ├─ applicableProducts (Array)
  ├─ usageLimit (Number)
  ├─ usageCount (Number)
  ├─ status (calculated)
  └─ timestamps

Playlist (4 fields)
  ├─ _id (ObjectId)
  ├─ name (String)
  ├─ slug (String)
  ├─ products (Array) ──────┐
  │  ├─ productId ──────────┘ References Product._id
  │  └─ position
  └─ timestamps

HeroImage (4 fields)
  ├─ _id (ObjectId)
  ├─ imageUrl (String)
  ├─ title (String)
  ├─ position (Number)
  └─ timestamps

SizeChart (3 fields)
  ├─ _id (ObjectId)
  ├─ category (String)
  ├─ sizes (Array of objects)
  │  ├─ size (String)
  │  ├─ chest (String)
  │  ├─ waist (String)
  │  ├─ hip (String)
  │  └─ length (String)
  └─ timestamps

Promotion (5 fields)
  ├─ _id (ObjectId)
  ├─ title (String)
  ├─ description (String)
  ├─ endDate (Date)
  ├─ active (Boolean)
  └─ timestamps
```

---

## 🔄 Request-Response Cycle

```
1. REQUEST FROM CLIENT
   ├─ Method: GET/POST/PUT/DELETE
   ├─ Path: /api/resource
   ├─ Headers:
   │  ├─ Content-Type: application/json
   │  └─ Authorization: Bearer <token> (if needed)
   └─ Body: JSON data or FormData

2. SERVER PROCESSING
   ├─ CORS check
   ├─ Parse request body
   ├─ JWT verification (if protected)
   ├─ Admin role check (if admin route)
   ├─ Input validation
   ├─ File upload (if applicable)
   ├─ Database query/operation
   └─ Response generation

3. RESPONSE TO CLIENT
   ├─ Status Code:
   │  ├─ 200 (OK)
   │  ├─ 201 (Created)
   │  ├─ 400 (Bad Request)
   │  ├─ 401 (Unauthorized)
   │  ├─ 403 (Forbidden)
   │  ├─ 404 (Not Found)
   │  └─ 500 (Server Error)
   └─ JSON Body:
      ├─ message (String)
      └─ data (Object/Array, if applicable)
```

---

## 📋 File Organization

```
Soulvard E-Commerce/
│
├─ backend/                    ← All backend code
│  ├─ models/                  ← 8 Database schemas
│  ├─ routes/                  ← 8 API route files
│  ├─ middleware/              ← Auth & Upload
│  ├─ uploads/                 ← Stored images
│  ├─ db.js                    ← MongoDB connection
│  └─ seed.js                  ← Sample data
│
├─ admin/                      ← Admin panel (to update)
│  ├─ admin.html
│  ├─ admin.js                 ← Replace with API calls
│  └─ admin.css
│
├─ client/                     ← Customer portal (to create)
│  ├─ index.html
│  ├─ scripts/
│  └─ styles/
│
├─ server.js                   ← Main Express app
├─ package.json                ← Dependencies
├─ .env                        ← Config (SECRET!)
└─ Documentation files
   ├─ BACKEND_SETUP.md
   ├─ API_TESTING_GUIDE.md
   ├─ IMPLEMENTATION_SUMMARY.md
   ├─ ADMIN_INTEGRATION_EXAMPLE.md
   ├─ IMPLEMENTATION_CHECKLIST.md
   ├─ PROJECT_STRUCTURE.md
   └─ IMPLEMENTATION_COMPLETE.md
```

---

## 🚀 Startup Sequence

```
npm start
   ↓
Load environment variables (.env)
   ↓
Connect to MongoDB
   ├─ Success → "MongoDB connected"
   └─ Failure → Exit with error
   ↓
Initialize Express app
   ↓
Setup middleware
   ├─ CORS
   ├─ JSON parser
   ├─ Static file serving
   └─ Route handlers
   ↓
Listen on port (5000)
   ↓
Console: "Server running on http://localhost:5000"
   ↓
Ready to accept requests ✓
```

---

## 💾 Image Upload Lifecycle

```
1. User selects image in admin panel
   ↓
2. File travels in FormData
   ↓
3. Server receives via Multer
   ├─ Check file type (JPEG/PNG/GIF/JPG only)
   ├─ Check file size (max 10MB)
   ├─ Generate unique filename
   │  └─ Format: <timestamp>-<random>.<ext>
   └─ Save to /backend/uploads/
   ↓
4. Return path: /uploads/filename.ext
   ↓
5. Store path in MongoDB
   ↓
6. Serve image via static route /uploads/
   ↓
7. Display in frontend
```

---

This visual guide should help you understand the complete flow and architecture! 🎉
