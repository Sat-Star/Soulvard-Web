// Sample wishlist data matching the premium design
const sampleWishlistItems = [
  {
    id: 1,
    name: "Premium Leather Journal Set",
    price: 3599,
    mrp: 4999,
    category: "Writing",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    badge: "PREMIUM",
    inStock: true,
  },
  {
    id: 2,
    name: "Artisanal Fountain Pen Collection",
    price: 8599,
    mrp: 9999,
    category: "Writing",
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    badge: "LIMITED",
    inStock: false,
  },
  {
    id: 3,
    name: "Handcrafted Wooden Desk Organizer",
    price: 6799,
    category: "Desk Accessories",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    badge: "ARTISAN",
    inStock: true,
  },
  {
    id: 4,
    name: "Premium Writing Paper Collection",
    price: 2599,
    mrp: 3299,
    category: "Writing",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    badge: "NEW",
    inStock: true,
  },
  {
    id: 5,
    name: "Classic Brass Letter Opener",
    price: 1899,
    category: "Desk Accessories",
    image:
      "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    badge: "CLASSIC",
    inStock: true,
  },
  {
    id: 6,
    name: "Vintage Style Desk Lamp",
    price: 7899,
    mrp: 9999,
    category: "Desk Accessories",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    badge: "SOLD OUT",
    inStock: false,
  },
];

// Initialize wishlist from localStorage or create with sample data
let wishlistItems =
  JSON.parse(localStorage.getItem("soulvardWishlist")) || sampleWishlistItems;
let cartCount = parseInt(localStorage.getItem("soulvardCartCount")) || 3;

// Update counts on page load
document.addEventListener("DOMContentLoaded", function () {
  updateWishlistCount();
  updateCartCount();
  renderWishlistItems();
  setupNavScroll();
});

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

    const wishlistItem = document.createElement("div");
    wishlistItem.className = `wishlist-product-card ${!item.inStock ? "out-of-stock" : ""}`;
    wishlistItem.innerHTML = `
                    <div class="wishlist-image-container">
                        <div class="wishlist-product-image" style="background-image: url('${item.image}')"></div>
                        ${
                          !item.inStock
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
                            <span class="wishlist-current-price">₹${item.price.toLocaleString("en-IN")}</span>
                            ${item.mrp ? `<span class="wishlist-mrp">₹${item.mrp.toLocaleString("en-IN")}</span>` : ""}
                            ${discount > 0 && item.inStock ? `<span class="wishlist-discount">${discount}% OFF</span>` : ""}
                        </div>
                        ${
                          !item.inStock
                            ? `
                            <div class="wishlist-out-of-stock">
                                <i class="fas fa-clock"></i> Will be back soon
                            </div>
                            <button class="notify-me-btn" onclick="notifyMe(${item.id})">
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
  wishlistItems.splice(index, 1);
  localStorage.setItem("soulvardWishlist", JSON.stringify(wishlistItems));

  updateWishlistCount();
  renderWishlistItems();
  showNotification(`${removedItem.name} removed from wishlist`);
}

// Add to cart from wishlist
function addToCartFromWishlist(index) {
  event.stopPropagation();
  const item = wishlistItems[index];
  if (!item.inStock) {
    showNotification("This item is currently out of stock");
    return;
  }

  cartCount++;
  localStorage.setItem("soulvardCartCount", cartCount.toString());

  updateCartCount();
  showNotification(`${item.name} added to cart`);
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
    wishlistItems = [];
    localStorage.setItem("soulvardWishlist", JSON.stringify(wishlistItems));

    updateWishlistCount();
    renderWishlistItems();
    showNotification("Wishlist cleared");
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
