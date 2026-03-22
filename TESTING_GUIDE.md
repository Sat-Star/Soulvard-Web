# 🚀 Frontend API Integration - Testing Guide

## ✅ What's Been Done

1. **Created `api.js`** - Complete API wrapper with all endpoints
2. **Created `auth.js`** - Authentication and token management
3. **Updated all HTML files** - Added api.js and auth.js script tags
4. **Updated `collection.js`** - Now loads products from API instead of hardcoded data
5. **Admin panel** - Updated to include API scripts

## 🧪 Quick Testing (5 Minutes)

### Step 1: Make Sure Backend is Running

```bash
npm run dev
```

Should see:

```
MongoDB Connected
Server running on http://localhost:5000
```

### Step 2: Open Website

Go to: http://localhost:5000

You should see the homepage load.

### Step 3: Test Collection Page

1. Open http://localhost:5000/collection.html
2. Wait 2-3 seconds for products to load from API
3. If successful: Products appear from your database ✅
4. If failed: Error message appears, check browser console

### Step 4: Test Product Details

1. Click on any product
2. Should navigate to `/product_cart.html?id=PRODUCT_ID`
3. Product details should load from API

### Step 5: Test Login

1. Click "LOGIN" button in navigation
2. Enter credentials:
   - Email: `user@soulvard.com`
   - Password: `user123`
3. You should see user name in header ✅

### Step 6: Add to Cart

1. After logging in, go to a product
2. Select size and color
3. Click "Add to Cart"
4. Should appear in your cart (at /cart.html)

---

## ⚡ Browser DevTools Debugging

### Check Console for Errors

1. Press `F12` to open DevTools
2. Click **Console** tab
3. Look for red error messages

### Common Console Messages

**✅ Good:**

```
API Response: {success: true, data: [...]}
Cart updated successfully
10 products loaded
```

**❌ Bad:**

```
API Error: Cannot connect to http://localhost:5000
Cannot read property '_id' of undefined
CORS error
```

### Check Network Requests

1. Open DevTools → **Network** tab
2. Reload page
3. Look for API calls (should start with `/api/`)
4. Click on a request to see response data

---

## 🔧 Testing Specific Features

### Test Products Loading

**In Browser Console:**

```javascript
// Manually call API to test
productsAPI.getAll().then((r) => console.log(r));
```

Should return: `{success: true, data: [products array]}`

### Test Authentication

**In Browser Console:**

```javascript
// Test login
authAPI.login("user@soulvard.com", "user123").then((r) => {
  console.log("Login success:", r);
  console.log("Token stored:", getAuthToken());
  console.log("User:", getCurrentUser());
});
```

### Test Cart Operations

**In Browser Console:**

```javascript
// Get cart
cartAPI.get().then((r) => console.log("Cart:", r));

// Add to cart (replace PRODUCT_ID with real ID)
cartAPI.add("PRODUCT_ID", 1, "M", "Black").then((r) => console.log(r));
```

### Test Coupons

**In Browser Console:**

```javascript
// Validate coupon
couponsAPI.validate("WELCOME", 10000).then((r) => console.log(r));
```

---

## 📊 What to Test

| Feature         | How to Test              | Expected Result                    |
| --------------- | ------------------------ | ---------------------------------- |
| Products Load   | Visit `/collection.html` | Products appear from database      |
| Product Details | Click a product          | Product page loads with API data   |
| Category Filter | Click category tab       | Products filter by category        |
| Sort            | Change sort dropdown     | Products re-order                  |
| Login           | Click LOGIN button       | Modal appears, can log in          |
| Add to Cart     | Login + Add to Cart      | Item appears in cart               |
| Cart Total      | Add multiple items       | Subtotal, tax, shipping calculated |
| Wishlist        | Click heart icon         | Item added (requires login)        |
| Coupon          | Enter WELCOME            | Discount applied (₹0 min)          |
| Checkout        | Click checkout           | Order creation flow                |

---

## 🐛 Troubleshooting

### Problem: Products Don't Load

**Symptoms:**

- Collection.html shows empty grid
- Console shows: "Cannot read property '\_id' of undefined"

**Solution:**

```bash
# 1. Check backend is running
npm run dev

# 2. Check database was seeded
npm run seed

# 3. Verify products exist
curl http://localhost:5000/api/products

# 4. Check browser console for detailed error
# Press F12 → Console → Look for red errors
```

### Problem: Login Not Working

**Solutions:**

- Check email/password are correct (user@soulvard.com / user123)
- Check backend is running
- Check browser console for error messages
- Try incognito mode (clear site data)

### Problem: Cart Not Saving

**Solutions:**

- Make sure you're logged in first
- Check token is stored: In console: `getAuthToken()`
- Ensure backend cart endpoints work:
  ```bash
  curl http://localhost:5000/api/cart \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```

### Problem: Images Don't Load

**Due to:** API images are from Unsplash (external URLs)

**Solution:**

- Check internet connection
- Images load from their original URLs
- In production, would upload to Cloudinary

---

## 📈 Progress Checklist

- [ ] Backend server running (`npm run dev`)
- [ ] Database seeded (`npm run seed`)
- [ ] Collection page loads products
- [ ] Can click product to view details
- [ ] Login works with test account
- [ ] Can add item to cart
- [ ] Cart shows correct totals
- [ ] Can apply coupon code
- [ ] Can proceed to checkout
- [ ] Wishlist works (when logged in)

---

## 🎯 Next Steps

Once everything above works:

1. **Update Remaining Pages**
   - Matching_Product.js (same as collection.js)
   - Wishlist.js (use wishlist API)
   - Product details page (use product API)
   - Index page (use featured products API)

2. **Add Order Confirmation Page**
   - Create `order-confirmation.html`
   - Show order details from API
   - Link from checkout

3. **Update Admin Panel**
   - Update admin.js to use API for CRUD
   - Product management
   - Order management
   - Category management

4. **Style Login Modal**
   - Create modal HTML in your pages
   - Style to match your design
   - Test login/signup flows

5. **Test Full User Journey**
   - Login
   - Browse products
   - Add to cart
   - Apply coupon
   - Checkout
   - View order

---

## 💡 Tips

- **Check Console Regularly** - Most issues show up as error messages
- **Use Network Tab** - See actual API responses
- **Test with Real Data** - Use the 6 seeded products
- **Check Token** - `getAuthToken()` in console for debugging
- **Watch Loading** - Products take 1-2 seconds to load from API

---

## ✨ Success Indicators

When everything is working:

1. ✅ Products load from database (not hardcoded)
2. ✅ Login persists across page refreshes
3. ✅ Cart updates when adding items
4. ✅ Totals calculate correctly with tax/shipping
5. ✅ Orders save to database
6. ✅ Can apply coupon codes
7. ✅ Can manage wishlist
8. ✅ Admin can manage products

---

## 🎉 Ready to Go!

Your frontend is now connected to a real API backend. Start testing and let me know if you hit any issues!

**Questions?** Check:

1. Browser console for error messages
2. Network tab for API responses
3. Terminal for backend logs
4. API_DOCUMENTATION.md for endpoint details

Happy testing! 🚀
