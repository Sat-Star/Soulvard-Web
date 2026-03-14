// Enhanced product data for collections with stock status
const collectionsProducts = [
  {
    id: 1,
    name: "Premium Cotton Hoodie",
    price: 3499,
    mrp: 4999,
    category: "hoodie",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "BESTSELLER",
    inStock: true,
  },
  {
    id: 2,
    name: "Classic Fit T-Shirt",
    price: 1999,
    mrp: 2999,
    category: "t-shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "NEW ARRIVAL",
    inStock: false,
  },
  {
    id: 3,
    name: "Graphic Print Hoodie",
    price: 3999,
    mrp: 5499,
    category: "hoodie",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "GRAPHIC",
    inStock: true,
  },
  {
    id: 4,
    name: "Oversized T-Shirt",
    price: 2299,
    mrp: 3299,
    category: "t-shirt",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "OVERSIZED",
    inStock: true,
  },
  {
    id: 5,
    name: "Silk Elegance Shirt",
    price: 24999,
    mrp: 32999,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "PREMIUM",
    inStock: true,
  },
  {
    id: 6,
    name: "Tailored Wool Trousers",
    price: 33199,
    mrp: 41999,
    category: "trousers",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "NEW ARRIVAL",
    inStock: false,
  },
  {
    id: 7,
    name: "Graphic Logo Hoodie",
    price: 4299,
    mrp: 5999,
    category: "hoodie",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "LOGO",
    inStock: true,
  },
  {
    id: 8,
    name: "Striped T-Shirt",
    price: 1799,
    mrp: 2499,
    category: "t-shirt",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "STRIPED",
    inStock: true,
  },
  {
    id: 9,
    name: "Cashmere Heritage Coat",
    price: 74699,
    mrp: 89999,
    category: "coats",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "LIMITED EDITION",
    inStock: true,
  },
  {
    id: 10,
    name: "Artisan Leather Jacket",
    price: 66399,
    mrp: 79999,
    category: "jackets",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "HANDCRAFTED",
    inStock: false,
  },
  {
    id: 11,
    name: "Zipped Hoodie",
    price: 3799,
    mrp: 4999,
    category: "hoodie",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "ZIPPERED",
    inStock: true,
  },
  {
    id: 12,
    name: "Vintage Print T-Shirt",
    price: 2499,
    mrp: 3499,
    category: "t-shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "VINTAGE",
    inStock: true,
  },
  {
    id: 13,
    name: "Wool Bespoke Blazer",
    price: 49799,
    mrp: 62999,
    category: "blazers",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "PREMIUM",
    inStock: true,
  },
  {
    id: 14,
    name: "Linen Craft Shirt",
    price: 23199,
    mrp: 29999,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1815&q=80",
    badge: "SUSTAINABLE",
    inStock: true,
  },
  {
    id: 15,
    name: "Pullover Hoodie",
    price: 3199,
    mrp: 4499,
    category: "hoodie",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "PULLOVER",
    inStock: false,
  },
  {
    id: 16,
    name: "Basic Crewneck T-Shirt",
    price: 1499,
    mrp: 1999,
    category: "t-shirt",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "BASIC",
    inStock: true,
  },
];

// DOM elements
const collectionsGrid = document.getElementById("collectionsGrid");
const categoryTabs = document.querySelectorAll(".category-tab");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// State variables - FIXED: Added load more functionality
let currentCategory = "all";
let currentSort = "featured";
let visibleProducts = 8;
let cartCount = 0;
let wishlistCount = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  renderCollectionsProducts();
  setupEventListeners();
  updateCartCount();
  updateWishlistCount();
  setupNavScroll();
});

// Set up event listeners - FIXED: Added load more event listener
function setupEventListeners() {
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
    filteredProducts = collectionsProducts.filter(
      (product) => product.category === currentCategory,
    );
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

  card.innerHTML = `
                <div class="matching-image-container">
                    <div class="matching-product-image" style="background-image: url('${product.image}')"></div>
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
                        <button class="notify-me-btn" onclick="notifyMe(${product.id})">
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
        openProductDetail(product.id);
      }
    });
  }

  return card;
}

// Open product detail page (simulated)
function openProductDetail(productId) {
  const product = collectionsProducts.find((p) => p.id === productId);
  if (!product) return;

  showNotification(`Opening ${product.name} details...`);

  // Simulate navigation to product page
  setTimeout(() => {
    // This would be: window.location.href = `product-detail.html?id=${product.id}`;
    console.log(`Navigating to product detail page for ${product.name}`);
  }, 500);
}

// Notify me when available
function notifyMe(productId) {
  const product = collectionsProducts.find((p) => p.id === productId);
  if (!product) return;

  const email = prompt(
    `Enter your email to get notified when "${product.name}" is back in stock:`,
  );

  if (email && validateEmail(email)) {
    showNotification(
      `You'll be notified when ${product.name} is back in stock!`,
    );
    // In a real app, you would send this to your backend
    console.log(
      `Notification requested for product ${productId} from email: ${email}`,
    );
  } else if (email) {
    showNotification("Please enter a valid email address.");
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
