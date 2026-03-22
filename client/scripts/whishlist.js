// Wishlist data - loaded from API
let wishlistItems = [];

// Load wishlist from API
async function loadWishlistFromAPI() {
  try {
    const user = getCurrentUser();
    if (!user) {
      // Not logged in - show empty wishlist
      wishlistItems = [];
      return;
    }

    const response = await wishlistAPI.get();
    if (response.success && response.data) {
      wishlistItems = response.data.items || [];
      console.log("Wishlist loaded from API:", wishlistItems);
    } else {
      wishlistItems = [];
    }
  } catch (error) {
    console.error("Error loading wishlist from API:", error);
    // Fallback to empty wishlist on error
    wishlistItems = [];
  }
}

let cartCount = 0;

// Update counts on page load
document.addEventListener("DOMContentLoaded", async function () {
  // Show loading state
  const wishlistGrid = document.getElementById("wishlistGrid");
  if (wishlistGrid) {
    wishlistGrid.innerHTML = `
      <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 2rem;">
        <div style="width:28px;height:28px;border:3px solid #ddd;border-top-color:#111;border-radius:50%;animation:soulvardSpin .8s linear infinite;"></div>
        <span style="font-size: 14px;">Loading wishlist...</span>
      </div>
    `;
  }

  await loadWishlistFromAPI();
  await syncHeaderCounts();
  updateWishlistCount();
  updateCartCount();
  renderWishlistItems();
  setupNavScroll();
});

async function syncHeaderCounts() {
  const user = getCurrentUser();
  if (!user) {
    cartCount = 0;
    return;
  }
  try {
    const cartResponse = await cartAPI.get();
    if (cartResponse.success) {
      cartCount = (cartResponse.data?.items || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
    }
  } catch (e) {
    console.warn("Could not sync cart count:", e);
  }
}

// Update wishlist count display
function updateWishlistCount() {
  document.getElementById("wishlistCount").textContent = wishlistItems.length;
}

// Update cart count display
function updateCartCount() {
  document.getElementById("cartCount").textContent = cartCount;
}

// Render wishlist items with matching page design
function renderWishlistItems() {
  const wishlistGrid = document.getElementById("wishlistGrid");
  const emptyWishlist = document.getElementById("emptyWishlist");
  const wishlistTitle = document.getElementById("wishlistTitle");

  // Update title
  wishlistTitle.textContent = `SAVED ITEMS (${wishlistItems.length})`;

  if (wishlistItems.length === 0) {
    wishlistGrid.style.display = "none";
    emptyWishlist.style.display = "block";
    return;
  }

  wishlistGrid.style.display = "grid";
  emptyWishlist.style.display = "none";

  // Clear grid
  wishlistGrid.innerHTML = "";

  // Add each wishlist item
  wishlistItems.forEach((item, index) => {
    const discount = item.mrp
      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
      : 0;

    // Fallback image if product image is missing
    const defaultImage =
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
    const productImage =
      item.image || item.colors?.[0]?.images?.[0] || defaultImage;

    // Handle inStock field - default to true if not specified
    const inStock = item.inStock !== false;

    const wishlistItem = document.createElement("div");
    wishlistItem.className = `wishlist-product-card ${!inStock ? "out-of-stock" : ""}`;
    wishlistItem.innerHTML = `
                    <div class="wishlist-image-container">
                        <div class="wishlist-product-image" style="background-image: url('${productImage}'); background-size: cover; background-position: center;"></div>
                        ${
                          !inStock
                            ? `
                            <div class="out-of-stock-overlay">
                                <div class="out-of-stock-label">OUT OF STOCK</div>
                            </div>
                        `
                            : ""
                        }
                        ${item.badge ? `<div class="product-badge">${item.badge}</div>` : ""}
                        <div class="wishlist-product-actions">
                            <button class="wishlist-action-btn-small wishlist-remove-btn" onclick="removeFromWishlist(${index})" title="Remove from wishlist">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="wishlist-product-info">
                        <div class="wishlist-product-name">${item.name}</div>
                        <div class="wishlist-price-container">
                            <span class="wishlist-current-price">₹${(item.price || 0).toLocaleString("en-IN")}</span>
                            ${item.mrp ? `<span class="wishlist-mrp">₹${(item.mrp || 0).toLocaleString("en-IN")}</span>` : ""}
                            ${discount > 0 && inStock ? `<span class="wishlist-discount">${discount}% OFF</span>` : ""}
                        </div>
                        ${
                          !inStock
                            ? `
                            <div class="wishlist-out-of-stock">
                                <i class="fas fa-clock"></i> Will be back soon
                            </div>
                            <button class="notify-me-btn" onclick="notifyMe('${item._id || item.id || item.productId}')">
                                NOTIFY ME
                            </button>
                        `
                            : `
                            <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${index})">
                                ADD TO CART
                            </button>
                        `
                        }
                    </div>
                `;

    wishlistGrid.appendChild(wishlistItem);
  });
}

