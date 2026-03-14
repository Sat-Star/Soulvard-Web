// Enhanced product data for matching products with stock status
const matchingProducts = [
  {
    id: 1,
    name: "Duo Moqueen x Sally Tees",
    price: 3599,
    mrp: 4999,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "BESTSELLER",
    inStock: true,
  },
  {
    id: 2,
    name: "Duo Somebody's Problem x Love Tees",
    price: 3799,
    mrp: 4999,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "NEW",
    inStock: false,
  },
  {
    id: 3,
    name: "Classic Couple White Tees",
    price: 2999,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "CLASSIC",
    inStock: true,
  },
  {
    id: 4,
    name: "His & Hers Graphic Tees",
    price: 4199,
    mrp: 5499,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "GRAPHIC",
    inStock: true,
  },
  {
    id: 5,
    name: "Matching Black Hoodies",
    price: 6499,
    mrp: 7999,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "PREMIUM",
    inStock: true,
  },
  {
    id: 6,
    name: "His & Hers Zip Hoodies",
    price: 6999,
    mrp: 8999,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "ZIPPERED",
    inStock: false,
  },
  {
    id: 7,
    name: "Matching Grey Pullover Hoodies",
    price: 5799,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "PULLOVER",
    inStock: true,
  },
  {
    id: 8,
    name: "Couple Graphic Hoodies",
    price: 7299,
    mrp: 8999,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "GRAPHIC",
    inStock: true,
  },
  {
    id: 9,
    name: "Trio Black Tees Set",
    price: 4899,
    mrp: 5999,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "TRIO",
    inStock: false,
  },
  {
    id: 10,
    name: "Friends Trio White Tees",
    price: 4599,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "FRIENDS",
    inStock: true,
  },
  {
    id: 11,
    name: "Family Matching Tees",
    price: 5399,
    mrp: 6999,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "FAMILY",
    inStock: true,
  },
  {
    id: 12,
    name: "Squad Graphic Tees",
    price: 4999,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "SQUAD",
    inStock: false,
  },
  {
    id: 13,
    name: "Duo Heart Pattern Tees",
    price: 3399,
    mrp: 4299,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "LOVE",
    inStock: true,
  },
  {
    id: 14,
    name: "Matching Denim Look Tees",
    price: 3899,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "DENIM",
    inStock: true,
  },
  {
    id: 15,
    name: "His & Hers Striped Tees",
    price: 3199,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "STRIPED",
    inStock: false,
  },
  {
    id: 16,
    name: "Couple Vintage Tees",
    price: 4099,
    mrp: 5299,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "VINTAGE",
    inStock: true,
  },
  {
    id: 17,
    name: "Matching Crewneck Hoodies",
    price: 6199,
    mrp: 7999,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "CREWNECK",
    inStock: true,
  },
  {
    id: 18,
    name: "His & Hers Embroidered Hoodies",
    price: 7599,
    mrp: 9999,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "EMBROIDERED",
    inStock: false,
  },
  {
    id: 19,
    name: "Matching Camo Hoodies",
    price: 6899,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "CAMO",
    inStock: true,
  },
  {
    id: 20,
    name: "Couple Oversized Hoodies",
    price: 6699,
    category: "couple-hoodies",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "OVERSIZED",
    inStock: true,
  },
  {
    id: 21,
    name: "Trio Graphic Tees Set",
    price: 5299,
    mrp: 6499,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "GRAPHIC",
    inStock: false,
  },
  {
    id: 22,
    name: "Best Friends Trio Tees",
    price: 4799,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "BEST FRIENDS",
    inStock: true,
  },
  {
    id: 23,
    name: "Siblings Matching Tees",
    price: 4999,
    mrp: 5999,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "SIBLINGS",
    inStock: true,
  },
  {
    id: 24,
    name: "Trio Vintage Tees",
    price: 5499,
    category: "trio-tees",
    image:
      "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "VINTAGE",
    inStock: false,
  },
  {
    id: 25,
    name: "Duo Minimalist Tees",
    price: 2899,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "MINIMAL",
    inStock: true,
  },
  {
    id: 26,
    name: "His & Hers Script Tees",
    price: 3699,
    mrp: 4599,
    category: "couple-tshirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    badge: "SCRIPT",
    inStock: true,
  },
];

// DOM elements
const matchingGrid = document.getElementById("matchingGrid");
const categoryTabs = document.querySelectorAll(".category-tab");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// State variables
let currentCategory = "all";
let currentSort = "best-selling";
let visibleProducts = 12;
let cartCount = 0;
let wishlistCount = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  renderMatchingProducts();
  setupEventListeners();
  updateCartCount();
  updateWishlistCount();
  setupNavScroll();
});

