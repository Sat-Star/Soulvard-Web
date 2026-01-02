// API integrated Index Page
let currentSlideIndex = 0;
let slideInterval;
let products = [];
let topPickProducts = [];
let currentProduct = null;
let heroImages = [];
let activePromotion = null;
let testimonials = [];
let currentTestimonialIndex = 0;

// Initialize page
document.addEventListener("DOMContentLoaded", async function () {
  // Check auth and redirect if needed
  if (!isLoggedIn()) {
    window.location.href = "/client/login.html";
    return;
  }

  // Load all data from API
  products = await getProducts();
  heroImages = await getHeroImages();
  activePromotion = await getActivePromotion();
  // testimonials endpoint not available yet, will remain empty array

  topPickProducts = products
    .filter((p) => p.category === "Top Picks" || products.indexOf(p) < 3)
    .slice(0, 3);

  // Initialize sliders
  initializeHeroSlider();
  initializeTestimonialSlider();
  loadPromotionFromAPI();
  loadTestimonialsFromAPI();
  renderTopPicks();
  renderNewArrivals();

  // Update cart count
  updateCartCount();
  updateWishlistCount();
});

// ===== HERO SLIDER =====
function initializeHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dot");
  const totalSlides = slides.length;

  // Update counter
  if (document.getElementById("total-slides")) {
    document.getElementById("total-slides").textContent =
      totalSlides < 10 ? "0" + totalSlides : totalSlides;
  }

  showSlide(0);
  startSlideInterval();
}

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".slider-dot");
const totalSlides = slides.length;
let wishlistItems = [];

// Initialize slide counter
if (document.getElementById("total-slides")) {
  document.getElementById("total-slides").textContent =
    totalSlides < 10 ? "0" + totalSlides : totalSlides;
}

// Hero slider functionality
function showSlide(n) {
  // Reset all slides
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Set new slide
  currentSlideIndex = (n + slides.length) % slides.length;
  slides[currentSlideIndex].classList.add("active");
  dots[currentSlideIndex].classList.add("active");

  // Update slide counter
  document.getElementById("current-slide").textContent =
    currentSlideIndex + 1 < 10
      ? "0" + (currentSlideIndex + 1)
      : currentSlideIndex + 1;
}

function currentSlide(n) {
  clearInterval(slideInterval);
  showSlide(n);
  startSlideInterval();
}

function nextSlide() {
  clearInterval(slideInterval);
  showSlide(currentSlideIndex + 1);
  startSlideInterval();
}

function prevSlide() {
  clearInterval(slideInterval);
  showSlide(currentSlideIndex - 1);
  startSlideInterval();
}

function startSlideInterval() {
  slideInterval = setInterval(() => {
    showSlide(currentSlideIndex + 1);
  }, 5000);
}

// Initialize slider
startSlideInterval();

// ===== TESTIMONIAL SLIDER =====
/**
 * Initialize testimonial slider after testimonials are loaded
 */
