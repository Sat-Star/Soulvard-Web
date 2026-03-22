// ==================== VALIDATORS ====================

// Validate email format
function validateEmail(email) {
  const emailRegex = /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email.trim());
}

// Validate phone number (10-12 digits international format)
function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 12;
}

// Validate pincode (5-6 digits for India standard)
function validatePincode(pincode) {
  const pincodeRegex = /^\d{5,6}$/;
  return pincodeRegex.test(pincode.trim());
}

// Validate delivery info - returns {valid: boolean, error: string}
function validateDeliveryInfo(info) {
  if (!info.name || info.name.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  if (!validateEmail(info.email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  if (!validatePhone(info.phone)) {
    return {
      valid: false,
      error: "Please enter a valid phone number (10-12 digits)",
    };
  }
  if (!info.address || info.address.length < 5) {
    return { valid: false, error: "Address must be at least 5 characters" };
  }
  if (!validatePincode(info.pincode)) {
    return { valid: false, error: "Please enter a valid pincode (5-6 digits)" };
  }
  if (!info.city || info.city.length < 2) {
    return { valid: false, error: "City must be at least 2 characters" };
  }
  if (!info.state || info.state.length < 2) {
    return { valid: false, error: "State must be at least 2 characters" };
  }
  return { valid: true, error: null };
}

// ==================== CART RACE CONDITION PREVENTION ====================

// Lock for cart operations to prevent race conditions
let isCartOperationInProgress = false;

// Execute cart operation with locking
async function executeCartOperationWithLock(operation) {
  // Wait if another operation is in progress
  while (isCartOperationInProgress) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Acquire lock
  isCartOperationInProgress = true;

  try {
    const result = await operation();
    return result;
  } finally {
    // Release lock
    isCartOperationInProgress = false;
  }
}

// Cart Data - will be loaded from API
let cartItems = [];

// ==================== LOADING STATE MANAGEMENT ====================

let isAppLoading = false;

// Show loading spinner
function showLoadingSpinner(containerId = "cartItems") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 2rem;">
        <div style="width:28px;height:28px;border:3px solid #ddd;border-top-color:#111;border-radius:50%;animation:soulvardSpin .8s linear infinite;"></div>
        <span style="font-size: 14px;">Loading your cart...</span>
      </div>
    `;
    if (!document.getElementById("soulvardSpinStyle")) {
      const style = document.createElement("style");
      style.id = "soulvardSpinStyle";
      style.textContent =
        "@keyframes soulvardSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }
  }
}

// Hide loading spinner
function hideLoadingSpinner() {
  isAppLoading = false;
}

// ==================== DATA NORMALIZATION ====================

// Normalize cart items - ensure prices are numbers, not strings
function normalizeCartItems(items) {
  return items.map((item) => ({
    ...item,
    price: Number(item.price) || 0,
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    quantity: Number(item.quantity) || 1,
  }));
}

// Initialize cart from API
async function initializeCartFromAPI() {
  try {
    const user = getCurrentUser();
    if (!user) {
      // Not logged in - show empty cart
      cartItems = [];
      return;
    }

    const response = await cartAPI.get();
    if (response.success && response.data) {
      // Normalize prices to prevent NaN errors
      cartItems = normalizeCartItems(response.data.items || []);
      console.log("Cart loaded from API:", cartItems);
    } else {
      cartItems = [];
    }
  } catch (error) {
    console.error("Error loading cart from API:", error);
    // Fallback to empty cart on error
    cartItems = [];
  }
}

// Delivery Information Storage (starts empty)
let deliveryInfo = {
  name: "",
  phone: "",
  email: "",
  address: "",
  pincode: "",
  city: "",
  state: "",
};

// Initialize cart
async function initializeCart() {
  isAppLoading = true;

  // Show loading state immediately
  showLoadingSpinner("cartItems");
  document.getElementById("itemCount").textContent = "...";
  document.getElementById("summaryItemCount").textContent = "... ITEMS";

  try {
    await initializeCartFromAPI();
    renderCartItems();
    updateDeliveryDisplay();
    updateDeliveryDisplayMobile();
    updateCartCount();
    updateOrderSummary();
    updateMobileShippingNote();
  } catch (error) {
    console.error("Error initializing cart:", error);
    document.getElementById("cartItems").innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="color: #ff0000;">Error loading cart. Please refresh the page.</p>
      </div>
    `;
  } finally {
    hideLoadingSpinner();
  }
}

// Render cart items with improved UI
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const itemCount = document.getElementById("itemCount");
  const summaryItemCount = document.getElementById("summaryItemCount");

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h3 class="empty-title">Your cart is empty</h3>
                        <p class="empty-text">Browse our premium collection to find timeless pieces that elevate your style</p>
                        <button class="continue-btn" onclick="window.location.href='collection.html'">BROWSE COLLECTION</button>
                    </div>
                `;
    itemCount.textContent = "0";
    summaryItemCount.textContent = "0 ITEMS";
    document.getElementById("checkoutBtn").disabled = true;
    return;
  }

  itemCount.textContent = cartItems.length;
  summaryItemCount.textContent = `${cartItems.length} ITEMS`;
  document.getElementById("checkoutBtn").disabled = false;

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
                <div class="cart-item" data-id="${item._id || item.id}">
                    <div class="item-image" style="background-image: url('${item.image || item.productImage || ""}')">
                        ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ""}
                    </div>
                    <div class="item-details">
                        <h3 class="item-title">${item.name || item.productName || "Product"}</h3>
                        <p class="item-meta">Size: ${item.size} • Color: ${item.color}</p>
                        ${item.code ? `<p class="item-meta">Product Code: ${item.code}</p>` : ""}
                        ${
                          item.available !== undefined
                            ? item.available
                              ? `<div class="item-availability">
                                    <span class="availability-dot"></span>
                                    <span>In Stock • Ready to Ship</span>
                                </div>`
                              : `<div class="item-availability" style="color: var(--error);">
                                    <span class="availability-dot" style="background: var(--error);"></span>
                                    <span>Out of Stock</span>
                                </div>`
                            : `<div class="item-availability">
                                <span class="availability-dot"></span>
                                <span>Ready to Ship</span>
                            </div>`
                        }
                    </div>
                    <div class="item-controls-container">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateQuantity('${item._id || item.id}', -1)">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item._id || item.id}', 1)">+</button>
                        </div>
                        <div class="item-price-section">
                            <div class="price-row">
                                <span class="current-price">₹${formatCurrency((item.price || 0) * item.quantity)}</span>
                                ${
                                  (item.originalPrice || 0) > (item.price || 0)
                                    ? `<span class="original-price">₹${formatCurrency((item.originalPrice || 0) * item.quantity)}</span>`
                                    : ""
                                }
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeItem('${item._id || item.id}')">
                            <i class="fas fa-trash-alt"></i> REMOVE
                        </button>
                    </div>
                </div>
            `,
    )
    .join("");
}

