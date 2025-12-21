// Product data - can be expanded in the future
const products = [
  {
    id: 1,
    name: "SILK SHIRT",
    price: 24917,
    category: "shirts",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipMeETOZyJ9SssdJp9_3_6iw6rgtCjQGQ3YPG6XU=s1360-w1360-h1020-rw",
    badge: "BESTSELLER",
    type: "shirt",
  },
  {
    id: 2,
    name: "TAILORED TROUSERS",
    price: 33117,
    category: "trousers",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipMIV1C6dppvP91qcgn6e8qDTcH0HCE2Qc5wWtQK=s1360-w1360-h1020-rw",
    badge: "NEW",
    type: "trousers",
  },
  {
    id: 3,
    name: "CASHMERE COAT",
    price: 74617,
    category: "coats",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipNr0mFeR5VZCqBpOqWRtRu5KPF5IwHPqJMw_DZy=s1360-w1360-h1020-rw",
    badge: "",
    type: "coat",
  },
  {
    id: 4,
    name: "LEATHER JACKET",
    price: 66317,
    category: "jackets",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipOyDO0gOBgzsgwSq-kyEpGvVC-96Xvkuvp-N1EH=s1360-w1360-h1020-rw",
    badge: "LIMITED",
    type: "jacket",
  },
  {
    id: 5,
    name: "WOOL BLAZER",
    price: 49717,
    category: "blazers",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "NEW",
    type: "blazer",
  },
  {
    id: 6,
    name: "LINEN SHIRT",
    price: 23157,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1815&q=80",
    badge: "",
    type: "shirt",
  },
  {
    id: 7,
    name: "SUEDE BOOTS",
    price: 53867,
    category: "shoes",
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "LIMITED",
    type: "shoes",
  },
  {
    id: 8,
    name: "CASHMERE SWEATER",
    price: 38097,
    category: "sweaters",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
    badge: "BESTSELLER",
    type: "sweater",
  },
  {
    id: 9,
    name: "EVENING DRESS",
    price: 66317,
    category: "dresses",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "NEW",
    type: "dress",
  },
  {
    id: 10,
    name: "SILK SCARF",
    price: 12457,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1582142306909-195724d1a6ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "",
    type: "accessory",
  },
  {
    id: 11,
    name: "DENIM JACKET",
    price: 29817,
    category: "jackets",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "",
    type: "jacket",
  },
  {
    id: 12,
    name: "LEATHER BELT",
    price: 8297,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    badge: "",
    type: "accessory",
  },
  {
    id: 13,
    name: "COTTON SHIRT",
    price: 21517,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "",
    type: "shirt",
  },
  {
    id: 14,
    name: "WINTER COAT",
    price: 58097,
    category: "coats",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "BESTSELLER",
    type: "coat",
  },
  {
    id: 15,
    name: "LINEN TROUSERS",
    price: 24817,
    category: "trousers",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "",
    type: "trousers",
  },
  {
    id: 16,
    name: "KNIT SWEATER",
    price: 29817,
    category: "sweaters",
    image:
      "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    badge: "NEW",
    type: "sweater",
  },
];

// DOM elements
const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const quickViewModal = document.getElementById("quickViewModal");
const modalProductContent = document.getElementById("modalProductContent");
const sizeChartModal = document.getElementById("sizeChartModal");

// State variables
let currentCategory = "all";
let currentSort = "featured";
let visibleProducts = 8;
let cartCount = 0;
let wishlistCount = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  setupEventListeners();
  updateCartCount();
  updateWishlistCount();
});

// Set up event listeners
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");
      // Update current category
      currentCategory = this.getAttribute("data-category");
      // Reset visible products
      visibleProducts = 8;
      // Render products
      renderProducts();
    });
  });

  // Sort select
  sortSelect.addEventListener("change", function () {
    currentSort = this.value;
    renderProducts();
  });

  // Load more button
  loadMoreBtn.addEventListener("click", function () {
    visibleProducts += 8;
    renderProducts();
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === quickViewModal) {
      closeModal();
    }
    if (event.target === sizeChartModal) {
      closeSizeChart();
    }
  });
}

