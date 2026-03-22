// ===== FIXED HERO SLIDER FUNCTIONS =====
let currentSlideIndex = 0;
let totalSlides = 4;
let slideInterval;

// Initialize hero slider
function initializeHeroSlider() {
  updateSlideCounter();
  updateDots();
  startAutoplay();
}

// Update slide position - FIXED: No more gap
function updateSlidePosition() {
  const slidesContainer = document.getElementById("heroSlides");
  // Use percentage-based transform instead of vw to prevent gaps
  slidesContainer.style.transform = `translateX(-${currentSlideIndex * 25}%)`;

  updateSlideCounter();
  updateDots();
}

// Update slide counter
function updateSlideCounter() {
  const currentSlideElement = document.getElementById("currentSlide");
  if (currentSlideElement) {
    currentSlideElement.textContent = (currentSlideIndex + 1)
      .toString()
      .padStart(2, "0");
  }
}

// Update navigation dots
function updateDots() {
  const dots = document.querySelectorAll(".slider-dot");
  dots.forEach((dot, index) => {
    if (index === currentSlideIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Go to specific slide
function goToSlide(index) {
  currentSlideIndex = index;
  updateSlidePosition();
  resetAutoplay();
}

// Next slide
function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
  updateSlidePosition();
  resetAutoplay();
}

// Previous slide
function prevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
  resetAutoplay();
}

// Autoplay functions
function startAutoplay() {
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoplay() {
  clearInterval(slideInterval);
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// ===== TRUST BADGES SCROLLING =====
let currentBadgeIndex = 0;
const totalBadges = 4;

function scrollBadges(direction) {
  const badgesContainer = document.getElementById("badgesContainer");
  const badgeWidth = badgesContainer.offsetWidth;

  if (direction === "left") {
    currentBadgeIndex = Math.max(0, currentBadgeIndex - 1);
  } else {
    currentBadgeIndex = Math.min(totalBadges - 1, currentBadgeIndex + 1);
  }

  badgesContainer.scrollTo({
    left: currentBadgeIndex * (badgeWidth + 20),
    behavior: "smooth",
  });

  updateBadgeDots();
}

function goToBadge(index) {
  currentBadgeIndex = index;
  const badgesContainer = document.getElementById("badgesContainer");
  const badgeWidth = badgesContainer.offsetWidth;

  badgesContainer.scrollTo({
    left: index * (badgeWidth + 20),
    behavior: "smooth",
  });

  updateBadgeDots();
}

function updateBadgeDots() {
  const dots = document.querySelectorAll(".badge-dot");
  dots.forEach((dot, index) => {
    if (index === currentBadgeIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// ===== TESTIMONIALS SCROLLING =====
let currentTestimonialIndex = 0;
const totalTestimonials = 3;

function scrollTestimonials(direction) {
  const testimonialContainer = document.getElementById("testimonialContainer");
  const testimonialWidth = testimonialContainer.offsetWidth;

  if (direction === "left") {
    currentTestimonialIndex = Math.max(0, currentTestimonialIndex - 1);
  } else {
    currentTestimonialIndex = Math.min(
      totalTestimonials - 1,
      currentTestimonialIndex + 1,
    );
  }

  testimonialContainer.scrollTo({
    left: currentTestimonialIndex * (testimonialWidth + 20),
    behavior: "smooth",
  });

  updateTestimonialDots();
}

function goToTestimonial(index) {
  currentTestimonialIndex = index;
  const testimonialContainer = document.getElementById("testimonialContainer");
  const testimonialWidth = testimonialContainer.offsetWidth;

  testimonialContainer.scrollTo({
    left: index * (testimonialWidth + 20),
    behavior: "smooth",
  });

  updateTestimonialDots();
}

function updateTestimonialDots() {
  const dots = document.querySelectorAll(".testimonial-dot");
  dots.forEach((dot, index) => {
    if (index === currentTestimonialIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Initialize scrolling for mobile
function initializeMobileScrolling() {
  // Update scroll indicators visibility based on screen size
  const updateScrollIndicators = () => {
    const isMobile = window.innerWidth <= 768;
    const indicators = document.querySelectorAll(".scroll-indicator");
    indicators.forEach((indicator) => {
      indicator.style.display = isMobile ? "flex" : "none";
    });

    const badgeDots = document.getElementById("badgeNavDots");
    const testimonialDots = document.getElementById("testimonialNavDots");

    if (badgeDots) badgeDots.style.display = isMobile ? "flex" : "none";
    if (testimonialDots)
      testimonialDots.style.display = isMobile ? "flex" : "none";
  };

  updateScrollIndicators();
  window.addEventListener("resize", updateScrollIndicators);
}

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem("soulvardCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("soulvardWishlist")) || [];
const PRODUCTS_CACHE_KEY = "soulvardProductsCache";
const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000;

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", async function () {
  initializeHeroSlider();
  await syncHeaderCounts();
  setupNavScroll();
  setupSmoothScroll();
  initializeMobileScrolling();
  setupProductNavigationLoader();
  loadAndRenderProducts();

  // Newsletter form submission
  const newsletterBtn = document.querySelector(".newsletter-btn");
  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", function () {
      const email = document.querySelector(".newsletter-input").value;
      if (email) {
        showNotification("Thank you for subscribing!", "success");
        document.querySelector(".newsletter-input").value = "";
      }
    });
  }

  // Pause autoplay on hover
  const heroSliderContainer = document.querySelector(".hero-slider-container");
  if (heroSliderContainer) {
    heroSliderContainer.addEventListener("mouseenter", stopAutoplay);
    heroSliderContainer.addEventListener("mouseleave", startAutoplay);
  }

  // Add scroll event listeners for badges and testimonials
  const badgesContainer = document.getElementById("badgesContainer");
  const testimonialContainer = document.getElementById("testimonialContainer");

  if (badgesContainer) {
    badgesContainer.addEventListener("scroll", () => {
      const scrollLeft = badgesContainer.scrollLeft;
      const badgeWidth = badgesContainer.offsetWidth;
      currentBadgeIndex = Math.round(scrollLeft / (badgeWidth + 20));
      updateBadgeDots();
    });
  }

  if (testimonialContainer) {
    testimonialContainer.addEventListener("scroll", () => {
      const scrollLeft = testimonialContainer.scrollLeft;
      const testimonialWidth = testimonialContainer.offsetWidth;
      currentTestimonialIndex = Math.round(
        scrollLeft / (testimonialWidth + 20),
      );
      updateTestimonialDots();
    });
  }
});

async function syncHeaderCounts() {
  const user = getCurrentUser();

  // Initialize cart count to 0 if not logged in
  if (!user) {
    updateCartCount();
    updateWishlistCount();
    return;
  }

  try {
    const cartResponse = await cartAPI.get();
    if (cartResponse.success) {
      const items = cartResponse.data?.items || [];
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      updateCartCount();
      localStorage.setItem("cartCount", count);
    }
  } catch (e) {
    console.warn("Cart badge sync failed:", e);
    updateCartCount(); // Set to 0
  }

  try {
    const wishlistResponse = await wishlistAPI.get();
    if (wishlistResponse.success) {
      const count = (wishlistResponse.data?.items || []).length;
      document.querySelector(".wishlist-count").textContent = count;
      localStorage.setItem("wishlistCount", count);
    }
  } catch (e) {
    console.warn("Wishlist badge sync failed:", e);
  }
}

function showPageLoader(message = "Opening product...") {
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

function setupProductNavigationLoader() {
  document.addEventListener("click", function (e) {
    const productLink = e.target.closest("a.product-card");
    if (!productLink) return;
    e.preventDefault();
    showPageLoader("Loading product...");
    window.location.href = productLink.href;
  });
}

function getCachedProducts() {
  try {
    const cached = JSON.parse(localStorage.getItem(PRODUCTS_CACHE_KEY) || "{}");
    if (!cached.timestamp || !Array.isArray(cached.data)) return null;
    if (Date.now() - cached.timestamp > PRODUCTS_CACHE_TTL_MS) return null;
    return cached.data;
  } catch {
    return null;
  }
}

function setCachedProducts(products) {
  try {
    localStorage.setItem(
      PRODUCTS_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: products }),
    );
  } catch (error) {
    // Storage may be full/blocked; skip cache without breaking UI.
    console.warn("Products cache write skipped:", error);
  }
}

// ===== PRODUCT RENDERING - UPDATED TO MATCH MATCHING_PRODUCT.HTML =====
// ===== PRODUCT LOADING FROM API =====
let allProducts = [];

function renderGridLoader(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = `
    <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 2rem;">
      <div style="width:28px;height:28px;border:3px solid #ddd;border-top-color:#111;border-radius:50%;animation:soulvardSpin .8s linear infinite;"></div>
      <span style="font-size: 14px;">Loading products...</span>
    </div>
  `;
}

function renderAllGridLoaders() {
  renderGridLoader("topPicksGrid");
  renderGridLoader("newArrivalsGrid");
  renderGridLoader("matchingProductsGrid");
}

async function loadAndRenderProducts() {
  renderAllGridLoaders();

  try {
    console.log("Loading products from API...");
    const response = await productsAPI.getAll({ limit: 24 });
    console.log("API Response:", response);

    if (response.success && response.data) {
      allProducts = response.data;
      setCachedProducts(response.data);
      console.log(
        "Products loaded successfully:",
        allProducts.length,
        "products",
      );

      try {
        renderProducts(allProducts);
        console.log("Products rendered successfully");
      } catch (renderError) {
        console.error("Error rendering products:", renderError);
        showNotification(
          "Error displaying products: " + renderError.message,
          "error",
        );
      }
    } else {
      console.error("Failed to load products - Invalid response:", response);
      showNotification(
        "Failed to load products: " + (response.message || "Invalid response"),
        "error",
      );
    }
  } catch (error) {
    console.error("Error loading products API:", error);
    showNotification("Error loading products: " + error.message, "error");
  }
}

function renderProducts(products) {
  if (!products || !Array.isArray(products)) {
    throw new Error(
      "Invalid products data: expected array, got " + typeof products,
    );
  }

  console.log("Rendering products:", products.length);

  // Render Top Picks (first 6 products)
  renderProductGrid("topPicksGrid", products.slice(0, 6));

  // Render New Arrivals (next 6 products)
  renderProductGrid("newArrivalsGrid", products.slice(6, 12));

  // Render Matching Products (next 6 products)
  renderProductGrid("matchingProductsGrid", products.slice(12, 18));
}

function renderProductGrid(gridId, productList) {
  const grid = document.getElementById(gridId);
  if (!grid) {
    console.warn("Grid element not found:", gridId);
    return;
  }

  if (!productList || productList.length === 0) {
    console.log("No products to render for grid:", gridId);
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products available</p>';
    return;
  }

  try {
    grid.innerHTML = productList
      .map((product) => {
        if (!product || !(product._id || product.id)) {
          console.warn("Invalid product:", product);
          return "";
        }
        try {
          const productId = product._id || product.id;
          const price = Number(product.price) || 0;
          const mrp = Number(product.mrp) || 0;
          const discount =
            mrp > 0 && price > 0
              ? Math.max(0, Math.round(((mrp - price) / mrp) * 100))
              : 0;

          // Fallback image if product image is missing
          const defaultImage =
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
          const productImage =
            product.image ||
            (Array.isArray(product.colors)
              ? product.colors.find(
                  (c) => Array.isArray(c?.images) && c.images.length > 0,
                )?.images?.[0]
              : null) ||
            defaultImage;

          return `
            <a href="product_cart.html?id=${productId}" class="product-card">
              ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
              <div class="product-image-container">
                <div class="product-image" style="background-image: url('${productImage}'); background-size: cover; background-position: center;"></div>
              </div>
              <div class="product-info">
                <div class="product-name">${product.name || "Unnamed Product"}</div>
                <div class="product-price">
                  ₹${price.toLocaleString()}
                  ${mrp ? `<span class="mrp-price">₹${mrp.toLocaleString()}</span>` : ""}
                  ${discount > 0 ? `<span class="discount-percent">(${discount}% OFF)</span>` : ""}
                </div>
                <div class="view-product">View Product <i class="fas fa-arrow-right"></i></div>
              </div>
            </a>
          `;
        } catch (itemError) {
          console.error("Error rendering product card:", itemError, product);
          return "";
        }
      })
      .join("");

    console.log(`Rendered ${productList.length} products in grid: ${gridId}`);
  } catch (error) {
    console.error("Error rendering grid " + gridId + ":", error);
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Unable to display products right now.</p>';
  }
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
  // Check if user is logged in
  const user = getCurrentUser();
  if (!user) {
    showNotification("Please login to add items to cart", "error");
    setTimeout(() => {
      openLoginModal();
    }, 500);
    return;
  }

  const product = allProducts.find((p) => p._id === productId);
  if (!product) return;

  const defaultSize =
    product?.sizes?.find((s) => s?.inStock)?.size ||
    product?.sizes?.[0]?.size ||
    "One Size";
  const defaultColor =
    product?.colors?.find(
      (c) => Array.isArray(c?.images) && c.images.length > 0,
    )?.value ||
    product?.colors?.[0]?.value ||
    "default";

  cartAPI
    .add(productId, 1, defaultSize, defaultColor)
    .then((response) => {
      if (!response.success) {
        showNotification(response.message || "Failed to add to cart", "error");
        return;
      }
      cartCountFromResponse(response);
      showNotification(`${product.name} added to cart!`, "success");
    })
    .catch((error) => {
      showNotification("Error adding to cart: " + error.message, "error");
    });
}

function cartCountFromResponse(response) {
  const items = response?.data?.items || [];
  const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
  updateCartCount();
  localStorage.setItem("cartCount", count);
}

function updateCartCount() {
  const count = parseInt(localStorage.getItem("cartCount")) || 0;
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// ===== WISHLIST FUNCTIONS =====
function toggleWishlist(productId) {
  // Check if user is logged in
  const user = getCurrentUser();
  if (!user) {
    showNotification("Please login to add items to wishlist", "error");
    setTimeout(() => {
      openLoginModal();
    }, 500);
    return;
  }

  const product = allProducts.find((p) => p._id === productId);
  if (!product) return;

  const index = wishlist.findIndex((item) => item._id === productId);
  const request =
    index > -1 ? wishlistAPI.remove(productId) : wishlistAPI.add(productId);

  request
    .then((response) => {
      if (!response.success) {
        showNotification(
          response.message || "Failed to update wishlist",
          "error",
        );
        return;
      }
      if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${product.name} removed from wishlist`, "info");
      } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist`, "success");
      }
      try {
        localStorage.setItem("soulvardWishlist", JSON.stringify(wishlist));
      } catch (error) {
        console.warn("Wishlist cache write skipped:", error);
      }
      updateWishlistCount();
    })
    .catch((error) => {
      showNotification("Error updating wishlist: " + error.message, "error");
    });
}

function updateWishlistCount() {
  document.querySelector(".wishlist-count").textContent = wishlist.length;
  localStorage.setItem("wishlistCount", wishlist.length);
}

// ===== UI FUNCTIONS =====
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.background =
    type === "success" ? "var(--charcoal)" : "var(--text-light)";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
  document.body.style.overflow = menu.classList.contains("active")
    ? "hidden"
    : "auto";
}

// ===== SCROLL FUNCTIONS =====
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

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: "smooth",
        });
      }

      // Close mobile menu if open
      const menu = document.getElementById("mobileMenu");
      if (menu.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  });
}

function scrollToCollections() {
  document.getElementById("collections").scrollIntoView({ behavior: "smooth" });
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
  return "₹" + price.toLocaleString();
}
