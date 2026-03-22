// Product Data - will be loaded from API
let product = null;

// State variables
let selectedColor = null;
let selectedSize = "S";
let quantity = 1;
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
let wishlistCount = parseInt(localStorage.getItem("wishlistCount")) || 0;
let isProductInWishlist = localStorage.getItem("productInWishlist") === "true";
async function syncHeaderCounts() {
  const user = getCurrentUser();
  if (!user) {
    cartCount = 0;
    wishlistCount = 0;
    updateCartCount();
    updateWishlistCount();
    return;
  }

  try {
    const cartResponse = await cartAPI.get();
    if (cartResponse.success) {
      cartCount = (cartResponse.data?.items || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
      localStorage.setItem("cartCount", cartCount);
    }
  } catch (e) {
    console.warn("Could not sync cart count:", e);
  }

  try {
    const wishlistResponse = await wishlistAPI.get();
    if (wishlistResponse.success) {
      wishlistCount = (wishlistResponse.data?.items || []).length;
      localStorage.setItem("wishlistCount", wishlistCount);
    }
  } catch (e) {
    console.warn("Could not sync wishlist count:", e);
  }

  updateCartCount();
  updateWishlistCount();
}

function showProductLoader(message = "Loading product...") {
  let loader = document.getElementById("productPageLoader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "productPageLoader";
    loader.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(255,255,255,0.9);
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

function hideProductLoader() {
  const loader = document.getElementById("productPageLoader");
  if (loader) loader.remove();
}

function getDisplayColors() {
  const colors = Array.isArray(product?.colors) ? product.colors : [];
  const colorsWithImages = colors.filter(
    (color) => Array.isArray(color?.images) && color.images.length > 0,
  );

  if (colorsWithImages.length > 0) return colorsWithImages;

  const fallbackImage = product?.image;
  if (fallbackImage) {
    return [
      {
        name: "Default",
        value: "default",
        hex: "#000000",
        images: [fallbackImage],
      },
    ];
  }

  return [];
}

// Get product ID from URL parameter
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Load product from API
async function loadProductData() {
  try {
    const productId = getProductIdFromURL();
    if (!productId) {
      showNotification("Product ID not found", "error");
      return false;
    }

    console.log("Loading product:", productId);
    const response = await productsAPI.getById(productId);
    console.log("Product API Response:", response);

    if (response.success && response.data) {
      product = response.data;
      const displayColors = getDisplayColors();
      selectedColor = displayColors.length > 0 ? displayColors[0] : null;
      console.log("Product loaded successfully:", product.name);
      return true;
    } else {
      showNotification("Failed to load product", "error");
      return false;
    }
  } catch (error) {
    console.error("Error loading product:", error);
    showNotification("Error loading product: " + error.message, "error");
    return false;
  }
}

// Update product UI with loaded data
function updateProductUI() {
  if (!product) return;

  // Update product title and category
  const titleElement = document.querySelector(".product-title");
  const categoryElement = document.querySelector(".product-category");

  if (titleElement) titleElement.textContent = product.name;
  if (categoryElement && product.category) {
    categoryElement.textContent = product.category.name || product.category;
  }

  // Calculate discount
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  // Update price display
  const priceContainer = document.querySelector(".current-price");
  if (priceContainer) {
    priceContainer.innerHTML = `
      ₹${(product.price || 0).toLocaleString()}
      ${product.mrp ? `<span class="original-price">₹${product.mrp.toLocaleString()}</span>` : ""}
      ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
    `;
  }

  // Update main image with first color's first image
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    let imageUrl = product.image;

    // Try to use color-specific image first
    if (
      selectedColor &&
      selectedColor.images &&
      selectedColor.images.length > 0
    ) {
      imageUrl = selectedColor.images[0];
    }

    // Fallback to product image
    if (!imageUrl && product.image) {
      imageUrl = product.image;
    }

    // Last resort fallback image
    const defaultImage =
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
    imageUrl = imageUrl || defaultImage;

    mainImage.style.backgroundImage = `url('${imageUrl}')`;
    mainImage.style.backgroundSize = "cover";
    mainImage.style.backgroundPosition = "center";
  }

  // Update breadcrumb with product name
  const breadcrumbItems = document.querySelectorAll(
    ".breadcrumb span:last-child",
  );
  if (breadcrumbItems.length > 0) {
    breadcrumbItems[breadcrumbItems.length - 1].textContent = product.name;
  }

  console.log("Product UI updated:", product.name);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async function () {
  showProductLoader();

  // Load product from API first
  const productLoaded = await loadProductData();

  if (!productLoaded || !product) {
    console.error("Failed to initialize: product not loaded");
    hideProductLoader();
    return;
  }

  // Update the UI with loaded product data
  updateProductUI();

  await syncHeaderCounts();
  setupEventListeners();
  setupNavScroll();
  updateProductWishlistButton();

  // Generate color options
  generateColorOptions();

  // Generate size options
  generateSizeOptions();

  // Initialize thumbnails with first color's images
  updateThumbnails();
  hideProductLoader();
});

// Generate color options
function generateColorOptions() {
  const colorOptionsContainer = document.getElementById("colorOptions");
  colorOptionsContainer.innerHTML = "";
  const colorsToRender = getDisplayColors();

  colorsToRender.forEach((color) => {
    const colorItem = document.createElement("div");
    colorItem.className = "color-item";

    const colorOption = document.createElement("div");
    colorOption.className = `color-option ${selectedColor && color.value === selectedColor.value ? "selected" : ""}`;
    colorOption.style.backgroundColor = color.hex || "#000000";
    colorOption.setAttribute("data-color", color.value);

    // Add border for white color to make it visible
    if (color.value === "white") {
      colorOption.style.border = "1px solid #e0e0e0";
    }

    colorOption.addEventListener("click", (e) => selectColor(color, e));

    const colorName = document.createElement("div");
    colorName.className = "color-name";
    colorName.textContent = color.name;

    colorItem.appendChild(colorOption);
    colorItem.appendChild(colorName);
    colorOptionsContainer.appendChild(colorItem);
  });
}

// Generate size options
function generateSizeOptions() {
  const sizeOptionsContainer = document.getElementById("sizeOptions");
  sizeOptionsContainer.innerHTML = "";

  product.sizes.forEach((size) => {
    const sizeOption = document.createElement("div");
    sizeOption.className = `size-option ${size.size === selectedSize ? "selected" : ""} ${!size.inStock ? "out-of-stock" : ""}`;
    sizeOption.textContent = size.size;
    sizeOption.setAttribute("data-size", size.size);

    if (size.inStock) {
      sizeOption.addEventListener("click", (e) => selectSize(size.size, e));
    }

    sizeOptionsContainer.appendChild(sizeOption);
  });
}

// Select color
function selectColor(color, e) {
  selectedColor = color;

  // Update UI
  document
    .querySelectorAll(".color-option")
    .forEach((opt) => opt.classList.remove("selected"));
  if (e?.currentTarget) {
    e.currentTarget.classList.add("selected");
  }

  // Update product images
  updateProductImages();

  // Show notification
  showNotification(`Color changed to ${color.name}`);
}

// Select size
function selectSize(size, e) {
  // Handle both object {size: "M", inStock: true} and string "M"
  selectedSize = typeof size === "object" ? size.size : size;

  // Update UI
  document
    .querySelectorAll(".size-option:not(.out-of-stock)")
    .forEach((opt) => opt.classList.remove("selected"));
  if (e?.currentTarget) {
    e.currentTarget.classList.add("selected");
  }
}

// Update product images based on selected color
function updateProductImages() {
  if (!selectedColor || !Array.isArray(selectedColor.images)) return;

  // Update main image
  const mainImage = document.getElementById("mainImage");
  const mainImageUrl = selectedColor.images[0] || product?.image;
  if (mainImageUrl) {
    mainImage.style.backgroundImage = `url('${mainImageUrl}')`;
  }

  // Update thumbnails
  updateThumbnails();

  // Update zoom image if modal is open
  const zoomedImage = document.getElementById("zoomedImage");
  if (zoomedImage.src && mainImageUrl) {
    zoomedImage.src = mainImageUrl;
  }
}

// Update thumbnails
function updateThumbnails() {
  const thumbnailContainer = document.getElementById("thumbnailContainer");
  thumbnailContainer.innerHTML = "";

  const images = Array.isArray(selectedColor?.images)
    ? selectedColor.images
    : product?.image
      ? [product.image]
      : [];

  images.forEach((image, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.style.backgroundImage = `url('${image}')`;
    thumbnail.setAttribute("data-image", image);

    thumbnail.addEventListener("click", function () {
      const imageUrl = this.getAttribute("data-image");
      document.getElementById("mainImage").style.backgroundImage =
        `url('${imageUrl}')`;

      // Update active thumbnail
      document
        .querySelectorAll(".thumbnail")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });

    thumbnailContainer.appendChild(thumbnail);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".detail-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Update active tab
      document
        .querySelectorAll(".detail-tab")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show corresponding content
      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));
      document.getElementById(tabId + "Tab").classList.add("active");
    });
  });

  // Image zoom
  document.getElementById("mainImage").addEventListener("click", function () {
    const currentImage = this.style.backgroundImage
      .replace('url("', "")
      .replace('")', "");
    document.getElementById("zoomedImage").src = currentImage;
    document.getElementById("imageZoomModal").classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Quantity input
  document
    .getElementById("quantityInput")
    .addEventListener("change", function () {
      quantity = parseInt(this.value) || 1;
      if (quantity < 1) quantity = 1;
      if (quantity > 10) quantity = 10;
      this.value = quantity;
    });
}

// Quantity controls
function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    document.getElementById("quantityInput").value = quantity;
  }
}