// Render products based on current filters and sort
function renderProducts() {
  // Filter products
  let filteredProducts = products;
  if (currentCategory !== "all") {
    filteredProducts = products.filter(
      (product) => product.category === currentCategory
    );
  }

  // Sort products
  filteredProducts = sortProducts(filteredProducts, currentSort);

  // Update product count
  productCount.textContent = `Showing ${Math.min(
    visibleProducts,
    filteredProducts.length
  )} of ${filteredProducts.length} products`;

  // Show/hide load more button
  if (visibleProducts >= filteredProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  // Clear product grid
  productGrid.innerHTML = "";

  // Render products
  const productsToShow = filteredProducts.slice(0, visibleProducts);
  productsToShow.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

// Sort products based on selected option
function sortProducts(products, sortBy) {
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

// Create product card HTML
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
                <div class="product-image" style="background-image: url('${
                  product.image
                }')">
                    ${
                      product.badge
                        ? `<div class="product-badge">${product.badge}</div>`
                        : ""
                    }
                    <div class="product-overlay">
                        <div class="product-actions">
                            <button class="quick-view" onclick="openQuickView(${
                              product.id
                            })">QUICK VIEW</button>
                            <button class="add-to-cart" onclick="addToCart(${
                              product.id
                            })">ADD TO CART</button>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString()}</p>
                </div>
            `;
  return card;
}

// Open quick view modal
function openQuickView(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  modalProductContent.innerHTML = `
                <div class="modal-product-image" style="background-image: url('${
                  product.image
                }')"></div>
                <div class="modal-product-info">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price.toLocaleString()}</p>
                    <p class="description">Experience luxury and comfort with our premium ${product.name.toLowerCase()}. Crafted from the finest materials with attention to detail, this piece embodies sophistication and style.</p>
                    
                    ${
                      product.type === "shirt" ||
                      product.type === "coat" ||
                      product.type === "blazer" ||
                      product.type === "jacket" ||
                      product.type === "sweater" ||
                      product.type === "dress"
                        ? `
                    <div class="size-selection">
                        <h4>SELECT SIZE</h4>
                        <div class="size-options">
                            <div class="size-option">XS</div>
                            <div class="size-option selected">S</div>
                            <div class="size-option">M</div>
                            <div class="size-option">L</div>
                            <div class="size-option">XL</div>
                        </div>
                        <a class="size-chart-link" onclick="openSizeChart()">Size Chart</a>
                    </div>
                    `
                        : ""
                    }
                    
                    ${
                      product.type === "shirt" ||
                      product.type === "sweater" ||
                      product.type === "dress"
                        ? `
                    <div class="color-selection">
                        <h4>SELECT COLOR</h4>
                        <div class="color-options">
                            <div class="color-option-container">
                                <div class="color-option selected" style="background-color: #1a1a1a;"></div>
                                <span class="color-name">Black</span>
                            </div>
                            <div class="color-option-container">
                                <div class="color-option" style="background-color: #f8f5f0;"></div>
                                <span class="color-name">Cream</span>
                            </div>
                            <div class="color-option-container">
                                <div class="color-option" style="background-color: #c9a96e;"></div>
                                <span class="color-name">Gold</span>
                            </div>
                        </div>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="modal-actions">
                        <button class="add-to-cart" onclick="addToCart(${
                          product.id
                        })">ADD TO CART</button>
                        <button class="wishlist-btn" onclick="toggleWishlist(${
                          product.id
                        })">
                            <span>❤️</span> ADD TO WISHLIST
                        </button>
                    </div>
                </div>
            `;

  // Add event listeners to size options
  const sizeOptions = modalProductContent.querySelectorAll(".size-option");
  sizeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      sizeOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  // Add event listeners to color options
  const colorOptions = modalProductContent.querySelectorAll(".color-option");
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      colorOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  quickViewModal.style.display = "flex";
}

// Close quick view modal
function closeModal() {
  quickViewModal.style.display = "none";
}

// Open size chart modal
function openSizeChart() {
  sizeChartModal.style.display = "flex";
}

// Close size chart modal
function closeSizeChart() {
  sizeChartModal.style.display = "none";
}

// Add product to cart
function addToCart(productId) {
  cartCount++;
  updateCartCount();

  // Show confirmation (in a real app, this would add to cart storage)
  alert("Product added to cart!");

  // Close modal if open
  closeModal();
}

// Toggle product in wishlist
function toggleWishlist(productId) {
  const wishlistBtn = document.querySelector(".wishlist-btn");

  if (wishlistBtn.classList.contains("active")) {
    wishlistCount--;
    wishlistBtn.classList.remove("active");
    wishlistBtn.innerHTML = "<span>❤️</span> ADD TO WISHLIST";
  } else {
    wishlistCount++;
    wishlistBtn.classList.add("active");
    wishlistBtn.innerHTML = "<span>❤️</span> ADDED TO WISHLIST";
  }

  updateWishlistCount();
}

// Update cart count display
function updateCartCount() {
  document.querySelector(".cart-count").textContent = cartCount;
}

// Update wishlist count display
function updateWishlistCount() {
  document.querySelector(".wishlist-count").textContent = wishlistCount;
}

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
