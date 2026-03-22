# Soulvard E-Commerce - Implementation Roadmap & Priority Plan

## URGENCY MATRIX

```
        HIGH IMPACT
            ↑
            │
  CRITICAL │  FIXES 1,2,3,4,5,6,7
    (3h)   │  - XSS Prevention
            │  - Input Validation
            │  - Race Conditions
            │  - CSRF Protection
            │
 MAJOR     │  FIXES 8,9,10,11,12
  (8h)     │  - Checkout Flow
            │  - Error Handling
            │  - Email Validation
            │
 MINOR     │  FIXES 13+
  (16h)    │  - Code Quality
            │  - Documentation
            │  - Accessibility
            │
            └─────────────────────→ TIME EFFORT

TOTAL: 27+ hours of work
TEAM SIZE: 2-3 developers
TIMELINE: 1.5-2 weeks with testing
```

---

## PHASE 1: CRITICAL SECURITY FIXES (DO FIRST - 3-4 HOURS)

### Day 1 - Morning (2 hours)

#### Task 1.1: Remove User Role from localStorage ⚠️

**File:** `client/scripts/api.js`
**Priority:** 🔴 CRITICAL
**Impact:** Prevents privilege escalation attacks
**Time:** 30 minutes

**Checklist:**

- [ ] Update `setCurrentUser()` to exclude role
- [ ] Update `isAdmin()` to call backend API
- [ ] Update `requireAdmin()` to fetch fresh role
- [ ] Test: Try to modify localStorage role and verify access denied

**Test Cases:**

```javascript
// Test 1: User can't self-promote
localStorage.setItem(
  "currentUser",
  JSON.stringify({
    id: "123",
    role: "admin",
  }),
);
// Admin features should not work

// Test 2: Fresh page load fetches correct role
// Logout, login as admin, verify access
```

---

#### Task 1.2: Add Phone & Pincode Validation ✅

**File:** `client/scripts/cart.js`
**Priority:** 🔴 CRITICAL
**Impact:** Prevents invalid addresses from reaching backend
**Time:** 30 minutes

**Checklist:**

- [ ] Add 3 validator functions (email, phone, pincode)
- [ ] Update `saveDeliveryInfo()` with validation
- [ ] Test: Try invalid phone (5 digits) - should fail
- [ ] Test: Try valid Indian pincode (400001) - should pass
- [ ] Test: Try international format - should fail

**Test Cases:**

```javascript
// Invalid phones
validatePhone("123"); // false
validatePhone("123456789"); // false (< 10)
validatePhone("+91 98765 43210"); // true
validatePhone("+1 555-123-4567"); // true

// Valid Indian pincodes
validatePincode("400001"); // true (5 digits)
validatePincode("110001"); // true
validatePincode("40000"); // false (4 digits)
```

---

#### Task 1.3: Remove Client-Side Coupon Logic 🔐

**File:** `client/scripts/cart.js`
**Priority:** 🔴 CRITICAL  
**Impact:** Prevents coupon discount manipulation
**Time:** 45 minutes

**Checklist:**

- [ ] Remove `validateCoupon()` function (Lines 124-140)
- [ ] Remove `calculateDiscount()` function (Lines 147-158)
- [ ] Update `processCouponApplication()` to use API only
- [ ] Update `updateOrderSummary()` to use backend discount value
- [ ] Test: Modify browser console coupon - should not work
- [ ] Test: Coupon backend validation on checkout

**Test Cases:**

```javascript
// Attacker tries to modify discount
// Before: They could change discount percentage in code
// After: Discount only comes from backend API
```

---

### Day 1 - Afternoon (2 hours)

#### Task 1.4: Fix Cart Race Condition 🔄

**File:** `client/scripts/cart.js`
**Priority:** 🔴 CRITICAL
**Impact:** Prevents cart data corruption
**Time:** 60 minutes

**Checklist:**

- [ ] Add `inFlightOperations` Set to track pending ops
- [ ] Update `updateQuantity()` with operation queueing
- [ ] Add `disableQuantityButtons()` helper function
- [ ] Update `removeItem()` with same pattern
- [ ] Add rollback logic on API failure
- [ ] Test: Click +1 and -1 rapidly - quantity should be consistent
- [ ] Test: Close tab during update - verify rollback on reload

**Test Scenario:**

```javascript
// Scenario: Rapid quantity changes
1. Cart has 1 item with qty 1
2. User clicks +1 (pending...)
3. User immediately clicks +1 (should queue or reject)
4. First request completes (qty = 2)
5. Second request processes (qty = 3)
// Final qty should be 3, not corrupted
```

---

#### Task 1.5: Add ObjectId Validation 🛡️

**File:** `client/scripts/api.js`
**Priority:** 🔴 CRITICAL
**Impact:** Prevents NoSQL injection
**Time:** 30 minutes

