# Soulvard E-Commerce Backend Setup Guide

## Project Structure

```
Soulvard E-Commerce/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── Playlist.js
│   │   ├── HeroImage.js
│   │   ├── SizeChart.js
│   │   └── Promotion.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── coupons.js
│   │   ├── playlists.js
│   │   ├── heroImages.js
│   │   ├── sizeCharts.js
│   │   └── promotions.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   └── db.js
├── admin/
├── client/
├── server.js
├── package.json
└── .env
```

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables (.env):**

   ```
   PORT=5000
   MONGODB_URL=mongodb://localhost:27017/soulvard
   JWT_SECRET=your_jwt_secret_key_change_this
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   Make sure your MongoDB instance is running at the URL specified in `.env`

4. **Start the server:**
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with nodemon
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new customer
- `POST /api/auth/login` - Login (customer or admin)

### Products

- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories

- `GET /api/categories` - Get all categories (public)
- `POST /api/categories` - Create category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Coupons

- `GET /api/coupons` - Get active coupons (public)
- `POST /api/coupons/validate` - Validate coupon code (public)
- `POST /api/coupons` - Create coupon (admin only)
- `PUT /api/coupons/:id` - Update coupon (admin only)
- `DELETE /api/coupons/:id` - Delete coupon (admin only)

### Playlists

- `GET /api/playlists` - Get all playlists (public)
- `GET /api/playlists/:slug` - Get single playlist (public)
- `POST /api/playlists` - Create playlist (admin only)
- `POST /api/playlists/:id/products` - Add product to playlist (admin only)
- `DELETE /api/playlists/:id/products/:productId` - Remove product from playlist (admin only)
- `DELETE /api/playlists/:id` - Delete playlist (admin only)

### Hero Images

- `GET /api/hero-images` - Get all hero images (public)
- `POST /api/hero-images` - Create hero image (admin only)
- `PUT /api/hero-images/:id` - Update hero image (admin only)
- `DELETE /api/hero-images/:id` - Delete hero image (admin only)

### Size Charts

- `GET /api/size-charts` - Get all size charts (public)
- `GET /api/size-charts/:category` - Get single size chart (public)
- `POST /api/size-charts` - Create size chart (admin only)
- `PUT /api/size-charts/:id` - Update size chart (admin only)
- `DELETE /api/size-charts/:id` - Delete size chart (admin only)

### Promotions

- `GET /api/promotions` - Get active promotions (public)
- `POST /api/promotions` - Create promotion (admin only)
- `PUT /api/promotions/:id` - Update promotion (admin only)
- `DELETE /api/promotions/:id` - Delete promotion (admin only)

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Image Upload

Images are uploaded to `backend/uploads/` and served via `/uploads/` route.
Maximum file size: 10MB
Supported formats: JPEG, JPG, PNG, GIF

## Database Models

All models are stored in `backend/models/` with the following features:

- Automatic timestamps (createdAt, updatedAt)
- Data validation
- Relationships (e.g., Playlist references Product)

## Next Steps

1. Create admin users manually in MongoDB with role: "admin"
2. Update the admin panel to use these API endpoints
3. Update the client to fetch data from these endpoints
4. Implement order management system
5. Add cart functionality
6. Implement payment integration