function increaseQuantity() {
  if (quantity < 10) {
    quantity++;
    document.getElementById("quantityInput").value = quantity;
  }
}

// Add to cart functionality
function addToCart() {
  // Check if user is logged in
  const user = getCurrentUser();
  if (!user) {
    showNotification("Please login to add items to cart", "error");
    setTimeout(() => {
      openLoginModal();
    }, 500);
    return;
  }

  // Validate size selection
  if (!selectedSize) {
    showNotification("Please select a size first");
    return;
  }

  // Validate size is in product's sizes array
  const sizeData = product.sizes.find((s) => s.size === selectedSize);
  if (!sizeData) {
    showNotification("Invalid size selected");
    return;
  }

  // Check if selected size is in stock
  if (!sizeData.inStock) {
    showNotification("Selected size is out of stock");
    return;
  }

  // Validate color selection
  if (!selectedColor) {
    showNotification("Please select a color first");
    return;
  }

  // Validate color is in product's colors array
  const colorData = product.colors.find((c) => c.value === selectedColor.value);
  if (!colorData) {
    showNotification("Invalid color selected");
    return;
  }

  // Disable button during request
  const addToCartBtn = document.querySelector('button[onclick="addToCart()"]');
  if (addToCartBtn) {
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Adding...";
  }

  // Call API to add to cart
  cartAPI
    .add(product._id, quantity, selectedSize, selectedColor?.value || "default")
    .then((response) => {
      if (response.success) {
        // Update local cart count
        cartCount = (response.data?.items || []).reduce(
          (total, item) => total + item.quantity,
          0,
        );
        localStorage.setItem("cartCount", cartCount);
        updateCartCount();

        showNotification(
          `${product.name} (${selectedColor?.name || "Default"}, Size: ${selectedSize}) added to cart!`,
        );
      } else {
        showNotification("Failed to add to cart: " + response.message, "error");
      }
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      showNotification("Error adding to cart: " + error.message, "error");
    })
    .finally(() => {
      // Re-enable button
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = "ADD TO CART";
      }
    });
}

