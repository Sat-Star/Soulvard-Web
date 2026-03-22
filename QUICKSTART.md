# 🚀 QUICKSTART GUIDE - Soulvard E-Commerce Backend

## ⏱️ Setup Time: ~5 minutes

### Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 2: Verify .env File

Check that `.env` exists in the root directory with:

```env

```

### Step 3: Start Server (1 minute)

```bash
npm run dev
```

You should see:

```
MongoDB Connected: cluster0.xaecowa.mongodb.net
Server running on http://localhost:5000
```

### Step 4: Seed Database with Sample Data (Optional but recommended)

In a new terminal:

```bash
npm run seed
```

This creates:

- ✅ Admin user (email: admin@soulvard.com / password: admin123)
- ✅ Regular user (email: user@soulvard.com / password: user123)
- ✅ 6 product categories
- ✅ 6 sample products with variants
- ✅ 5 coupon codes for testing

---

## 🧪 Test the API

### Using cURL

#### 1. Login and Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@soulvard.com","password":"user123"}'
```

**Save the token from response**

#### 2. Get All Products

```bash
curl http://localhost:5000/api/products?limit=5
```

#### 3. Get User Profile (with token)

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Add to Cart (with token)

```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId":"PRODUCT_ID_HERE",
    "quantity":1,
    "size":"M",
    "color":"Black"
  }'
```

Replace `YOUR_TOKEN_HERE` with the actual token from step 1.

---

### Using Postman

1. **Create a new Postman collection**

2. **Set up variables:**
   - Create a variable `baseUrl` = `http://localhost:5000`
   - Create a variable `token` = (leave empty for now)

3. **Create request 1: Login**
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/login`
   - Body (JSON):

   ```json
   {
     "email": "user@soulvard.com",
     "password": "user123"
   }
   ```

   - Tests tab:

   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

4. **Create request 2: Get Cart**
   - Method: GET
   - URL: `{{baseUrl}}/api/cart`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer {{token}}`

5. **Create request 3: Add to Cart**
   - Method: POST
   - URL: `{{baseUrl}}/api/cart/add`
   - Headers:
     - `Authorization: Bearer {{token}}`
   - Body (JSON):
   ```json
   {
     "productId": "PRODUCT_ID_FROM_DB",
     "quantity": 1,
     "size": "M",
     "color": "Black"
   }
   ```

---

## 📊 Check Database

### Get Product IDs

You can view products via API:

```bash
curl http://localhost:5000/api/products
```

The response will show you product \_id values to use in cart operations.

### MongoDB Atlas

Log in to MongoDB Atlas to view:

1. Go to https://cloud.mongodb.com
2. Login with: soulvard_client / client123
3. Navigate to Cluster0 → Collections
4. View data in databases

---

## 🔑 Available Test Credentials

### Admin Account

```
Email: admin@soulvard.com
Password: admin123
Role: admin
```

**Can:** Manage products, categories, coupons, view all orders

### Regular User Account

```
Email: user@soulvard.com
Password: user123
Role: client
```

**Can:** Browse products, manage cart/wishlist, create orders

---

## 🧾 Sample Coupon Codes

```
SOULVARD10    - 10% off (min ₹10,000)
WELCOME       - 20% off (no minimum)
FREESHIP      - Free shipping
SUMMER25      - 25% off (min ₹5,000)
SOULVARD15    - 15% off (min ₹50,000)
```

---

## 📋 Common API Flows

### 📦 Create an Order

1. Login → Get token
2. Add to cart: `POST /api/cart/add`
3. Get cart: `GET /api/cart`
4. Validate coupon (optional): `POST /api/coupons/validate`
5. Create order: `POST /api/orders/create`

### ❤️ Add to Wishlist

1. Login → Get token
2. Add to wishlist: `POST /api/wishlist/add`
3. Get wishlist: `GET /api/wishlist`
4. Check if in wishlist: `GET /api/wishlist/check/:productId`

### 💌 Newsletter Signup

1. Subscribe: `POST /api/notifications/newsletter/subscribe`
   - (No authentication needed)

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"

```bash
npm install
```

### "MongoDB connection error"

- Check `.env` MONGODB_URL is correct
- Ensure MongoDB URL has proper credentials
- Check internet connection

### "Port 5000 already in use"

```bash
# Change PORT in .env or
kill process on port 5000
```

### "CORS error in browser"

- CORS is already enabled in server.js
- Check request header format
- Verify token format: `Bearer token_here`

---

## 📚 API Endpoints Quick Reference

| Method | Endpoint                                | Auth | Description        |
| ------ | --------------------------------------- | ---- | ------------------ |
| POST   | /api/auth/register                      | -    | Create new user    |
| POST   | /api/auth/login                         | -    | Login user         |
| GET    | /api/products                           | -    | Get all products   |
| GET    | /api/products/:id                       | -    | Get single product |
| GET    | /api/cart                               | ✓    | Get user cart      |
| POST   | /api/cart/add                           | ✓    | Add to cart        |
| POST   | /api/wishlist/add                       | ✓    | Add to wishlist    |
| POST   | /api/orders/create                      | ✓    | Create order       |
| POST   | /api/coupons/validate                   | -    | Validate coupon    |
| POST   | /api/notifications/newsletter/subscribe | -    | Subscribe          |

✓ = Requires authentication (Bearer token)

---

## 🎯 Next Steps

1. ✅ Backend running
2. 📱 Update frontend to use API endpoints
3. 🔗 Replace hardcoded data with API calls
4. 🧪 Test all flows end-to-end
5. 📝 Deploy to production

---

## 📖 Documentation

- **Full API Docs:** [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
- **Setup Guide:** [backend/README.md](backend/README.md)
- **Frontend Integration:** See `client/scripts/` files

---

## 💡 Tips

- Save token in localStorage after login
- Always include `Content-Type: application/json` header
- Use Bearer format for token: `Bearer eyJhbGc...`
- Check error messages for validation hints
- Products have colors and sizes as variants
- Coupon codes are case-insensitive but stored in uppercase

---

## 🎉 You're All Set!

Your backend is ready to go. Start exploring the API and integrate it with your frontend!

**Questions? Check:**

1. API_DOCUMENTATION.md for endpoint details
2. Error messages are descriptive
3. Browser console for request/response details
4. MongoDB Atlas for data verification

Happy coding! 🚀