**Checklist:**

- [ ] Add `isValidObjectId()` function
- [ ] Update `productsAPI.getById()` to validate
- [ ] Update `productsAPI.update()` to validate
- [ ] Update `productsAPI.delete()` to validate
- [ ] Update `loadProductData()` in product_cart.js
- [ ] Test: Try invalid ObjectId in URL - should show error
- [ ] Test: Try Object ObjectId URL parameter - should fail

**Test Cases:**

```javascript
// Valid ObjectId (24 hex chars)
isValidObjectId("507f1f77bcf86cd799439011") // true

// Invalid ObjectIds
isValidObjectId("invalid-id") // false
isValidObjectId("507f1f77bcf86cd79943901") // false (23 chars)
isValidObjectId(""; db.products.drop(); //") // false
```

---

### Day 2 - Morning (2 hours)

#### Task 1.6: Implement CSRF Protection 🔒

**File:** Backend + `client/scripts/api.js`
**Priority:** 🔴 CRITICAL
**Impact:** Prevents cross-site request forgery
**Time:** 90 minutes

**Backend Changes:**

- [ ] Create `backend/middleware/csrf.js`
- [ ] Add CSRF middleware to `backend/server.js`
- [ ] Create `/api/csrf-token` endpoint
- [ ] Add session support to Express

**Frontend Changes:**

- [ ] Add `getCSRFToken()` function to api.js
- [ ] Add `initializeCSRFToken()` on DOMContentLoaded
- [ ] Update `apiCall()` to include X-CSRF-Token header
- [ ] Test: Make cross-origin POST request - should fail
- [ ] Test: Include CSRF token - should succeed

**Test Cases:**

```javascript
// Form attack from attacker.com
// POST to soulvard.com/api/orders/create
// Without token: 403 CSRF token validation failed
// With token: Success (if valid user session)
```

---

#### Task 1.7: Implement Token Refresh 🔑

**File:** Backend + `client/scripts/api.js`
**Priority:** 🔴 CRITICAL
**Impact:** Handles token expiration gracefully
**Time:** 60 minutes

**Backend Changes:**

- [ ] Update `backend/middleware/auth.js` generateToken
- [ ] Add `generateRefreshToken()` function
- [ ] Create `/api/auth/refresh` endpoint
- [ ] Return both tokens on login

**Frontend Changes:**

- [ ] Add `refreshAccessToken()` function
- [ ] Add exponential backoff retry in `apiCall()`
- [ ] Handle 401 responses with token refresh
- [ ] Test: Let token expire (1h) - app should auto-refresh
- [ ] Test: Both tokens expired - force login

**Test Cases:**

```javascript
// Simulate token expiration
1. Login successfully (get access + refresh token)
2. Wait for access token to expire (or mock expiry)
3. Make API call - should auto-refresh and retry
4. Verify: Response succeeds without user intervention
```

---

## PHASE 2: MAJOR ISSUES (DO NEXT - 6-8 HOURS)

### Day 2 - Afternoon + Day 3 - Morning

#### Task 2.1: Create Checkout Page ✏️

**Files:** Create `client/checkout.html` + `client/scripts/checkout.js`
**Priority:** 🟠 MAJOR
**Impact:** Completes purchase flow
**Time:** 120 minutes

**Checklist:**

- [ ] Create checkout.html with form sections
- [ ] Add order summary from cart
- [ ] Add delivery address form (with validation)
- [ ] Add billing address option (same/different)
- [ ] Add payment method selector
- [ ] Create checkout.js with form handling
- [ ] Integrate with ordersAPI.create()
- [ ] Test: Complete checkout flow end-to-end
- [ ] Test: Validation catches missing fields

**Sections Needed:**

```
1. Order Summary
   - Cart items
   - Subtotal, discount, tax, total
   - Applied coupon

2. Delivery Address
   - Name, email, phone, address
   - City, state, pincode
   - Validation feedback

3. Billing Address
   - Radio: Same as delivery / Different
   - If different: Show full form

4. Payment Method
   - Payment gateway selection
   - (Placeholder for Razorpay/Stripe integration)

5. Order Confirmation
   - Order ID
   - Estimated delivery
   - Tracking link (when available)
```

---

#### Task 2.2: Create Order API Endpoints 🚀

**File:** `backend/routes/orders.js`
**Priority:** 🟠 MAJOR
**Impact:** Enables order creation
**Time:** 90 minutes

**Endpoints Needed:**

- [ ] `POST /orders/create` - Create new order
  - Validate all items in stock
  - Validate coupon (if provided)
  - Save order and clear cart
  - Return order confirmation

- [ ] `GET /orders/my-orders` - Get user's orders
  - Paginate results
  - Sort by date

- [ ] `GET /orders/:orderId` - Get order details
  - Include items and shipping info
  - Payment status