// Remove item from wishlist
function removeFromWishlist(index) {
  event.stopPropagation();
  const removedItem = wishlistItems[index];
  const productId = removedItem._id || removedItem.id || removedItem.productId;

  if (!productId) {
    showNotification("Error: Could not identify product", "error");
    return;
  }

  // Find and disable the remove button
  const removeBtn = document.querySelector(
    `button[onclick="removeFromWishlist(${index})"]`,
  );
  if (removeBtn) {
    removeBtn.disabled = true;
    removeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }

  // Call API to remove from wishlist
  wishlistAPI
    .remove(productId)
    .then((response) => {
      if (response.success) {
        wishlistItems.splice(index, 1);
        updateWishlistCount();
        renderWishlistItems();
        showNotification(`${removedItem.name} removed from wishlist`);
      } else {
        showNotification("Failed to remove from wishlist", "error");
        if (removeBtn) {
          removeBtn.disabled = false;
          removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        }
      }
    })
    .catch((error) => {
      console.error("Error removing from wishlist:", error);
      showNotification("Error: " + error.message, "error");
      if (removeBtn) {
        removeBtn.disabled = false;
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
      }
    });
}

// Add to cart from wishlist
function addToCartFromWishlist(index) {
  event.stopPropagation();
  const item = wishlistItems[index];
  if (!item.inStock) {
    showNotification("This item is currently out of stock");
    return;
  }
  const productId = item._id || item.id || item.productId;
  const defaultSize =
    item?.sizes?.find((s) => s?.inStock)?.size ||
    item?.sizes?.[0]?.size ||
    "One Size";
  const defaultColor =
    item?.colors?.find((c) => Array.isArray(c?.images) && c.images.length > 0)
      ?.value ||
    item?.colors?.[0]?.value ||
    "default";

  // Find and disable the add to cart button
  const addBtn = document.querySelector(
    `button[onclick="addToCartFromWishlist(${index})"]`,
  );
  if (addBtn) {
    addBtn.disabled = true;
    addBtn.textContent = "Adding...";
  }

  cartAPI
    .add(productId, 1, defaultSize, defaultColor)
    .then((response) => {
      if (!response.success) {
        showNotification("Failed to add to cart", "error");
        if (addBtn) {
          addBtn.disabled = false;
          addBtn.textContent = "ADD TO CART";
        }
        return;
      }
      cartCount = (response.data?.items || []).reduce(
        (sum, cartItem) => sum + (cartItem.quantity || 0),
        0,
      );
      localStorage.setItem("cartCount", cartCount.toString());
      updateCartCount();
      showNotification(`${item.name} added to cart`);
    })
    .catch((error) => {
      showNotification("Error adding to cart: " + error.message, "error");
      if (addBtn) {
        addBtn.disabled = false;
        addBtn.textContent = "ADD TO CART";
      }
    });
}

// Notify me when available
function notifyMe(productId) {
  event.stopPropagation();
  const item = wishlistItems.find((p) => p.id === productId);
  if (!item) return;

  const email = prompt(
    `Enter your email to get notified when "${item.name}" is back in stock:`,
  );

  if (email && validateEmail(email)) {
    showNotification(`You'll be notified when ${item.name} is back in stock!`);
  } else if (email) {
    showNotification("Please enter a valid email address.");
  }
}

// Clear entire wishlist
function clearWishlist() {
  if (wishlistItems.length === 0) {
    showNotification("Your wishlist is already empty");
    return;
  }

  if (confirm("Are you sure you want to clear your entire wishlist?")) {
    // Call API to clear wishlist
    wishlistAPI
      .clear()
      .then((response) => {
        if (response.success) {
          wishlistItems = [];
          updateWishlistCount();
          renderWishlistItems();
          showNotification("Wishlist cleared");
        } else {
          showNotification("Failed to clear wishlist", "error");
        }
      })
      .catch((error) => {
        console.error("Error clearing wishlist:", error);
        showNotification("Error: " + error.message, "error");
      });
  }
}

// Share wishlist
function shareWishlist() {
  if (wishlistItems.length === 0) {
    showNotification("Your wishlist is empty. Add some items to share.");
    return;
  }

  const itemNames = wishlistItems.map((item) => item.name).join(", ");
  const shareText = `Check out my Soulvard wishlist: ${itemNames}`;

  navigator.clipboard
    .writeText(shareText)
    .then(() => {
      showNotification("Wishlist copied to clipboard");
    })
    .catch(() => {
      showNotification("Failed to copy wishlist");
    });
}

// Subscribe to newsletter
function subscribeNewsletter() {
  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput.value;

  if (email && validateEmail(email)) {
    showNotification("Thank you for subscribing to our newsletter!");
    emailInput.value = "";
  } else {
    showNotification("Please enter a valid email address.");
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "toast";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
  document.body.style.overflow = menu.classList.contains("active")
    ? "hidden"
    : "auto";
}

// Navbar scroll effect
function setupNavScroll() {
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}
