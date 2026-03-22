// Enhanced product data - loaded from API
let collectionsProducts = [];
let allCollectionsProducts = [];

// Load products from API
async function loadProductsFromAPI() {
  renderCollectionsLoader();
  try {
    const response = await productsAPI.getAll({
      limit: 100,
    });

    if (response.success) {
      allCollectionsProducts = response.data;
      collectionsProducts = response.data;

      // Set up category tabs from API data
      setupCategoryTabs();

      renderCollectionsProducts();
      updateCartCount();
      updateWishlistCount();
      setupNavScroll();
    }
  } catch (error) {
    console.error("Failed to load products:", error);
    showError("Failed to load products. Using fallback data.");
    // Continue with empty array - user can refresh
  }
}

function renderCollectionsLoader() {
  if (!collectionsGrid) return;
  collectionsGrid.innerHTML = `
    <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 2rem;">
      <div style="width:28px;height:28px;border:3px solid #ddd;border-top-color:#111;border-radius:50%;animation:soulvardSpin .8s linear infinite;"></div>
      <span style="font-size: 14px;">Loading products...</span>
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

// Setup category tabs from API categories
async function setupCategoryTabs() {
  try {
    const response = await categoriesAPI.getAll();
    if (response.success) {
      const categories = response.data;
      const tabsContainer = document.querySelector(".category-tabs");
      if (tabsContainer) {
        tabsContainer.innerHTML = `
          <button class="category-tab active" data-category="all">All Products</button>
          ${categories
            .map(
              (cat) => `
            <button class="category-tab" data-category="${cat._id}">${cat.name}</button>
          `,
            )
            .join("")}
        `;

        // Re-attach event listeners
        setupEventListeners();
      }
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

// DOM elements
const collectionsGrid = document.getElementById("collectionsGrid");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// State variables
let currentCategory = "all";
let currentSort = "featured";
let visibleProducts = 8;
let cartCount = 0;
let wishlistCount = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", async function () {
  await loadProductsFromAPI();
  await syncHeaderCounts();
  setupEventListeners();
  updateCartCount();
  updateWishlistCount();
  setupNavScroll();
});

async function syncHeaderCounts() {
  const user = getCurrentUser();
  if (!user) {
    cartCount = 0;
    wishlistCount = 0;
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

  try {
    const wishlistResponse = await wishlistAPI.get();
    if (wishlistResponse.success) {
      wishlistCount = (wishlistResponse.data?.items || []).length;
    }
  } catch (e) {
    console.warn("Could not sync wishlist count:", e);
  }
}

// Set up event listeners - FIXED: Query category tabs fresh each time
function setupEventListeners() {
  // Query category tabs fresh to ensure we get the latest DOM elements
  const categoryTabs = document.querySelectorAll(".category-tab");

  // Category tabs
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      categoryTabs.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tab
      this.classList.add("active");
      // Update current category
      currentCategory = this.getAttribute("data-category");
      // Reset visible products for load more
      visibleProducts = 8;
      // Render products
      renderCollectionsProducts();
    });
  });

  // Sort select
  sortSelect.addEventListener("change", function () {
    currentSort = this.value;
    visibleProducts = 8; // Reset to initial when sorting
    renderCollectionsProducts();
  });

  // FIXED: Load more button
  loadMoreBtn.addEventListener("click", function () {
    visibleProducts += 8;
    renderCollectionsProducts();

    // Scroll to show newly loaded products
    setTimeout(() => {
      collectionsGrid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  });
}

// Render collections products based on current filters and sort - FIXED: Added load more logic
function renderCollectionsProducts() {
  // Filter products
  let filteredProducts = collectionsProducts;
  if (currentCategory !== "all") {
    filteredProducts = collectionsProducts.filter((product) => {
      // Handle both object category {_id, name, slug} and string category
      if (typeof product.category === "object" && product.category) {
        return product.category._id === currentCategory;
      }
      return product.category === currentCategory;
    });
  }

  // Sort products
  filteredProducts = sortCollectionsProducts(filteredProducts, currentSort);

  // Update product count
  const showingCount = Math.min(visibleProducts, filteredProducts.length);
  const inStockCount = filteredProducts.filter((p) => p.inStock).length;
  const outOfStockCount = filteredProducts.filter((p) => !p.inStock).length;
  productCount.textContent = `${showingCount} of ${filteredProducts.length} products`;

  // FIXED: Show/hide load more button
  if (visibleProducts >= filteredProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  // Clear product grid
  collectionsGrid.innerHTML = "";

  // Render products
  const productsToShow = filteredProducts.slice(0, visibleProducts);
  productsToShow.forEach((product) => {
    const productCard = createCollectionsProductCard(product);
    collectionsGrid.appendChild(productCard);
  });
}

// Sort products based on selected option
function sortCollectionsProducts(products, sortBy) {
  switch (sortBy) {
    case "newest":
      return [...products].sort((a, b) => b.id - a.id);
    case "price-low":
      return [...products].sort((a, b) => a.price - b.price);
    case "price-high":
      return [...products].sort((a, b) => b.price - a.price);
    case "name":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return products;
  }
}

// FIXED: Create collections product card HTML with better price structure
function createCollectionsProductCard(product) {
  const card = document.createElement("div");
  card.className = `matching-product-card ${!product.inStock ? "out-of-stock" : ""}`;
  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  // Fallback image if product image is missing
  const defaultImage =
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
  const productImage =
    product.image || product.colors?.[0]?.images?.[0] || defaultImage;

  card.innerHTML = `
                <div class="matching-image-container">
                    <div class="matching-product-image" style="background-image: url('${productImage}'); background-size: cover; background-position: center;"></div>
                    ${
                      !product.inStock
                        ? `
                        <div class="out-of-stock-overlay">
                            <div class="out-of-stock-label">OUT OF STOCK</div>
                        </div>
                    `
                        : ""
                    }
                    ${product.badge ? `<div class="product-badge ${!product.inStock ? "out-of-stock-badge" : ""}">${product.badge}</div>` : ""}
                </div>
                <div class="matching-product-info">
                    <div class="matching-product-name">${product.name}</div>
                    <div class="price-container">
                        <span class="current-price">₹${product.price.toLocaleString()}</span>
                        ${product.mrp ? `<span class="mrp-price">₹${product.mrp.toLocaleString()}</span>` : ""}
                    </div>
                    ${discount > 0 && product.inStock ? `<div class="discount-text">${discount}% OFF</div>` : ""}
                    ${
                      !product.inStock
                        ? `
                        <div class="out-of-stock-text">Will be back soon</div>
                        <button class="notify-me-btn" onclick="notifyMe('${product._id}')">
                            NOTIFY ME WHEN AVAILABLE
                        </button>
                    `
                        : `
                        <div class="view-details">
                            View Details <i class="fas fa-arrow-right"></i>
                        </div>
                    `
                    }
                </div>
            `;

  // Add click event to open product detail page (only for in-stock items)
  if (product.inStock) {
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking on notify button or discount text
      if (
        !e.target.classList.contains("notify-me-btn") &&
        !e.target.closest(".notify-me-btn") &&
        !e.target.classList.contains("discount-text")
      ) {
        openProductDetail(product._id);
      }
    });
  }

  return card;
}

// Open product detail page
function openProductDetail(productId) {
  showPageLoader("Loading product...");
  window.location.href = `product_cart.html?id=${productId}`;
}

function showPageLoader(message = "Loading...") {
  let loader = document.getElementById("pageNavLoader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "pageNavLoader";
    loader.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(255,255,255,0.88);
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 10px;
    `;
    loader.innerHTML = `
      <div style="width:36px;height:36px;border:3px solid #ddd;border-top-color:#111;border-radius:50%;animation:soulvardSpin .8s linear infinite;"></div>
      <div style="font-size:14px;color:#222;">${message}</div>
    `;
    document.body.appendChild(loader);
  }
  if (!document.getElementById("soulvardSpinStyle")) {
    const style = document.createElement("style");
    style.id = "soulvardSpinStyle";
    style.textContent =
      "@keyframes soulvardSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
  }
}

// Notify me when product is back in stock
async function notifyMe(productId) {
  const email = prompt(
    "Enter your email to get notified when this product is back in stock:",
  );

  if (!email) return;

  if (!validateEmail(email)) {
    showNotification("Please enter a valid email address.");
    return;
  }

  try {
    const response = await notificationsAPI.registerStockNotification(
      productId,
      email,
    );
    if (response.success) {
      showNotification(
        "You'll be notified when this product is back in stock!",
      );
    }
  } catch (error) {
    showError("Failed to register notification. Please try again.");
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Update cart count display
function updateCartCount() {
  document.querySelector(".cart-count").textContent = cartCount;
}

// Update wishlist count display
function updateWishlistCount() {
  document.querySelector(".wishlist-count").textContent = wishlistCount;
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
