// Initialize wishlist from localStorage or create empty array
let wishlistItems = JSON.parse(localStorage.getItem("soulvardWishlist")) || [];
let cartCount = parseInt(localStorage.getItem("soulvardCartCount")) || 0;

// Update counts on page load
document.addEventListener("DOMContentLoaded", function () {
  updateWishlistCount();
  updateCartCount();
  renderWishlistItems();

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});

// Update wishlist count display
function updateWishlistCount() {
  document.getElementById("wishlistCount").textContent = wishlistItems.length;
}

// Update cart count display
function updateCartCount() {
  document.getElementById("cartCount").textContent = cartCount;
}

// Render wishlist items
function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById("wishlistItems");
  const emptyWishlist = document.getElementById("emptyWishlist");
  const wishlistTitle = document.getElementById("wishlistTitle");

  // Update title
  wishlistTitle.textContent = `SAVED ITEMS (${wishlistItems.length})`;

  if (wishlistItems.length === 0) {
    wishlistItemsContainer.style.display = "none";
    emptyWishlist.style.display = "block";
    return;
  }

  wishlistItemsContainer.style.display = "grid";
  emptyWishlist.style.display = "none";

  // Clear container
  wishlistItemsContainer.innerHTML = "";

  // Add each wishlist item
  wishlistItems.forEach((item, index) => {
    const inrPrice = (item.price * 83).toLocaleString("en-IN");

    const wishlistItem = document.createElement("div");
    wishlistItem.className = "wishlist-item";
    wishlistItem.innerHTML = `
                    <div class="wishlist-item-image" style="background-image: url('${item.image}')">
                        <div class="wishlist-item-actions">
                            <button class="wishlist-item-btn remove-btn" onclick="removeFromWishlist(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                            <button class="wishlist-item-btn" onclick="moveToCart(${index})">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-name">${item.name}</div>
                        <div class="wishlist-item-price">₹${inrPrice}</div>
                        <div class="wishlist-item-availability">
                            <span class="availability-dot"></span>
                            <span>In Stock - Ready to Ship</span>
                        </div>
                        <div class="wishlist-item-actions-bottom">
                            <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${index})">ADD TO CART</button>
                            <button class="quick-view-btn" onclick="quickViewFromWishlist(${index})">QUICK VIEW</button>
                        </div>
                    </div>
                `;

    wishlistItemsContainer.appendChild(wishlistItem);
  });
}

// Remove item from wishlist
function removeFromWishlist(index) {
  const removedItem = wishlistItems[index];
  wishlistItems.splice(index, 1);
  localStorage.setItem("soulvardWishlist", JSON.stringify(wishlistItems));

  updateWishlistCount();
  renderWishlistItems();
  showToast(`${removedItem.name} removed from wishlist`, "error");
}

// Add to cart from wishlist
function addToCartFromWishlist(index) {
  const item = wishlistItems[index];
  cartCount++;
  localStorage.setItem("soulvardCartCount", cartCount.toString());

  updateCartCount();
  showToast(`${item.name} added to cart`, "success");
}

// Move to cart (add to cart and remove from wishlist)
function moveToCart(index) {
  const item = wishlistItems[index];
  cartCount++;
  localStorage.setItem("soulvardCartCount", cartCount.toString());

  wishlistItems.splice(index, 1);
  localStorage.setItem("soulvardWishlist", JSON.stringify(wishlistItems));

  updateWishlistCount();
  updateCartCount();
  renderWishlistItems();
  showToast(`${item.name} moved to cart`, "success");
}

// Quick view from wishlist
function quickViewFromWishlist(index) {
  const item = wishlistItems[index];
  // In a real implementation, this would open the quick view modal
  // For now, we'll just show a message
  showToast(`Opening quick view for ${item.name}`, "success");
}

// Clear entire wishlist
function clearWishlist() {
  if (wishlistItems.length === 0) {
    showToast("Your wishlist is already empty", "error");
    return;
  }

  if (confirm("Are you sure you want to clear your entire wishlist?")) {
    wishlistItems = [];
    localStorage.setItem("soulvardWishlist", JSON.stringify(wishlistItems));

    updateWishlistCount();
    renderWishlistItems();
    showToast("Wishlist cleared", "success");
  }
}

// Share wishlist
function shareWishlist() {
  if (wishlistItems.length === 0) {
    showToast("Your wishlist is empty. Add some items to share.", "error");
    return;
  }

  // In a real implementation, this would open a share dialog
  // For now, we'll copy a message to clipboard
  const itemNames = wishlistItems.map((item) => item.name).join(", ");
  const shareText = `Check out my Soulvard wishlist: ${itemNames}`;

  navigator.clipboard
    .writeText(shareText)
    .then(() => {
      showToast("Wishlist copied to clipboard", "success");
    })
    .catch(() => {
      showToast("Failed to copy wishlist", "error");
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

// Add animations
const style = document.createElement("style");
style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
document.head.appendChild(style);