// Buy now functionality
function buyNow() {
  if (!selectedSize) {
    showNotification("Please select a size first");
    return;
  }

  const sizeData = product.sizes.find((s) => s.size === selectedSize);
  if (!sizeData || !sizeData.inStock) {
    showNotification("Selected size is out of stock");
    return;
  }

  // Create order item
  const orderItem = {
    productId: product._id,
    name: product.name,
    price: product.price,
    size: selectedSize,
    color: selectedColor?.name || "Default",
    colorValue: selectedColor?.value || "default",
    quantity: quantity,
    image: selectedColor?.images?.[0] || product.image || "",
    total: product.price * quantity,
  };

  // Store order for checkout
  localStorage.setItem("checkoutItem", JSON.stringify(orderItem));

  // Redirect to checkout page
  showNotification("Redirecting to checkout...");
  setTimeout(() => {
    window.location.href = "checkout.html";
  }, 1000);
}

// Toggle product wishlist
function toggleProductWishlist() {
  // Check if user is logged in
  const user = getCurrentUser();
  if (!user) {
    showNotification("Please login to add items to wishlist", "error");
    setTimeout(() => {
      openLoginModal();
    }, 500);
    return;
  }

  const wishlistBtn = document.getElementById("wishlistBtn");
  const icon = wishlistBtn.querySelector("i");

  // Set loading state
  wishlistBtn.disabled = true;
  const originalIcon = icon.className;

  if (isProductInWishlist) {
    // Remove from wishlist via API
    wishlistAPI
      .remove(product._id)
      .then((response) => {
        if (response.success) {
          isProductInWishlist = false;
          icon.className = "far fa-heart";
          wishlistBtn.classList.remove("active");
          wishlistCount--;
          localStorage.setItem("wishlistCount", wishlistCount);
          updateWishlistCount();
          showNotification("Removed from wishlist");
        } else {
          showNotification("Failed to remove from wishlist", "error");
          icon.className = originalIcon;
        }
        // Remove loading state
        wishlistBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error removing from wishlist:", error);
        showNotification("Error: " + error.message, "error");
        icon.className = originalIcon;
        // Remove loading state
        wishlistBtn.disabled = false;
      });
  } else {
    // Add to wishlist via API
    wishlistAPI
      .add(product._id)
      .then((response) => {
        if (response.success) {
          isProductInWishlist = true;
          icon.className = "fas fa-heart";
          wishlistBtn.classList.add("active");
          wishlistCount++;
          localStorage.setItem("wishlistCount", wishlistCount);
          updateWishlistCount();
          showNotification("Added to wishlist!");
        } else {
          showNotification("Failed to add to wishlist", "error");
          icon.className = originalIcon;
        }
        // Remove loading state
        wishlistBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error adding to wishlist:", error);
        showNotification("Error: " + error.message, "error");
        icon.className = originalIcon;
        // Remove loading state
        wishlistBtn.disabled = false;
      });
  }
}

// Update product wishlist button state
function updateProductWishlistButton() {
  const wishlistBtn = document.getElementById("wishlistBtn");
  const icon = wishlistBtn.querySelector("i");

  if (isProductInWishlist) {
    icon.className = "fas fa-heart";
    wishlistBtn.classList.add("active");
  } else {
    icon.className = "far fa-heart";
    wishlistBtn.classList.remove("active");
  }
}

// Toggle wishlist (for header)
function toggleWishlist() {
  // This would toggle the main wishlist
  showNotification("Viewing wishlist...");
  setTimeout(() => {
    window.location.href = "whishlist.html";
  }, 500);
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && emailRegex.test(email)) {
    showNotification("Thank you for subscribing to our newsletter!");
    emailInput.value = "";
  } else {
    showNotification("Please enter a valid email address.");
  }
}

// Close image zoom
function closeZoom() {
  document.getElementById("imageZoomModal").classList.remove("active");
  document.body.style.overflow = "auto";
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

// Close zoom modal with ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeZoom();
  }
});

// Close zoom modal when clicking outside image
document
  .getElementById("imageZoomModal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeZoom();
    }
  });
