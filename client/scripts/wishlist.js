// Wishlist Page - API Integrated

// Initialize page
document.addEventListener("DOMContentLoaded", async function () {
  // Check authentication
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
    return;
  }

  await renderWishlistItems();
  updateWishlistCount();
  updateCartCount();

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

// Render wishlist items
async function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById("wishlistItems");
  const emptyWishlist = document.getElementById("emptyWishlist");
  const wishlistTitle = document.getElementById("wishlistTitle");

  const wishlist = getWishlist();

  // Update title
  wishlistTitle.textContent = `SAVED ITEMS (${wishlist.length})`;

  if (wishlist.length === 0) {
    if (wishlistItemsContainer) wishlistItemsContainer.style.display = "none";
    if (emptyWishlist) emptyWishlist.style.display = "block";
    return;
  }

  if (wishlistItemsContainer) wishlistItemsContainer.style.display = "grid";
  if (emptyWishlist) emptyWishlist.style.display = "none";

  // Clear container
  if (wishlistItemsContainer) {
    wishlistItemsContainer.innerHTML = wishlist
      .map(
        (item, index) => `
      <div class="wishlist-item" data-item-id="${item._id}">
        <div class="wishlist-item-image" style="background-image: url('${
          item.images?.[0] || "https://via.placeholder.com/300"
        }')">
          <div class="wishlist-item-actions">
            <button class="wishlist-item-btn remove-btn" onclick="removeFromWishlistUI(${index}, '${
          item._id
        }')">
              <i class="fas fa-times"></i>
            </button>
            <button class="wishlist-item-btn" onclick="addToCartFromWishlist('${
              item._id
            }', '${item.name}', ${item.price})">
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${item.name}</div>
          <div class="wishlist-item-price">${formatPrice(item.price)}</div>
          <div class="wishlist-item-availability">
            <span class="availability-dot"></span>
            <span>In Stock - Ready to Ship</span>
          </div>
          <div class="wishlist-item-actions-bottom">
            <button class="add-to-cart-btn" onclick="addToCartFromWishlist('${
              item._id
            }', '${item.name}', ${item.price})">ADD TO CART</button>
            <button class="quick-view-btn" onclick="quickViewFromWishlist('${
              item.name
            }', ${item.price}, '${
          item.images?.[0] || "https://via.placeholder.com/300"
        }', '${item.category}', '${item._id}')">QUICK VIEW</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
}

// Remove item from wishlist
function removeFromWishlistUI(index, productId) {
  const wishlist = getWishlist();
  const item = wishlist[index];

  if (confirm(`Remove ${item.name} from wishlist?`)) {
    removeFromWishlist(productId);
    showToast(`${item.name} removed from wishlist`, "info");
    renderWishlistItems();
    updateWishlistCount();
  }
}

// Add to cart from wishlist
function addToCartFromWishlist(productId, productName, price) {
  const product = {
    _id: productId,
    name: productName,
    price: price,
    images: [],
  };

  addToCart(product, 1, "", "");
  showToast(`${productName} added to cart!`, "success");
  updateCartCount();
}

// Quick view from wishlist
let currentProduct = null;

function quickViewFromWishlist(
  productName,
  price,
  imageUrl,
  category,
  productId
) {
  const modal = document.getElementById("quickViewModal");
  const modalContent = document.getElementById("modalProductContent");

  currentProduct = {
    _id: productId,
    name: productName,
    price: price,
    images: [imageUrl],
    category: category,
  };

  const sizeOptions = generateSizeOptions(category);
  const colorOptions = generateColorOptions(category);

  if (modalContent) {
    modalContent.innerHTML = `
      <div class="modal-product-image" style="background-image: url('${imageUrl}')"></div>
      <div class="modal-product-info">
        <h3>${productName}</h3>
        <div class="price">${formatPrice(price)}</div>
        <div class="description">
          Experience the epitome of luxury with our ${productName.toLowerCase()}. Meticulously crafted from the finest materials, this piece embodies timeless elegance and sophisticated design.
        </div>
        
        <div class="color-selection">
          <h4>SELECT COLOR</h4>
          <div class="color-options">
            ${colorOptions}
          </div>
        </div>
        
        <div class="size-selection">
          <h4>SELECT SIZE</h4>
          <div class="size-options">
            ${sizeOptions}
          </div>
          <div class="size-chart-link" onclick="openSizeChart()">View Size Chart</div>
        </div>
        
        <div class="modal-actions">
          <button class="add-to-cart" onclick="addToCartFromWishlist('${productId}', '${productName}', ${price}); closeModal()">ADD TO CART</button>
          <button class="wishlist-btn" id="wishlistBtn" onclick="toggleWishlist('${productName}', ${price}, '${imageUrl}', '${productId}')">
            <i class="${
              isInWishlist(productId) ? "fas" : "far"
            } fa-heart"></i> ${
      isInWishlist(productId) ? "IN WISHLIST" : "ADD TO WISHLIST"
    }
          </button>
        </div>
      </div>
    `;
  }

  if (modal) modal.style.display = "flex";
}

// Generate size options
function generateSizeOptions(category) {
  let sizes = [];

  switch (category.toLowerCase()) {
    case "shirt":
    case "blazer":
    case "sweater":
      sizes = ["XS", "S", "M", "L", "XL"];
      break;
    case "trousers":
      sizes = ["28", "30", "32", "34", "36"];
      break;
    case "coat":
    case "jacket":
      sizes = ["S", "M", "L", "XL", "XXL"];
      break;
    case "dress":
      sizes = ["XS", "S", "M", "L", "XL"];
      break;
    case "shoes":
      sizes = ["7", "8", "9", "10", "11"];
      break;
    case "accessories":
      sizes = ["One Size"];
      break;
    default:
      sizes = ["XS", "S", "M", "L", "XL"];
  }

  return sizes
    .map((size, index) => {
      const selected = index === 2 ? "selected" : "";
      return `<div class="size-option ${selected}" onclick="selectSize(this)">${size}</div>`;
    })
    .join("");
}

// Generate color options
function generateColorOptions(category) {
  let colors = [];

  switch (category.toLowerCase()) {
    case "shirt":
    case "blazer":
      colors = [
        { name: "Ivory", value: "#f8f5f0" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Charcoal", value: "#36454f" },
        { name: "White", value: "#ffffff" },
      ];
      break;
    case "trousers":
      colors = [
        { name: "Charcoal", value: "#36454f" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Black", value: "#000000" },
        { name: "Khaki", value: "#c3b091" },
      ];
      break;
    case "coat":
    case "jacket":
      colors = [
        { name: "Camel", value: "#c19a6b" },
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Charcoal", value: "#36454f" },
      ];
      break;
    default:
      colors = [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Charcoal", value: "#36454f" },
      ];
  }

  return colors
    .map((color, index) => {
      const selected = index === 0 ? "selected" : "";
      return `
      <div class="color-option-container">
        <div class="color-option ${selected}" style="background-color: ${color.value}" onclick="selectColor(this)" title="${color.name}"></div>
        <div class="color-name">${color.name}</div>
      </div>
    `;
    })
    .join("");
}

// Select size
function selectSize(element) {
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("selected");
  });
  element.classList.add("selected");
}

// Select color
function selectColor(element) {
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("selected");
  });
  element.classList.add("selected");
}

// Modal functions
function openSizeChart() {
  const modal = document.getElementById("sizeChartModal");
  if (modal) modal.style.display = "flex";
}

function closeSizeChart() {
  const modal = document.getElementById("sizeChartModal");
  if (modal) modal.style.display = "none";
}

function closeModal() {
  const modal = document.getElementById("quickViewModal");
  if (modal) modal.style.display = "none";
}

// Close modal on outside click
window.addEventListener("click", function (event) {
  const quickViewModal = document.getElementById("quickViewModal");
  const sizeChartModal = document.getElementById("sizeChartModal");

  if (event.target === quickViewModal) {
    closeModal();
  }
  if (event.target === sizeChartModal) {
    closeSizeChart();
  }
});

// Clear entire wishlist
function clearWishlist() {
  const wishlist = getWishlist();
  if (wishlist.length === 0) {
    showToast("Your wishlist is already empty", "error");
    return;
  }

  if (confirm("Are you sure you want to clear your entire wishlist?")) {
    localStorage.removeItem("wishlist");
    updateWishlistCount();
    renderWishlistItems();
    showToast("Wishlist cleared", "success");
  }
}

// Share wishlist
function shareWishlist() {
  const wishlist = getWishlist();
  if (wishlist.length === 0) {
    showToast("Your wishlist is empty. Add some items to share.", "error");
    return;
  }

  const itemNames = wishlist.map((item) => item.name).join(", ");
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

// Update wishlist count display
function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlistCount");
  const wishlist = getWishlist();
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

// Update cart count display
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const cart = getCart();
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
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
