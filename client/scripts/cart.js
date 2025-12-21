// Function to navigate to cart page
function goToCartPage() {
  window.location.href = "cart.html";
}

// Update quantity function
function updateQuantity(button, change) {
  const quantityElement = button.parentElement.querySelector(".quantity");
  let quantity = parseInt(quantityElement.textContent);
  quantity += change;

  if (quantity < 1) quantity = 1;

  quantityElement.textContent = quantity;
  updateItemPrice(button.closest(".cart-item"));
  updateOrderSummary();
  showToast("Quantity updated", "success");
}

// Update item price based on quantity
function updateItemPrice(item) {
  const quantity = parseInt(item.querySelector(".quantity").textContent);
  const basePrice = getBasePrice(item);
  const priceElement = item.querySelector(".item-price");
  priceElement.textContent = `$${(basePrice * quantity).toFixed(2)}`;
}

// Get base price of an item
function getBasePrice(item) {
  const priceText = item.querySelector(".item-price").textContent;
  return parseFloat(priceText.replace("$", ""));
}

// Remove item from cart
function removeItem(button) {
  const item = button.closest(".cart-item");
  item.style.opacity = "0";
  item.style.transform = "translateX(-20px)";

  setTimeout(() => {
    item.remove();
    updateOrderSummary();
    updateCartCount();

    // Show empty cart message if no items left
    const cartItems = document.querySelector(".cart-items");
    if (cartItems.children.length === 0) {
      showEmptyCart();
    }

    showToast("Item removed from cart", "success");
  }, 300);
}

// Show empty cart message
function showEmptyCart() {
  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your cart is empty</h3>
                    <p>Discover our premium collection and add items to your cart</p>
                    <button class="continue-shopping" onclick="window.location.href='index.html'">CONTINUE SHOPPING</button>
                </div>
            `;
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const items = document.querySelectorAll(".cart-item");
  cartCount.textContent = items.length;
}

// Update order summary
function updateOrderSummary() {
  const items = document.querySelectorAll(".cart-item");
  let subtotal = 0;

  items.forEach((item) => {
    const priceText = item.querySelector(".item-price").textContent;
    subtotal += parseFloat(priceText.replace("$", ""));
  });

  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.1; // 10% tax

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("total").textContent = `$${(
    subtotal +
    shipping +
    tax
  ).toFixed(2)}`;
}

// Select payment method
function selectPaymentMethod(element, method) {
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.classList.remove("active");
  });
  element.classList.add("active");

  // Update checkout button text based on selected method
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (method === "razorpay") {
    checkoutBtn.innerHTML =
      '<i class="fas fa-lock"></i> PAY SECURELY WITH RAZORPAY';
  } else {
    checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> PROCEED TO CHECKOUT';
  }
}

// Process checkout
function processCheckout() {
  const items = document.querySelectorAll(".cart-item");
  if (items.length === 0) {
    showToast(
      "Your cart is empty. Please add items before checking out.",
      "error"
    );
    return;
  }

  // Validate form
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const pincode = document.getElementById("pincode").value;
  const country = document.getElementById("country").value;

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

  // Process payment with Razorpay
  processRazorpayPayment();
}

// Process Razorpay payment
function processRazorpayPayment() {
  const totalAmount =
    parseFloat(document.getElementById("total").textContent.replace("$", "")) *
    100; // Convert to paise

  // Razorpay checkout options
  const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
    amount: totalAmount,
    currency: "USD",
    name: "Soulvard",
    description: "Premium Fashion Purchase",
    image: "https://your-logo-url.com/logo.png", // Replace with your logo URL
    handler: function (response) {
      // Handle successful payment
      showToast("Payment successful! Your order has been placed.", "success");

      // In a real application, you would send the payment details to your server
      console.log(response);

      // Redirect to order confirmation page
      setTimeout(() => {
        window.location.href = "order-confirmation.html";
      }, 2000);
    },
    prefill: {
      name:
        document.getElementById("firstName").value +
        " " +
        document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      contact: document.getElementById("phone").value,
    },
    notes: {
      address: document.getElementById("address").value,
    },
    theme: {
      color: "#c9a96e",
    },
  };

  // In a real implementation, you would initialize Razorpay with the options
  // const rzp = new Razorpay(options);
  // rzp.open();

  // For demo purposes, we'll simulate a successful payment
  showToast("Redirecting to Razorpay checkout...", "success");
  setTimeout(() => {
    showToast("Payment successful! Your order has been placed.", "success");

    // Clear cart after successful payment
    setTimeout(() => {
      const cartItems = document.querySelector(".cart-items");
      cartItems.innerHTML = `
                        <div class="cart-empty">
                            <i class="fas fa-check-circle" style="color: var(--success);"></i>
                            <h3>Order Placed Successfully!</h3>
                            <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
                            <button class="continue-shopping" onclick="window.location.href='index.html'">CONTINUE SHOPPING</button>
                        </div>
                    `;
      updateCartCount();
    }, 1000);
  }, 2000);
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

// Save cart for later
function saveCartForLater() {
  showToast("Cart saved for later", "success");
}

// Clear cart
function clearCart() {
  const cartItems = document.querySelector(".cart-items");
  const items = cartItems.querySelectorAll(".cart-item");

  if (items.length === 0) {
    showToast("Your cart is already empty", "error");
    return;
  }

  if (confirm("Are you sure you want to clear your cart?")) {
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";
    });

    setTimeout(() => {
      showEmptyCart();
      updateCartCount();
      showToast("Cart cleared", "success");
    }, 300);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  updateOrderSummary();
});
