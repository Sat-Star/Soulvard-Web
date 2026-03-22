# 🐛 Troubleshooting & FAQs

## Common Issues & Solutions

---

## 🚀 Server Won't Start

### Error: "Cannot find module 'express'"

```bash
# Solution: Install dependencies
npm install
```

### Error: "Port 5000 is already in use"

```bash
# Option 1: Kill process on that port
# Windows/PowerShell:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Option 2: Use different port
# Edit .env:
PORT=5001
```

### Error: "MongoDB connection error"

```
Possible causes:
1. MongoDB Atlas credentials wrong
2. IP not whitelisted on MongoDB Atlas
3. Connection string has typo
4. No internet connection

Solutions:
1. Verify .env MONGODB_URL is correct
2. Check MongoDB Atlas > Network Access > Add IP
3. Verify credentials (soulvard_client / client123)
4. Test connection: ping cluster0.xaecowa.mongodb.net
```

---

## 🔐 Authentication Issues

### "Invalid token" error

```
Causes:
1. Token not stored correctly
2. Token format wrong in header
3. Token expired (30 days)

Solutions:
1. Check localStorage has 'token' key
2. Use format: "Authorization: Bearer TOKEN" (with space)
3. Login again to get new token
```

### "User not found" after login

```
Causes:
1. User deleted from database
2. Wrong .env MONGODB_URL
3. Using wrong database

Solutions:
1. Run npm run seed to recreate test users
2. Verify .env MONGODB_URL
3. Check MongoDB Atlas to see if data exists
```

### Can't add to cart without login

```
This is correct behavior!
Cart operations require authentication.

Solution:
1. User must login first
2. Frontend should redirect to /login if not authenticated
3. See FRONTEND_INTEGRATION.md for code examples
```

---

## 📦 APIs Not Working

### "Route not found" (404)

```
Causes:
1. Wrong endpoint URL
2. Typo in API path
3. Method is wrong (GET vs POST)

Solutions:
1. Check API_DOCUMENTATION.md for correct endpoints
2. Verify exact path: /api/products (not /api/product)
3. Verify HTTP method (POST vs PUT)
```

### "Bad Request" (400)

```
Causes:
1. Missing required fields
2. Invalid data format
3. Validation error

Solutions:
1. Check request body has all required fields
2. Verify JSON format is correct
3. Read error message - it tells you what's wrong
```

### "CORS Error in browser"

```
Error: "Access to XMLHttpRequest blocked by CORS"

Causes:
1. Server headers wrong
2. Frontend origin restricted
3. Wrong API base URL

Solutions:
1. CORS is enabled in server.js
2. Should work from http://localhost:5000
3. Check API_DOCUMENTATION.md for correct URLs
```

---

## 💾 Database Issues

### "Can't see data in MongoDB Atlas"

```bash
Solutions:
1. Verify correct database: cluster0
2. Check correct collection name
3. Ensure data was seeded properly:
   npm run seed

4. Check in MongoDB Atlas:
   Cluster0 > Browse Collections > Look for documents
```

### "Database keeps losing data"

```
Causes:
1. Deleting free-tier data after 30 days
2. Wrong connection string

Solutions:
1. Ensure paid tier or regular activity
2. Verify MONGODB_URL in .env
3. Create backup before deleting
```

---

## 🔀 Seeding Issues

### "Error: seed.js not found"

```bash
# Ensure .env has correct MONGODB_URL first
# Then run:
npm run seed
```

### "Seed runs but no data appears"

```bash
# Verify MongoDB connection:
1. Check .env MONGODB_URL
2. Test manual MongoDB connection
3. Run seed again with npm run seed

# If still failing:
1. Delete collections manually in MongoDB Atlas
2. Run seed again
```

---

## 🔗 Frontend Integration Issues

### "API calls return 401 Unauthorized"

