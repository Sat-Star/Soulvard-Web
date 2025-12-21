let cartCount = 0;
let wishlistCount = 0;
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".slider-dot");
const totalSlides = slides.length;
let slideInterval;
let wishlistItems = [];

// Initialize slide counter
document.getElementById("total-slides").textContent =
  totalSlides < 10 ? "0" + totalSlides : totalSlides;

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
function openQuickView(productName, price, imageUrl, productType) {
  const modal = document.getElementById("quickViewModal");
  const modalContent = document.getElementById("modalProductContent");

  // Generate size options based on product type
  const sizeOptions = generateSizeOptions(productType);

  // Generate color options based on product type
  const colorOptions = generateColorOptions(productType);

  modalContent.innerHTML = `
                <div class="modal-product-image" style="background-image: url('${imageUrl}')"></div>
                <div class="modal-product-info">
                    <h3>${productName}</h3>
                    <div class="price">₹${(price * 83).toLocaleString(
                      "en-IN"
                    )}</div>
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
                        <button class="add-to-cart" onclick="addToCart('${productName}', ${price}); closeModal()">ADD TO CART</button>
                        <button class="wishlist-btn" id="wishlistBtn" onclick="toggleWishlist('${productName}', ${price}, '${imageUrl}')">
                            <i class="far fa-heart"></i> ADD TO WISHLIST
                        </button>
                    </div>
                </div>
            `;

  // Check if product is already in wishlist
  const isInWishlist = wishlistItems.some((item) => item.name === productName);
  if (isInWishlist) {
    const wishlistBtn = document.getElementById("wishlistBtn");
    wishlistBtn.classList.add("active");
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> IN WISHLIST';
  }

  modal.style.display = "flex";
}

// Generate size options based on product type
function generateSizeOptions(productType) {
  let sizes = [];

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
function toggleWishlist(productName, price, imageUrl) {
  const wishlistBtn = document.getElementById("wishlistBtn");
  const isInWishlist = wishlistItems.some((item) => item.name === productName);

  if (isInWishlist) {
    // Remove from wishlist
    wishlistItems = wishlistItems.filter((item) => item.name !== productName);
    wishlistCount--;
    wishlistBtn.classList.remove("active");
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i> ADD TO WISHLIST';

    // Show notification
    showNotification(`${productName} removed from wishlist`, "info");
  } else {
    // Add to wishlist
    wishlistItems.push({
      name: productName,
      price: price,
      image: imageUrl,
    });
    wishlistCount++;
    wishlistBtn.classList.add("active");
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> IN WISHLIST';

    // Show notification
    showNotification(`${productName} added to wishlist`, "success");
  }

  // Update wishlist count
  document.querySelector(".wishlist-count").textContent = wishlistCount;
  document.querySelector(".wishlist-count").style.animation = "none";
  setTimeout(() => {
    document.querySelector(".wishlist-count").style.animation =
      "pulse 0.3s ease";
  }, 10);
}

// Add to Cart functionality
function addToCart(productName, price) {
  cartCount++;
  document.querySelector(".cart-count").textContent = cartCount;
  document.querySelector(".cart-count").style.animation = "none";
  const inrPrice = (price * 83).toLocaleString("en-IN");
  setTimeout(() => {
    document.querySelector(".cart-count").style.animation = "pulse 0.3s ease";
  }, 10);

  // Show confirmation message
  showNotification(`${productName} (₹${inrPrice}) added to cart!`, "success");
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

// Testimonial Slider Functionality
let currentTestimonialIndex = 0;
const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const testimonialDots = document.querySelectorAll(".testimonial-dot");
const testimonialTrack = document.getElementById("testimonialTrack");

function showTestimonial(n) {
  // Update active dot
  testimonialDots.forEach((dot) => {
    dot.classList.remove("active");
  });
  testimonialDots[n].classList.add("active");

  // Move track
  testimonialTrack.style.transform = `translateX(-${n * 100}%)`;
  currentTestimonialIndex = n;
}

function nextTestimonial() {
  let nextIndex = (currentTestimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(nextIndex);
}

function prevTestimonial() {
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