function initializeTestimonialSlider() {
  // This function is called after testimonials are loaded from API
  // The testimonial slides will be created dynamically by loadTestimonialsFromAPI()
  // This function sets up the slider functionality

  setTimeout(() => {
    const testimonialSlides = document.querySelectorAll(".testimonial-slide");
    if (testimonialSlides.length === 0) {
      console.warn("No testimonial slides found");
      return;
    }

    // Show first testimonial
    currentTestimonialIndex = 0;
    const testimonialTrack = document.getElementById("testimonialTrack");
    if (testimonialTrack) {
      testimonialTrack.style.transition = "transform 0.5s ease-in-out";
    }
  }, 100);
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

// Quick View Modal functionality
async function openQuickView(
  productName,
  price,
  imageUrl,
  productType,
  productId
) {
  const modal = document.getElementById("quickViewModal");
  const modalContent = document.getElementById("modalProductContent");

  // Store current product
  currentProduct = {
    _id: productId,
    name: productName,
    price: price,
    images: [imageUrl],
  };

  // Generate size options based on product type
  const sizeOptions = await generateSizeOptions(productType);

  // Generate color options based on product type
  const colorOptions = generateColorOptions(productType);

  modalContent.innerHTML = `
    <div class="modal-product-image" style="background-image: url('${imageUrl}')"></div>
    <div class="modal-product-info">
      <h3>${productName}</h3>
      <div class="price">${formatPrice(price)}</div>
      <div class="description">
        Experience the epitome of luxury with our ${productName.toLowerCase()}. Meticulously crafted from the finest materials, this piece embodies timeless elegance and sophisticated design. Perfect for those who appreciate quality and attention to detail.
      </div>
      
      <!-- Color Selection -->
      <div class="color-selection">
        <h4>SELECT COLOR</h4>
        <div class="color-options">
          ${colorOptions}
        </div>
      </div>
      
      <!-- Size Selection -->
      <div class="size-selection">
        <h4>SELECT SIZE</h4>
        <div class="size-options">
          ${sizeOptions}
        </div>
        <div class="size-chart-link" onclick="openSizeChart()">View Size Chart</div>
      </div>
      
      <div class="modal-actions">
        <button class="add-to-cart" onclick="addToCart('${productName}', ${price}, '${productId}'); closeModal()">ADD TO CART</button>
        <button class="wishlist-btn" id="wishlistBtn" onclick="toggleWishlist('${productName}', ${price}, '${imageUrl}', '${productId}')">
          <i class="far fa-heart"></i> ADD TO WISHLIST
        </button>
      </div>
    </div>
  `;

  // Check if product is already in wishlist
  if (isInWishlist(productId)) {
    const wishlistBtn = document.getElementById("wishlistBtn");
    wishlistBtn.classList.add("active");
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> IN WISHLIST';
  }

  modal.style.display = "flex";
}

// Generate size options based on product type (using API data)
async function generateSizeOptions(productType) {
  let sizes = [];

  // Try to fetch size chart from API
  const sizeChart = await getSizeChartByCategory(productType);
  if (sizeChart && sizeChart.sizes) {
    sizes = sizeChart.sizes.map((s) => s.size);
  } else {
    // Fallback to hardcoded defaults if API data not available
    switch (productType) {
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
      case "accessory":
        sizes = ["One Size"];
        break;
      default:
        sizes = ["XS", "S", "M", "L", "XL"];
    }
  }

  let html = "";
  sizes.forEach((size, index) => {
    const disabled = index === 2 ? "" : ""; // For demo, size M is available
    const selected = index === 2 ? "selected" : "";
    html += `<div class="size-option ${selected} ${disabled}" onclick="selectSize(this)">${size}</div>`;
  });

  return html;
}

// Generate color options based on product type
function generateColorOptions(productType) {
  let colors = [];

  switch (productType) {
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
    case "dress":
      colors = [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Burgundy", value: "#800020" },
        { name: "Emerald", value: "#50c878" },
      ];
      break;
    case "sweater":
      colors = [
        { name: "Camel", value: "#c19a6b" },
        { name: "Charcoal", value: "#36454f" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Cream", value: "#f8f5f0" },
      ];
      break;
    case "shoes":
      colors = [
        { name: "Brown", value: "#8b4513" },
        { name: "Black", value: "#000000" },
        { name: "Tan", value: "#d2b48c" },
        { name: "Burgundy", value: "#800020" },
      ];
      break;
    case "accessory":
      colors = [
        { name: "Black", value: "#000000" },
        { name: "Brown", value: "#8b4513" },
        { name: "Navy", value: "#1a1a2e" },
        { name: "Camel", value: "#c19a6b" },
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

  let html = "";
  colors.forEach((color, index) => {
    const selected = index === 0 ? "selected" : "";
    html += `
                    <div class="color-option-container">
                        <div class="color-option ${selected}" style="background-color: ${color.value}" onclick="selectColor(this)" title="${color.name}"></div>
                        <div class="color-name">${color.name}</div>
                    </div>
                `;
  });

  return html;
}

// Select size function
function selectSize(element) {
  // Remove selected class from all size options
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Add selected class to clicked option
  element.classList.add("selected");
}

// Select color function
function selectColor(element) {
  // Remove selected class from all color options
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Add selected class to clicked option
  element.classList.add("selected");
}

// Open size chart
function openSizeChart() {
  document.getElementById("sizeChartModal").style.display = "flex";
}

// Close size chart
function closeSizeChart() {
  document.getElementById("sizeChartModal").style.display = "none";
}

function closeModal() {
  document.getElementById("quickViewModal").style.display = "none";
}

// Close modal when clicking outside
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

// Toggle wishlist
function toggleWishlist(productName, price, imageUrl, productId) {
  const wishlistBtn = document.getElementById("wishlistBtn");
  const product = {
    _id: productId,
    name: productName,
    price: price,
    images: [imageUrl],
  };

  if (isInWishlist(productId)) {
    // Remove from wishlist
    removeFromWishlist(productId);
    wishlistBtn.classList.remove("active");
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i> ADD TO WISHLIST';
    showNotification(`${productName} removed from wishlist`, "info");
  } else {
    // Add to wishlist
    addToWishlist(product);
    wishlistBtn.classList.add("active");
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> IN WISHLIST';
    showNotification(`${productName} added to wishlist`, "success");
  }

  updateWishlistCount();
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const wishlistCounter = document.querySelector(".wishlist-count");
  if (wishlistCounter) {
    wishlistCounter.textContent = wishlist.length;
  }
}

// Add to Cart functionality
function addToCart(productName, price, productId) {
  const selectedSize = document.querySelector(".size-option.selected");
  const selectedColor = document.querySelector(".color-option.selected");

  const product = {
    _id: productId,
    name: productName,
    price: price,
    images: currentProduct?.images || [],
  };

  const sizeValue = selectedSize ? selectedSize.textContent.trim() : "";
  const colorValue = selectedColor ? selectedColor.style.backgroundColor : "";

  addToCart(product, 1, colorValue, sizeValue);

  showNotification(`${productName} added to cart!`, "success");
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${
                  type === "success"
                    ? "var(--gold)"
                    : type === "info"
                    ? "var(--charcoal)"
                    : "var(--gold)"
                };
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

function scrollToTopPicks() {
  document.getElementById("top-picks").scrollIntoView({ behavior: "smooth" });
}

function scrollToCollection() {
  document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
}

function learnMore() {
  alert(
    "Thank you for your interest in Soulvard. Our story continues to unfold..."
  );
}

// Smooth scroll for nav links
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// Load Promotion from API
function loadPromotionFromAPI() {
  if (!activePromotion) {
    // No active promotion, hide or show default message
    const banner = document.querySelector(".coupon-banner");
    if (banner) {
      banner.style.display = "none";
    }
    return;
  }

  // Update coupon code display
  const couponCodeEl = document.getElementById("couponCode");
  if (couponCodeEl && activePromotion.code) {
    couponCodeEl.textContent = activePromotion.code;
  }

  // Update promotion description
  const titleEl = document.querySelector(".coupon-banner h2");
  if (titleEl && activePromotion.title) {
    titleEl.textContent = activePromotion.title;
  }

  // Update promotion details
  const descEl = document.querySelector(
    ".coupon-banner > .coupon-content > p:nth-of-type(1)"
  );
  if (descEl && activePromotion.description) {
    descEl.textContent = activePromotion.description;
  }

  // Update timer with promotion end date if available
  if (activePromotion.endDate) {
    updatePromotionCountdown(new Date(activePromotion.endDate));
  }
}

// Update countdown based on promotion end date
function updatePromotionCountdown(endDate) {
  const updateTimer = () => {
    const now = new Date();
    const timeLeft = endDate - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById("days").textContent =
        days < 10 ? "0" + days : days;
      document.getElementById("hours").textContent =
        hours < 10 ? "0" + hours : hours;
      document.getElementById("minutes").textContent =
        minutes < 10 ? "0" + minutes : minutes;
      document.getElementById("seconds").textContent =
        seconds < 10 ? "0" + seconds : seconds;
    } else {
      const timerEl = document.querySelector(".coupon-timer");
      if (timerEl) {
        timerEl.innerHTML = "<p>Offer has expired</p>";
      }
      clearInterval(promotionTimerInterval);
    }
  };

  updateTimer();
  if (typeof promotionTimerInterval !== "undefined") {
    clearInterval(promotionTimerInterval);
  }
  promotionTimerInterval = setInterval(updateTimer, 1000);
}

let promotionTimerInterval;

// ===== TESTIMONIALS =====
/**
 * Load testimonials from API and populate slider
 */
function loadTestimonialsFromAPI() {
  const testimonialTrack = document.getElementById("testimonialTrack");
  const testimonialNav = document.getElementById("testimonialNav");

  if (!testimonialTrack) return;

  // Clear existing content
  testimonialTrack.innerHTML = "";
  if (testimonialNav) {
    testimonialNav.innerHTML = "";
  }

  if (!testimonials || testimonials.length === 0) {
    // If no testimonials from API, show placeholder
    testimonialTrack.innerHTML =
      '<div class="testimonial-slide"><p>No testimonials available</p></div>';
    return;
  }

  // Create slides for each testimonial
  testimonials.forEach((testimonial, index) => {
    const slide = document.createElement("div");
    slide.className = "testimonial-slide";

    const card = document.createElement("div");
    card.className = "testimonial-card";

    const text = document.createElement("p");
    text.className = "testimonial-text";
    text.textContent = testimonial.text || testimonial.content || "";

    const author = document.createElement("div");
    author.className = "testimonial-author";

    const avatar = document.createElement("div");
    avatar.className = "author-avatar";
    if (testimonial.avatar || testimonial.image) {
      avatar.style.backgroundImage = `url('${
        testimonial.avatar || testimonial.image
      }')`;
    }

    const authorInfo = document.createElement("div");
    authorInfo.className = "author-info";

    const authorName = document.createElement("div");
    authorName.className = "author-name";
    authorName.textContent =
      testimonial.name || testimonial.author || "Anonymous";

    const authorTitle = document.createElement("div");
    authorTitle.className = "author-title";
    authorTitle.textContent = testimonial.title || testimonial.position || "";

    authorInfo.appendChild(authorName);
    authorInfo.appendChild(authorTitle);
    author.appendChild(avatar);
    author.appendChild(authorInfo);

    card.appendChild(text);
    card.appendChild(author);
    slide.appendChild(card);
    testimonialTrack.appendChild(slide);

    // Create navigation dot for each testimonial
    if (testimonialNav) {
      const dot = document.createElement("div");
      dot.className =
        index === 0 ? "testimonial-dot active" : "testimonial-dot";
      dot.setAttribute("onclick", `currentTestimonial(${index})`);
      testimonialNav.appendChild(dot);
    }
  });

  // Initialize testimonial slider functionality
  currentTestimonialIndex = 0;
}

// Coupon Code Functionality
function copyCouponCode() {
  const couponCode = document.getElementById("couponCode");
  const textArea = document.createElement("textarea");
  textArea.value = couponCode.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  // Show notification
  showNotification("Coupon code copied to clipboard!", "success");

  // Visual feedback
  couponCode.style.background = "var(--light-gold)";
  setTimeout(() => {
    couponCode.style.background = "var(--gold)";
  }, 300);
}

// ===== PRODUCT RENDERING =====
/**
 * Render Top Picks products from API data
 */
function renderTopPicks() {
  const topPicksGrid = document.getElementById("topPicksGrid");
  if (!topPicksGrid || !topPickProducts || topPickProducts.length === 0) {
    return;
  }

  topPicksGrid.innerHTML = "";
  topPickProducts.forEach((product) => {
    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : "https://via.placeholder.com/300";
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <div class="product-badge">${product.badge || "FEATURED"}</div>
      <div class="product-image" style="background-image: url('${imageUrl}')">
        <div class="product-overlay">
          <div class="product-actions">
            <button class="quick-view" onclick="openQuickView('${
              product.name
            }', ${product.price}, '${imageUrl}', '${
      product.category
    }')">QUICK VIEW</button>
            <button class="add-to-cart" onclick="addToCart('${product.name}', ${
      product.price
    })">ADD TO CART</button>
          </div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">₹${product.price.toLocaleString()}</div>
      </div>
    `;
    topPicksGrid.appendChild(productCard);
  });
}

/**
 * Render New Arrivals products from API data
 */
function renderNewArrivals() {
  const newArrivalsGrid = document.getElementById("newArrivalsGrid");
  if (!newArrivalsGrid || !products || products.length === 0) {
    return;
  }

  newArrivalsGrid.innerHTML = "";
  // Show first 8 products as new arrivals
  const newArrivals = products.slice(0, 8);
  newArrivals.forEach((product) => {
    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : "https://via.placeholder.com/300";
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <div class="product-badge">NEW</div>
      <div class="product-image" style="background-image: url('${imageUrl}')">
        <div class="product-overlay">
          <div class="product-actions">
            <button class="quick-view" onclick="openQuickView('${
              product.name
            }', ${product.price}, '${imageUrl}', '${
      product.category
    }')">QUICK VIEW</button>
            <button class="add-to-cart" onclick="addToCart('${product.name}', ${
      product.price
    })">ADD TO CART</button>
          </div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">₹${product.price.toLocaleString()}</div>
      </div>
    `;
    newArrivalsGrid.appendChild(productCard);
  });
}

// Countdown Timer
function updateCountdown() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const timeLeft = endOfMonth - now;

  if (timeLeft > 0) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days < 10 ? "0" + days : days;
    document.getElementById("hours").textContent =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").textContent =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").textContent =
      seconds < 10 ? "0" + seconds : seconds;
  } else {
    document.querySelector(".coupon-timer").innerHTML =
      "<p>Offer has expired</p>";
  }
}