- [ ] `PUT /orders/:orderId/status` - Admin update status
  - Validate admin role
  - Update status (pending → processing → shipped → delivered)

**Validation Needed:**

- [ ] All items exist and in stock
- [ ] Coupon is valid (not expired, right min amount)
- [ ] Delivery address has all required fields
- [ ] Quantities are Valid (1-10)

---

#### Task 2.3: Fix Email Validation Consistency 📧

**Files:** `client/scripts/api.js`, all client files, `backend/utils/validators.js`
**Priority:** 🟠 MAJOR
**Impact:** Prevents invalid emails in system
**Time:** 45 minutes

**Changes:**

- [ ] Create `validators.js` in client/scripts/
- [ ] Copy validators from backend
- [ ] Use consistently across all files
- [ ] Update tests

**Regex Pattern:**

```javascript
// CORRECT (RFC 5322 compliant)
/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

// NOT JUST
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

---

#### Task 2.4: Comprehensive Error Handling 🛑

**All JavaScript files**
**Priority:** 🟠 MAJOR
**Impact:** Better user experience on failures
**Time:** 90 minutes

**Pattern to Implement:**

```javascript
// For every async operation:
try {
  const result = await apiCall(...);
  if (!result.success) {
    // User-friendly error message
    showError(result.message);
    // Log for monitoring
    console.error("Operation failed:", result);
    return null;
  }
  return result;
} catch (error) {
  // Network/parsing errors
  showError("Failed to " + operationName + ". Please try again.");
  console.error("Network error:", error);
  // Show retry button?
  return null;
}
```

**Files to Update:**

- [ ] `client/scripts/api.js`
- [ ] `client/scripts/auth.js`
- [ ] `client/scripts/cart.js`
- [ ] `client/scripts/product_cart.js`
- [ ] `client/scripts/collection.js`
- [ ] `client/scripts/index.js`
- [ ] `client/scripts/whishlist.js`

---

## PHASE 3: MINOR ISSUES (NEXT SPRINT - 8-10 HOURS)

### Day 3 - Afternoon + Day 4

#### Task 3.1: Add TypeScript Types 📝

**All JavaScript files**
**Priority:** 🟡 MINOR
**Impact:** Prevents type-related bugs
**Effort:** 8+ hours (or add JSDoc for quick fix)

**Quick Fix (JSDoc without TypeScript):**

```javascript
/**
 * Add product to cart
 * @param {string} productId - MongoDB ObjectId of product
 * @param {number} quantity - Quantity (1-10)
 * @param {string} size - Size (S, M, L, XL, etc)
 * @param {string} color - Color value (hex code or name)
 * @returns {Promise<{success: boolean, data: Array<CartItem>}>}
 * @throws {Error} If product not found or validation fails
 */
cartAPI.add = async (productId, quantity, size, color) => {
  // ...
};
```

---

#### Task 3.2: Fix Code Quality Issues 🧹

**Priority:** 🟡 MINOR
**Impact:** Maintainability
**Time:** 120 minutes

**Issues to Fix:**

- [ ] Rename `whishlist.js` to `wishlist.js`
- [ ] Consolidate notification functions (showSuccess, showError, showNotification, showToast)
- [ ] Extract magic numbers to constants
- [ ] Remove dead code (saveForLater, unused functions)
- [ ] Add JSDoc comments to all public functions
- [ ] Fix inconsistent naming (currentUser vs user)

**Example:**

```javascript
// BEFORE (magic numbers)
const shipping = subtotal > 5000 ? 0 : 499;

// AFTER (with constants)
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_COST = 499;
const shipping =
  subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
```

---

#### Task 3.3: Add Accessibility Features ♿

**All HTML/JS files**
**Priority:** 🟡 MINOR
**Impact:** Screen reader support
**Time:** 90 minutes

**Changes Needed:**

```javascript
// Add to dynamically created elements
notification.setAttribute("role", "alert");
notification.setAttribute("aria-live", "polite");
notification.setAttribute("aria-atomic", "true");

// Add to buttons
button.setAttribute("aria-label", "Add to cart");
button.setAttribute("aria-busy", "true"); // during loading

