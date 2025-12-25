// Cart Page - API Integrated

// Initialize page
document.addEventListener("DOMContentLoaded", async function () {
  // Check authentication
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
    return;
  }

  await loadCart();
  updateCartCount();
  updateOrderSummary();
});

// Load cart from localStorage
async function loadCart() {
  const cartItems = document.querySelector(".cart-items");
  const cart = getCart();

  if (cart.length === 0) {
    showEmptyCart();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart-item" data-item-id="${index}">
      <div class="item-image" style="background-image: url('${
        item.images?.[0] || "https://via.placeholder.com/150"
      }')"></div>
      <div class="item-details">
        <h4>${item.name}</h4>
        <p class="item-meta">${item.color || "Standard"} / ${
        item.size || "OneSize"
      }</p>
        <p class="item-price">${formatPrice(item.price * item.quantity)}</p>
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `
    )
    .join("");
}

// Increase quantity
function increaseQuantity(index) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity += 1;
    saveCart(cart);
    loadCart();
    updateOrderSummary();
    showToast("Quantity updated", "success");
  }
}

// Decrease quantity
function decreaseQuantity(index) {
  const cart = getCart();
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      saveCart(cart);
      loadCart();
      updateOrderSummary();
      showToast("Quantity updated", "success");
    } else {
      removeItem(index);
    }
  }
}

// Remove item from cart
function removeItem(index) {
  const cart = getCart();
  const itemName = cart[index]?.name || "Item";

  if (confirm(`Remove ${itemName} from cart?`)) {
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateOrderSummary();
    updateCartCount();
    showToast("Item removed from cart", "success");

    if (cart.length === 0) {
      showEmptyCart();
    }
  }
}

// Show empty cart message
function showEmptyCart() {
  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = `
    <div class="cart-empty">
      <i class="fas fa-shopping-bag"></i>
      <h3>Your cart is empty</h3>
      <p>Discover our premium collection and add items to your cart</p>
      <button class="continue-shopping" onclick="window.location.href='collection.html'">CONTINUE SHOPPING</button>
    </div>
  `;
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const cart = getCart();
  cartCount.textContent = cart.length;
}

// Update order summary
function updateOrderSummary() {
  const cart = getCart();
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const shipping = subtotal > 5000 ? 0 : 100; // 100 rupees shipping or free over 5000
  const tax = subtotal * 0.1; // 10% tax

  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : formatPrice(shipping);
  document.getElementById("tax").textContent = formatPrice(tax);
  document.getElementById("total").textContent = formatPrice(
    subtotal + shipping + tax
  );
}

// Function to navigate to cart page
function goToCartPage() {
  window.location.href = "cart.html";
}

// Update quantity function (legacy support)
function updateQuantity(button, change) {
  const item = button.closest(".cart-item");
  const index = parseInt(item.dataset.itemId);

  if (change > 0) {
    increaseQuantity(index);
  } else {
    decreaseQuantity(index);
  }
}

// Select payment method
function selectPaymentMethod(element, method) {
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.classList.remove("active");
  });
  element.classList.add("active");

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (method === "razorpay") {
    checkoutBtn.innerHTML =
      '<i class="fas fa-lock"></i> PAY SECURELY WITH RAZORPAY';
  } else {
    checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> PROCEED TO CHECKOUT';
  }
}

// Process checkout
async function processCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast(
      "Your cart is empty. Please add items before checking out.",
      "error"
    );
    return;
  }

  // Validate form
  const firstName = document.getElementById("firstName")?.value || "";
  const lastName = document.getElementById("lastName")?.value || "";
  const email = document.getElementById("email")?.value || "";
  const phone = document.getElementById("phone")?.value || "";
  const address = document.getElementById("address")?.value || "";
  const city = document.getElementById("city")?.value || "";
  const pincode = document.getElementById("pincode")?.value || "";
  const country = document.getElementById("country")?.value || "";

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !pincode ||
    !country
  ) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  // Get coupon code if applied
  const couponInput = document.getElementById("couponInput");
  const couponCode = couponInput?.value || "";

  let couponDiscount = 0;
  if (couponCode) {
    const couponResult = await validateCoupon(couponCode);
    if (!couponResult.valid) {
      showToast("Invalid coupon code.", "error");
      return;
    }
    couponDiscount = couponResult.discountAmount || 0;
  }

  // Prepare order data
  const orderData = {
    shippingInfo: {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      pincode,
      country,
    },
    cartItems: cart,
    couponCode: couponCode || null,
    couponDiscount: couponDiscount,
  };

  // For now, simulate successful order
  showToast("Processing your order...", "success");
  setTimeout(() => {
    // Clear cart after successful payment
    clearCart();
    const cartItems = document.querySelector(".cart-items");
    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-check-circle" style="color: #c9a961;"></i>
        <h3>Order Placed Successfully!</h3>
        <p>Thank you for your purchase. You will receive a confirmation email shortly at ${email}.</p>
        <button class="continue-shopping" onclick="window.location.href='index.html'">CONTINUE SHOPPING</button>
      </div>
    `;
    updateCartCount();
  }, 2000);
}

// Process Razorpay payment
function processRazorpayPayment() {
  showToast("Razorpay integration coming soon!", "info");
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast";
  toast.classList.add(type);
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Save cart for later
function saveCartForLater() {
  showToast("Cart saved for later", "success");
}

// Clear cart
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("cart");
    updateCartCount();
    loadCart();
    showToast("Cart cleared", "success");
  }
}