```javascript
Causes:
1. Token not included in header
2. Token format wrong
3. Token expired

Solutions:
// Correct format:
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};

// Common mistakes:
'Authorization': localStorage.getItem('token') // ❌ Missing "Bearer"
'authorization': 'Bearer token'  // ❌ Wrong case
'auth': 'Bearer token'           // ❌ Wrong header name
```

### "Can't login from frontend"

```javascript
// Check:
1. Email and password are correct
2. User exists in database (check MongoDB)
3. Token is saved: console.log(localStorage.getItem('token'))

// Test with curl:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@soulvard.com","password":"user123"}'
```

### "Cart shows empty but added items"

```javascript
Causes:
1. Not fetching from API
2. User changed, lost cart
3. API response not parsed

Solutions:
// Instead of localStorage:
const cart = await fetch('/api/cart', {
  headers: {'Authorization': `Bearer ${token}`}
}).then(r => r.json());

console.log(cart.data); // Should show items
```

---

## 💳 Order/Checkout Issues

### "Can't create order without items"

```
Error: "Cart items are required"

Solutions:
1. Add items to cart first
2. Verify cart has items via GET /api/cart
3. Pass items array in request body
```

### "Coupon not applying"

```
Possible reasons:
1. Coupon code wrong or expired
2. Order amount below minimum
3. Already used up usage limit

Solutions:
1. Verify coupon code (case-insensitive)
2. Check minAmount requirement
3. Test with WELCOME (no restrictions)
```

### "Order created but shows 'pending' status"

```
This is correct!

Status flow:
pending → processing → shipped → delivered

Admin updates status manually:
PUT /api/orders/{id}/status
```

---

## 🛒 Cart Calculation Issues

### "Tax calculation wrong"

```
Remember:
- Tax = 18% of (subtotal - discount)
- NOT 18% of subtotal

Example:
subtotal: 10000
discount: 1000 (from coupon)
tax: (10000 - 1000) * 0.18 = 1620 ✓
NOT: 10000 * 0.18 = 1800 ✗
```

### "Shipping not free for large orders"

```
Rule: Free if subtotal - discount > 5000

Example:
subtotal: 6000
discount: 0
shipping: FREE ✓

subtotal: 6000
discount: 1500
shipping: ₹499 ✓ (Because final is 4500 < 5000)
```

---

## 📊 Product Issues

### "Can't find product by ID"

```bash
# Use correct ID format from MongoDB:
# ❌ Wrong: id: 1
# ✓ Correct: _id: "507f1f77bcf86cd799439011"

# Get correct IDs:
curl http://localhost:5000/api/products?limit=5
```

### "Product shows wrong discount"

```
Discount is auto-calculated:
discount = ((mrp - price) / mrp) * 100

If wrong:
1. Check mrp and price values
2. Verify math manually
3. Update product via admin API
```

### "Colors/sizes not showing"

```
Check product has colors array:
{
  colors: [{
    name: "Black",
    value: "black",
    hex: "#1a1a1a",
    images: ["url1", "url2"]
  }],
  sizes: [{
    size: "M",
    inStock: true
  }]
}

If missing:
- Create product with variants
- Update product with PUT /api/products/:id
```

---

## 🔍 Debugging Tips

### Enable console logging

```javascript
// In api.js, log all API calls:
async function apiCall(endpoint, options = {}) {
  console.log(`[API] ${options.method || "GET"} ${endpoint}`, options.body);

  // ... rest of code

  console.log("[API Response]", response);
}
```

### Use browser DevTools

```javascript
// Open DevTools (F12)
1. Go to Network tab
2. Make API call
3. Check:
   - Status code (200, 400, 401, 500)
   - Request headers (has Authorization?)
   - Response body (error message?)
4. Click on request to see details
```

### Test with Postman

```
Better than curl for debugging:
1. Create request in Postman
2. Set method (GET, POST, etc.)
3. Add headers (Authorization)
4. Set body (JSON)
5. Click Send
6. See full response with formatting
```

