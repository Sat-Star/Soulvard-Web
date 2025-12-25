// Collection Page - API Integrated
let products = [];
let filteredProducts = [];
let categories = [];
let currentCategory = "all";
let currentSort = "name";

// Initialize page
document.addEventListener("DOMContentLoaded", async function () {
  // Check authentication
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
    return;
  }

  // Load data from API
  await loadCollectionData();

  // Initialize filters and display
  initializeFilters();
  renderProducts(filteredProducts);

  // Update cart count
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

// Load products and categories from API
async function loadCollectionData() {
  try {
    products = await getProducts();
    categories = await getCategories();
    filteredProducts = [...products];
  } catch (error) {
    console.error("Error loading collection data:", error);
    alert("Error loading products. Please try again.");
  }
}

// Initialize filters
function initializeFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
      const categoryName = category.name || category;
      const option = document.createElement("option");
      option.value = categoryName.toLowerCase();
      option.textContent = categoryName;
      categoryFilter.appendChild(option);
    });
  }

  // Add event listeners
  const categorySelect = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortFilter");
  const searchInput = document.getElementById("searchInput");

  if (categorySelect) {
    categorySelect.addEventListener("change", filterProducts);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", sortFilteredProducts);
  }
  if (searchInput) {
    searchInput.addEventListener("input", searchFilteredProducts);
  }
}

// Filter products by category
function filterProducts() {
  const categorySelect = document.getElementById("categoryFilter");
  currentCategory = categorySelect.value;

  if (currentCategory === "all") {
    filteredProducts = [...products];
  } else {
    filteredProducts = filterProductsByCategory(products, currentCategory);
  }

  applySort();
  renderProducts(filteredProducts);
}

// Sort products
function sortFilteredProducts() {
  const sortSelect = document.getElementById("sortFilter");
  currentSort = sortSelect.value;
  applySort();
  renderProducts(filteredProducts);
}

// Apply sorting
function applySort() {
  filteredProducts = sortProducts(filteredProducts, currentSort);
}

// Search products
function searchFilteredProducts() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value;

  if (query.trim()) {
    filteredProducts = searchProducts(products, query);
  } else {
    if (currentCategory === "all") {
      filteredProducts = [...products];
    } else {
      filteredProducts = filterProductsByCategory(products, currentCategory);
    }
  }

  applySort();
  renderProducts(filteredProducts);
}

// Render products
function renderProducts(productsToRender) {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  if (productsToRender.length === 0) {
    productGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
    return;
  }

  productGrid.innerHTML = productsToRender
    .map((product) => {
      const imageUrl =
        product.images && product.images.length > 0
          ? product.images[0]
          : "https://via.placeholder.com/300";
      const formattedPrice = formatPrice(product.price);
      const badge = product.featured ? "BESTSELLER" : "";

      return `
      <div class="product-card">
        <div class="product-image" style="background-image: url('${imageUrl}')">
          ${badge ? `<div class="product-badge">${badge}</div>` : ""}
          <div class="product-overlay">
            <button class="quick-view-btn" onclick="openQuickView('${
              product.name
            }', ${product.price}, '${imageUrl}', '${product.category}', '${
        product._id
      }')">
              QUICK VIEW
            </button>
          </div>
          <button class="wishlist-icon ${
            isInWishlist(product._id) ? "active" : ""
          }" onclick="toggleWishlistProduct('${product._id}', event)">
            <i class="${
              isInWishlist(product._id) ? "fas" : "far"
            } fa-heart"></i>
          </button>
        </div>
        <div class="product-details">
          <h3>${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <div class="product-footer">
            <span class="price">${formattedPrice}</span>
            <button class="add-to-cart-btn" onclick="addProductToCart('${
              product._id
            }', '${product.name}', ${product.price}, '${imageUrl}')">
              <i class="fas fa-shopping-bag"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Toggle wishlist for product
function toggleWishlistProduct(productId, event) {
  event.stopPropagation();
  const product = products.find((p) => p._id === productId);

  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
    showNotification(`${product.name} removed from wishlist`, "info");
  } else {
    addToWishlist(product);
    showNotification(`${product.name} added to wishlist`, "success");
  }

  // Re-render to update heart icon
  renderProducts(filteredProducts);
}

// Add product to cart
function addProductToCart(productId, productName, price, imageUrl) {
  const product = {
    _id: productId,
    name: productName,
    price: price,
    images: [imageUrl],
  };

  // Add with default color and size
  addToCart(product, 1, "", "");
  showNotification(`${productName} added to cart!`, "success");
}

// Quick View Modal
let currentProduct = null;

function openQuickView(productName, price, imageUrl, category, productId) {
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
        <button class="add-to-cart" onclick="addProductToCart('${productId}', '${productName}', ${price}, '${imageUrl}'); closeModal()">ADD TO CART</button>
        <button class="wishlist-btn" id="wishlistBtn" onclick="toggleWishlist('${productName}', ${price}, '${imageUrl}', '${productId}')">
          <i class="${isInWishlist(productId) ? "fas" : "far"} fa-heart"></i> ${
    isInWishlist(productId) ? "IN WISHLIST" : "ADD TO WISHLIST"
  }
        </button>
      </div>
    </div>
  `;

  modal.style.display = "flex";
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

// Open/Close modals
function openSizeChart() {
  document.getElementById("sizeChartModal").style.display = "flex";
}

function closeSizeChart() {
  document.getElementById("sizeChartModal").style.display = "none";
}

function closeModal() {
  document.getElementById("quickViewModal").style.display = "none";
}

// Close modal on outside click
window.addEventListener("click", function (event) {
  const modal = document.getElementById("quickViewModal");
  const sizeChartModal = document.getElementById("sizeChartModal");

  if (event.target === modal) {
    closeModal();
  }
  if (event.target === sizeChartModal) {
    closeSizeChart();
  }
});

// Notification function
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#c9a961" : "#666"};
    color: white;
    padding: 1rem 2rem;
    border-radius: 2px;
    z-index: 2000;
    font-weight: 500;
    letter-spacing: 1px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add animations
const style = document.createElement("style");
style.textContent = `
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