// Add to modals
modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.setAttribute("aria-labelledby", "modalTitle");
```

---

#### Task 3.4: Add Unit Tests ✅

**Priority:** 🟡 MINOR
**Impact:** Regression prevention
**Time:** 120 minutes

**Test Files to Create:**

- [ ] `tests/validators.test.js` - Test input validators
- [ ] `tests/api.test.js` - Test API functions
- [ ] `tests/cart.test.js` - Test cart operations
- [ ] `tests/auth.test.js` - Test auth flow

**Test Framework:** Jest or Vitest

**Example Test:**

```javascript
// tests/validators.test.js
describe("Validators", () => {
  describe("validatePhone", () => {
    it("should validate Indian phone numbers", () => {
      expect(validatePhone("+91 98765 43210")).toBe(true);
    });

    it("should reject short numbers", () => {
      expect(validatePhone("123")).toBe(false);
    });

    it("should accept international formats", () => {
      expect(validatePhone("+1 555-123-4567")).toBe(true);
    });
  });
});
```

---

## TIMELINE CHART

```
Week 1:
┌─────────────────────────────────────┐
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri     │
├─────────────────────────────────────┤
│ 1.1  │ 1.4  │ 1.6  │ 2.1  │ 2.2    │
│ 1.2  │ 1.5  │ 1.7  │ 2.3  │ 2.4    │
│ 1.3  │      │      │      │        │
└─────────────────────────────────────┘
Phase 1: CRITICAL (14-16 hours actual work)

Week 2:
┌─────────────────────────────────────┐
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri     │
├─────────────────────────────────────┤
│ Test │ 3.1  │ 3.2  │ 3.3  │ 3.4    │
│ Debug│ JSDoc│ Code │ A11y │ Tests  │
│      │      │ Quality│   │ Coverage│
└─────────────────────────────────────┘
Phase 2 & 3: MAJOR + MINOR
```

---

## TEAM ASSIGNMENT (Recommended)

**Developer 1 - Backend & Security (50%)**

- Task 1.6 (CSRF) - Backend part
- Task 1.7 (Token Refresh) - Backend part
- Task 2.2 (Order API)
- Task 2.4 (Error Handling) - Backend routes

**Developer 2 - Frontend & Fixes (50%)**

- Task 1.1-1.5 (Frontend critical fixes)
- Task 1.6-1.7 (CSRF/Token) - Frontend part
- Task 2.1 (Checkout page)
- Task 2.3 (Email validation)

**Both Developers - Testing & QA (20%)**

- Code review
- Integration testing
- Performance testing

---

## TESTING STRATEGY

### Unit Testing

```javascript
// test/validators.test.js
Validators: Email, Phone, Pincode, ObjectId
Expected: 100+ test cases

// test/api.test.js
API functions with mocked responses
Expected: 50+ test cases
```

### Integration Testing

```javascript
// End-to-end flows:
1. User Registration → Login → Add to Cart → Checkout
2. Admin: Login → Add Product → View Orders
3. Coupon: Apply → Validation → Checkout
```

### Security Testing

```
1. XSS: Try <script> in input fields - should be escaped
2. CSRF: POST from external domain - should fail
3. SQLi/NoSQLi: Try injection in ObjectId - should fail
4. Auth: Modify localStorage role - should not grant access
5. Race: Rapid cart ops - should maintain consistency
```

### Performance Testing

```
1. Load time < 3 seconds (with throttling)
2. Cart ops < 500ms
3. Can handle 100 concurrent users
```

---

## DEPLOYMENT CHECKLIST

**Before Going to Production:**

- [ ] All critical fixes implemented
- [ ] All tests passing (80%+ coverage)
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Error handling tested
- [ ] Backup plan created
- [ ] Rollback procedure documented
- [ ] User communication prepared
- [ ] Analytics/monitoring set up
- [ ] Database migrations tested

---

## POST-LAUNCH MONITORING

**First 24 Hours:**

- Monitor error logs
- Check transaction success rate
- Monitor server performance
- User feedback channels active

**First Week:**

- Weekly security scan
- Monitor for new vulnerabilities
- User behavior analysis
- Performance metrics

**Ongoing:**

- Monthly security updates
- Quarterly dependency updates
- Annual penetration testing
- Continuous monitoring

---

## SUCCESS CRITERIA

✅ **Launch Ready When:**

1. **Security:**
   - [ ] Zero CRITICAL findings
   - [ ] CSRF protection implemented
   - [ ] XSS vulnerabilities fixed
   - [ ] Token refresh working

2. **Functionality:**
   - [ ] Checkout flow complete
   - [ ] All validations passing
   - [ ] Cart operations reliable
   - [ ] Error handling robust

3. **Quality:**
   - [ ] 80%+ test coverage
   - [ ] 0 console errors
   - [ ] Response time < 500ms
   - [ ] Zero form rejections

4. **Accessibility:**
   - [ ] WCAG 2.1 AA compliant
   - [ ] Screen reader compatible
   - [ ] Keyboard navigable

---

## ESTIMATED COSTS & ROI

**Development Time:** 27-35 hours  
**Developer Cost:** ₹3,000/hour (India rates)  
**Total Cost:** ~₹81,000 - ₹105,000

**Risk If Not Fixed:**

- Data breach: ₹10+ lakhs
- Chargeback losses: 2-3% of revenue
- Customer churn: 5-10%

**ROI:** Infinite (loss prevention)