### Check MongoDB data

```
MongoDB Atlas:
1. Cluster0 > Browse Collections
2. View documents in each collection
3. Check if data exists and structure is correct
```

---

## ♻️ Clear & Reset

### Clear All Data

```bash
# Delete and reseed database:
npm run seed

# Or manually in MongoDB Atlas:
1. Cluster0 > Collections
2. Select database > Delete Collection
3. Run npm run seed to recreate
```

### Clear Tokens & Auth

```javascript
// In browser DevTools console:
localStorage.clear();
window.location.href = "/";
```

### Reset Everything

```bash
# Full reset:
1. Delete .env file
2. Copy it back from .env.example (if exists)
3. Update values
4. npm install
5. npm run seed
6. npm run dev
```

---

## 📞 Getting Help

### Before asking for help, check:

1. [ ] Verified .env has correct values
2. [ ] MongoDB has data (npm run seed)
3. [ ] Server is running (npm run dev)
4. [ ] Read error message carefully
5. [ ] Checked API_DOCUMENTATION.md
6. [ ] Tested with curl or Postman

### Information to provide:

1. Exact error message
2. Your request (method, URL, body)
3. Server logs output
4. MongoDB data (screenshot from Atlas)
5. Browser console errors (F12)

---

## 🎯 Step-by-Step Verification Checklist

Use this to verify everything works:

### 1. Server Setup

- [ ] npm install completes without errors
- [ ] .env file exists with all values
- [ ] npm run dev starts server successfully
- [ ] Console shows "MongoDB Connected"
- [ ] Server runs on http://localhost:5000

### 2. Database

- [ ] npm run seed completes successfully
- [ ] Data appears in MongoDB Atlas
- [ ] Both users created (admin, regular)
- [ ] Products, categories, coupons seeded

### 3. API Endpoints

- [ ] GET /api/products returns products
- [ ] POST /api/auth/login returns token
- [ ] GET /api/cart requires authentication
- [ ] POST /api/cart/add works with token
- [ ] POST /api/orders/create works with items

### 4. Frontend Integration

- [ ] API base URL is correct
- [ ] Token stored in localStorage after login
- [ ] Authorization header has "Bearer" format
- [ ] Cart displays items from API
- [ ] Order can be created and saved

### 5. End-to-End

- [ ] Login successful
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can create order
- [ ] Order shows in database

---

## 🆘 Last Resort

If everything fails:

1. **Verify connectivity:**

   ```bash
   ping cluster0.xaecowa.mongodb.net
   curl http://localhost:5000/api/products
   ```

2. **Check all basics:**

   ```bash
   npm --version        # Should be 6+
   node --version       # Should be 12+
   npm list             # Check all packages installed
   echo %MONGODB_URL%   # Verify env var
   ```

3. **Nuclear reset:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   # In another terminal:
   npm run seed
   ```

4. **Contact support with:**
   - Full error message
   - npm list output
   - npm run dev terminal log
   - MongoDB connection string (safe way)
   - What you've already tried

---

## ✅ When Everything Works

You should see:

1. ✅ MongoDB Connected message
2. ✅ Server running on http://localhost:5000
3. ✅ GET /api/products returns array
4. ✅ Login returns token
5. ✅ Protected routes work with token
6. ✅ Data persists in MongoDB

---

## 💡 Performance Tips

### If server is slow:

1. Check MongoDB Atlas connection
2. Add indexes to frequently queried fields
3. Use pagination in list endpoints
4. Cache static data on client

### If database is slow:

1. Check network connection
2. Verify MongoDB is running
3. Check query complexity
4. Use MongoDB indexes

### If API is slow:

1. Check payload size
2. Use compression middleware
3. Optimize database queries
4. Add response caching

---

Happy debugging! Remember: **read the error messages carefully** — they usually tell you exactly what's wrong! 🚀