// Initialize countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// Testimonial Slider Functionality - Updated for dynamic testimonials
function showTestimonial(n) {
  // Get slides dynamically
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");
  const testimonialTrack = document.getElementById("testimonialTrack");

  if (testimonialSlides.length === 0) {
    console.warn("No testimonial slides available");
    return;
  }

  // Validate index
  n = (n + testimonialSlides.length) % testimonialSlides.length;

  // Update active dot if dots exist
  if (testimonialDots && testimonialDots.length > 0) {
    testimonialDots.forEach((dot) => {
      dot.classList.remove("active");
    });
    if (testimonialDots[n]) {
      testimonialDots[n].classList.add("active");
    }
  }

  // Move track
  if (testimonialTrack) {
    testimonialTrack.style.transform = `translateX(-${n * 100}%)`;
  }
  currentTestimonialIndex = n;
}

function nextTestimonial() {
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  if (testimonialSlides.length === 0) return;
  let nextIndex = (currentTestimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(nextIndex);
}

function prevTestimonial() {
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  if (testimonialSlides.length === 0) return;
  let prevIndex =
    (currentTestimonialIndex - 1 + testimonialSlides.length) %
    testimonialSlides.length;
  showTestimonial(prevIndex);
}

function currentTestimonial(n) {
  showTestimonial(n);
}

// Auto-advance testimonials
setInterval(nextTestimonial, 6000);

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