// Set up event listeners
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
      // Reset visible products
      visibleProducts = 12;
      // Render products
      renderMatchingProducts();
    });
  });

  // Sort select
  sortSelect.addEventListener("change", function () {
    currentSort = this.value;
    renderMatchingProducts();
  });

  // Load more button
  loadMoreBtn.addEventListener("click", function () {
    visibleProducts += 12;
    renderMatchingProducts();
  });
}

// Render matching products based on current filters and sort
function renderMatchingProducts() {
  // Filter products
  let filteredProducts = matchingProducts;
  if (currentCategory !== "all") {
    filteredProducts = matchingProducts.filter(
      (product) => product.category === currentCategory,
    );
  }

  // Sort products
  filteredProducts = sortMatchingProducts(filteredProducts, currentSort);

  // Update product count
  const showingCount = Math.min(visibleProducts, filteredProducts.length);
  const inStockCount = filteredProducts.filter((p) => p.inStock).length;
  const outOfStockCount = filteredProducts.filter((p) => !p.inStock).length;
  productCount.textContent = `${showingCount} products (${inStockCount} in stock, ${outOfStockCount} out of stock)`;

  // Show/hide load more button
  if (visibleProducts >= filteredProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  // Clear product grid
  matchingGrid.innerHTML = "";

  // Render products
  const productsToShow = filteredProducts.slice(0, visibleProducts);
  productsToShow.forEach((product) => {
    const productCard = createMatchingProductCard(product);
    matchingGrid.appendChild(productCard);
  });
}

// Sort products based on selected option
function sortMatchingProducts(products, sortBy) {
  switch (sortBy) {
    case "newest":
      return [...products].sort((a, b) => b.id - a.id);
    case "price-low":
      return [...products].sort((a, b) => a.price - b.price);
    case "price-high":
      return [...products].sort((a, b) => b.price - a.price);
    case "availability":
      return [...products].sort((a, b) => {
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        return 0;
      });
    case "best-selling":
    default:
      return products;
  }
}

// Create matching product card HTML - PREMIUM with Out of Stock state
function createMatchingProductCard(product) {
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
                    <div class="matching-price">
                        ₹${product.price.toLocaleString()}
                        ${product.mrp ? `<span style="font-family: var(--font-primary); font-size: 0.9rem; color: ${!product.inStock ? "var(--out-of-stock-gray)" : "var(--text-light)"}; text-decoration: line-through; margin-left: 0.8rem; font-weight: 300;">₹${product.mrp.toLocaleString()}</span>` : ""}
                        ${discount > 0 && product.inStock ? `<span style="font-family: var(--font-primary); font-size: 0.85rem; color: var(--discount-red); margin-left: 0.5rem; font-weight: 500;">(${discount}% OFF)</span>` : ""}
                    </div>
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
      if (!e.target.classList.contains("notify-me-btn")) {
        openProductDetail(product.id);
      }
    });
  }

  return card;
}

// Open product detail page (simulated)
function openProductDetail(productId) {
  const product = matchingProducts.find((p) => p.id === productId);
  if (!product) return;

  // In a real app, this would redirect to a product detail page
  // For now, we'll show a notification
  showNotification(`Opening ${product.name} details...`);

  // Simulate navigation to product page
  setTimeout(() => {
    // This would be: window.location.href = `product-detail.html?id=${product.id}`;
    console.log(`Navigating to product detail page for ${product.name}`);
  }, 500);
}

// Notify me when available
function notifyMe(productId) {
  const product = matchingProducts.find((p) => p.id === productId);
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

// Add product to cart
function addToCart(productId) {
  const product = matchingProducts.find((p) => p.id === productId);
  if (!product) return;

  cartCount++;
  updateCartCount();

  // Show notification
  showNotification(`${product.name} added to cart!`);
}

// Toggle product in wishlist
function toggleWishlist(productId, button) {
  const product = matchingProducts.find((p) => p.id === productId);
  if (!product) return;

  const isInWishlist = false; // In real app, check from localStorage

  if (isInWishlist) {
    wishlistCount--;
    button.innerHTML = '<i class="far fa-heart"></i>';
    showNotification(`${product.name} removed from wishlist`);
  } else {
    wishlistCount++;
    button.innerHTML = '<i class="fas fa-heart"></i>';
    showNotification(`${product.name} added to wishlist`);
  }

  updateWishlistCount();
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