// Update quantity with race condition prevention
function updateQuantity(itemId, change) {
  const item = cartItems.find(
    (item) => item._id === itemId || item.id === itemId,
  );
  if (!item) return;

  const newQuantity = item.quantity + change;
  if (newQuantity < 1) {
    removeItem(itemId);
    return;
  }
  if (newQuantity > 10) {
    showToast("Maximum quantity is 10", "error");
    return;
  }

  // Disable quantity buttons during operation
  const quantityControls = document.querySelectorAll(".quantity-control");
  const relevantControl = Array.from(quantityControls).find((control) => {
    return control.innerHTML.includes(`updateQuantity('${itemId}'`);
  });

  if (relevantControl) {
    const buttons = relevantControl.querySelectorAll(".qty-btn");
    buttons.forEach((btn) => (btn.disabled = true));
  }

  // Execute with lock to prevent race conditions
  executeCartOperationWithLock(async () => {
    // Call API to update quantity
    const cartItemId = item._id || item.id;
    try {
      const response = await cartAPI.update(cartItemId, newQuantity);
      if (response.success) {
        item.quantity = newQuantity;
        renderCartItems();
        updateOrderSummary();
        updateMobileShippingNote();
        showToast("Quantity updated", "success");
      } else {
        showToast("Failed to update quantity", "error");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showToast("Error updating quantity: " + error.message, "error");
    }
  });
}

// Remove item from cart with race condition prevention
function removeItem(itemId) {
  const item = cartItems.find(
    (item) => item._id === itemId || item.id === itemId,
  );
  if (!item) return;

  // Find and disable the remove button
  const removeBtn = document.querySelector(
    `button[onclick="removeItem('${itemId}')"]`,
  );
  if (removeBtn) {
    removeBtn.disabled = true;
    removeBtn.textContent = "Removing...";
  }

  // Execute with lock to prevent race conditions
  executeCartOperationWithLock(async () => {
    // Call API to remove item
    const cartItemId = item._id || item.id;
    try {
      const response = await cartAPI.remove(cartItemId);
      if (response.success) {
        cartItems = cartItems.filter(
          (item) => item._id !== itemId && item.id !== itemId,
        );
        renderCartItems();
        updateOrderSummary();
        updateCartCount();
        updateMobileShippingNote();
        showToast("Item removed from cart", "success");
      } else {
        showToast("Failed to remove item", "error");
        if (removeBtn) {
          removeBtn.disabled = false;
          removeBtn.textContent = "REMOVE";
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Error removing item: " + error.message, "error");
      if (removeBtn) {
        removeBtn.disabled = false;
        removeBtn.textContent = "REMOVE";
      }
    }
  });
}

// Save for later
function saveForLater() {
  if (cartItems.length === 0) {
    showToast("Your cart is empty", "error");
    return;
  }
  showToast("Items saved for later", "success");
}

// Clear cart
function clearCart() {
  if (cartItems.length === 0) {
    showToast("Your cart is already empty", "error");
    return;
  }

  if (confirm("Are you sure you want to clear your cart?")) {
    cartItems = [];
    renderCartItems();
    updateOrderSummary();
    updateCartCount();
    updateMobileShippingNote();
    localStorage.removeItem("appliedCoupon");
    document.getElementById("couponMessage").style.display = "none";
    document.getElementById("couponMessageMobile").style.display = "none";
    document.getElementById("couponCode").value = "";
    document.getElementById("couponCodeMobile").value = "";
    showToast("Cart cleared", "success");
  }
}

// Update cart count in navigation
function updateCartCount() {
  const headerCartCount = document.getElementById("headerCartCount");
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (headerCartCount) {
    headerCartCount.textContent = totalItems;
  }
}

// Update order summary
function updateOrderSummary() {
  let subtotal = 0;
  cartItems.forEach((item) => {
    // Ensure prices are numbers to prevent NaN
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    subtotal += price * quantity;
  });

  let discount = 0;
  const appliedCoupon = localStorage.getItem("appliedCoupon");
  if (appliedCoupon) {
    discount = calculateDiscount(subtotal, appliedCoupon);
  }

  const shipping = subtotal > 5000 ? 0 : 499;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  document.getElementById("subtotal").textContent =
    "₹" + formatCurrency(subtotal);
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : "₹" + formatCurrency(shipping);
  document.getElementById("tax").textContent = "₹" + formatCurrency(tax);

  const discountRow = document.getElementById("discount-row");
  const discountValue = document.getElementById("discount-value");

  if (discount > 0) {
    discountRow.style.display = "flex";
    discountValue.textContent = "−₹" + formatCurrency(discount);
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("total").textContent = "₹" + formatCurrency(total);
}

// Update mobile shipping note visibility
function updateMobileShippingNote() {
  const subtotal = calculateSubtotal();
  const mobileShippingNote = document.querySelector(".shipping-note-mobile");
  if (mobileShippingNote) {
    if (subtotal > 5000) {
      mobileShippingNote.style.display = "flex";
    } else {
      mobileShippingNote.style.display = "none";
    }
  }
}

// Calculate subtotal
function calculateSubtotal() {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatCurrency(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Coupon system - Desktop
function applyCoupon() {
  const couponCode = document
    .getElementById("couponCode")
    .value.trim()
    .toUpperCase();
  const couponMessage = document.getElementById("couponMessage");
  const applyBtn = document.getElementById("applyCouponBtn");

  processCouponApplication(couponCode, couponMessage, applyBtn);
}

// Coupon system - Mobile
function applyCouponMobile() {
  const couponCode = document
    .getElementById("couponCodeMobile")
    .value.trim()
    .toUpperCase();
  const couponMessage = document.getElementById("couponMessageMobile");
  const applyBtn = document.getElementById("applyCouponBtnMobile");

  processCouponApplication(couponCode, couponMessage, applyBtn);
}

// Common coupon processing function
function processCouponApplication(couponCode, couponMessage, applyBtn) {
  // Show loading state
  const originalText = applyBtn.textContent;
  applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  applyBtn.disabled = true;

  if (!couponCode) {
    couponMessage.textContent = "Please enter a coupon code";
    couponMessage.className = "coupon-message error";
    applyBtn.textContent = originalText;
    applyBtn.disabled = false;
    return;
  }

  if (cartItems.length === 0) {
    couponMessage.textContent = "Your cart is empty";
    couponMessage.className = "coupon-message error";
    applyBtn.textContent = originalText;
    applyBtn.disabled = false;
    return;
  }

  // Calculate subtotal
  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  // Call API to validate coupon
  couponsAPI
    .validate({
      code: couponCode,
      subtotal: subtotal,
    })
    .then((response) => {
      if (response.success && response.data.valid) {
        // Save coupon to localStorage
        localStorage.setItem("appliedCoupon", couponCode);

        // Update both desktop and mobile messages
        document.getElementById("couponMessage").textContent =
          response.data.message || "Coupon applied successfully!";
        document.getElementById("couponMessage").className =
          "coupon-message success";
        document.getElementById("couponMessageMobile").textContent =
          response.data.message || "Coupon applied successfully!";
        document.getElementById("couponMessageMobile").className =
          "coupon-message success";

        // Sync coupon code in both inputs
        document.getElementById("couponCode").value = couponCode;
        document.getElementById("couponCodeMobile").value = couponCode;

        // Update order summary
        updateOrderSummary();

        // Show success toast
        showToast("Coupon applied successfully!", "success");
      } else {
        const errorMsg = response.data?.message || "Invalid coupon code";
        couponMessage.textContent = errorMsg;
        couponMessage.className = "coupon-message error";

        // Clear invalid coupon from localStorage
        localStorage.removeItem("appliedCoupon");
        updateOrderSummary();
      }
    })
    .catch((error) => {
      console.error("Error validating coupon:", error);
      couponMessage.textContent = "Error validating coupon: " + error.message;
      couponMessage.className = "coupon-message error";
      localStorage.removeItem("appliedCoupon");
      updateOrderSummary();
    })
    .finally(() => {
      // Restore button
      applyBtn.textContent = originalText;
      applyBtn.disabled = false;
    });
}

function validateCoupon(code, subtotal) {
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

  if (!validCoupons[code]) {
    return {
      valid: false,
      message: "Invalid coupon code. Try SOULVARD10, WELCOME, or SUMMER25",
    };
  }

  const coupon = validCoupons[code];

  if (subtotal < coupon.minAmount) {
    return {
      valid: false,
      message: `Minimum order of ₹${formatCurrency(coupon.minAmount)} required for this coupon`,
    };
  }

  return {
    valid: true,
    message: coupon.message,
    coupon: coupon,
  };
}

function calculateDiscount(subtotal, couponCode) {
  const validCoupons = {
    SOULVARD10: { discount: 0.1 },
    SOULVARD15: { discount: 0.15 },
    WELCOME: { discount: 0.2 },
    FREESHIP: { discount: 0, shippingFree: true },
    SUMMER25: { discount: 0.25 },
  };

  if (validCoupons[couponCode] && validCoupons[couponCode].discount > 0) {
    return subtotal * validCoupons[couponCode].discount;
  }

  return 0;
}

// Delivery Information Modal Functions
function openDeliveryModal() {
  const modal = document.getElementById("deliveryModal");

  // Fill form with current data
  document.getElementById("editName").value = deliveryInfo.name;
  document.getElementById("editPhone").value = deliveryInfo.phone;
  document.getElementById("editEmail").value = deliveryInfo.email;
  document.getElementById("editAddress").value = deliveryInfo.address;
  document.getElementById("editPincode").value = deliveryInfo.pincode;
  document.getElementById("editCity").value = deliveryInfo.city;
  document.getElementById("editState").value = deliveryInfo.state;

  // Show modal
  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeDeliveryModal() {
  const modal = document.getElementById("deliveryModal");
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

function saveDeliveryInfo(event) {
  event.preventDefault();

  // Get form values
  const newDeliveryInfo = {
    name: document.getElementById("editName").value.trim(),
    phone: document.getElementById("editPhone").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    address: document.getElementById("editAddress").value.trim(),
    pincode: document.getElementById("editPincode").value.trim(),
    city: document.getElementById("editCity").value.trim(),
    state: document.getElementById("editState").value.trim(),
  };

  // Validate delivery info before saving
  const validation = validateDeliveryInfo(newDeliveryInfo);
  if (!validation.valid) {
    showToast(validation.error, "error");
    return;
  }

  // All validations passed - save delivery info
  deliveryInfo = newDeliveryInfo;

  // Update both desktop and mobile displays
  updateDeliveryDisplay();
  updateDeliveryDisplayMobile();

  // Close modal
  closeDeliveryModal();

  // Show success message
  showToast("Delivery information updated successfully!", "success");
}

function updateDeliveryDisplay() {
  const deliveryInfoElement = document.getElementById("deliveryInfo");

  deliveryInfoElement.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${deliveryInfo.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${deliveryInfo.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${deliveryInfo.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${deliveryInfo.address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pincode:</span>
                    <span class="info-value">${deliveryInfo.pincode}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">City, State:</span>
                    <span class="info-value">${deliveryInfo.city}, ${deliveryInfo.state}</span>
                </div>
            `;
}

function updateDeliveryDisplayMobile() {
  const deliveryInfoElement = document.getElementById("deliveryInfoMobile");

  deliveryInfoElement.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${deliveryInfo.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${deliveryInfo.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${deliveryInfo.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${deliveryInfo.address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pincode:</span>
                    <span class="info-value">${deliveryInfo.pincode}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">City, State:</span>
                    <span class="info-value">${deliveryInfo.city}, ${deliveryInfo.state}</span>
                </div>
            `;
}

// Proceed to checkout
function proceedToCheckout() {
  if (cartItems.length === 0) {
    showToast("Your cart is empty", "error");
    return;
  }

  // Collect delivery information from form
  const nameInput =
    document.getElementById("fullName") ||
    document.getElementById("deliveryName");
  const phoneInput =
    document.getElementById("phoneNumber") ||
    document.getElementById("deliveryPhone");
  const emailInput =
    document.getElementById("emailAddress") ||
    document.getElementById("deliveryEmail");
  const addressInput =
    document.getElementById("fullAddress") ||
    document.getElementById("deliveryAddress");
  const pincodeInput =
    document.getElementById("postalCode") ||
    document.getElementById("deliveryPincode");
  const cityInput =
    document.getElementById("city") || document.getElementById("deliveryCity");
  const stateInput =
    document.getElementById("state") ||
    document.getElementById("deliveryState");

  // Validate delivery info
  if (
    !nameInput?.value ||
    !phoneInput?.value ||
    !emailInput?.value ||
    !addressInput?.value ||
    !pincodeInput?.value ||
    !cityInput?.value ||
    !stateInput?.value
  ) {
    showToast("Please complete all delivery information", "error");
    openDeliveryModal();
    return;
  }

  const deliveryInfo = {
    name: nameInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
    address: addressInput.value,
    pincode: pincodeInput.value,
    city: cityInput.value,
    state: stateInput.value,
  };

  // Validate email format
  if (!deliveryInfo.email.includes("@")) {
    showToast("Please enter a valid email address", "error");
    return;
  }

  // Disable checkout button
  const checkoutBtn = document.getElementById("checkoutBtn");
  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';

  // Prepare order data
  const orderData = {
    items: cartItems.map((item) => ({
      productId: item.productId || item.product?._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })),
    deliveryInfo: deliveryInfo,
    shippingAddress: deliveryInfo,
    billingAddress: deliveryInfo,
  };

  // Create order via API
  ordersAPI
    .create(orderData)
    .then((response) => {
      if (response.success) {
        showToast(
          "Order placed successfully! Redirecting to payment...",
          "success",
        );

        // Clear cart
        cartAPI.clear().catch((err) => console.log("Cart clear error:", err));

        // Clear localStorage
        localStorage.removeItem("cart");
        localStorage.removeItem("cartCount");

        // Redirect to order confirmation or payment page
        setTimeout(() => {
          // Redirect to order tracking page or home
          window.location.href =
            "./index.html?orderSuccess=true&orderId=" + response.data._id;
        }, 1500);
      } else {
        showToast("Failed to place order: " + response.message, "error");
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML =
          '<i class="fas fa-lock"></i> PROCEED TO CHECKOUT';
      }
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      showToast("Error placing order: " + error.message, "error");
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> PROCEED TO CHECKOUT';
    });
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast";
  toast.classList.add(type);
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Initialize
document.addEventListener("DOMContentLoaded", async function () {
  await initializeCart();

  // Load saved coupon if exists
  const savedCoupon = localStorage.getItem("appliedCoupon");
  if (savedCoupon) {
    document.getElementById("couponCode").value = savedCoupon;
    document.getElementById("couponCodeMobile").value = savedCoupon;
    // Trigger coupon validation
    setTimeout(() => applyCoupon(), 100);
  }

  // Add enter key support for coupon inputs
  document
    .getElementById("couponCode")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCoupon();
      }
    });

  document
    .getElementById("couponCodeMobile")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCouponMobile();
      }
    });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector("nav");
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.08)";
    } else {
      navbar.style.boxShadow = "none";
    }
  });

  // Close modal when clicking outside
  document
    .getElementById("deliveryModal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeDeliveryModal();
      }
    });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDeliveryModal();
    }
  });

  // Window resize handler to update mobile elements
  window.addEventListener("resize", function () {
    updateMobileShippingNote();
  });
});
