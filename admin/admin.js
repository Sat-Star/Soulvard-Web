const API_URL = "http://localhost:5000";

let products = [];
let categories = [];

// Get JWT token from localStorage
function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not authenticated. Please login.");
    window.location.href = "/client/login.html";
  }
  return token;
}

// Load products from API
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) throw new Error("Failed to load products");
    products = await response.json();
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Error loading products from server");
  }
}

// Load categories from API
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/api/categories`);
    if (!response.ok) throw new Error("Failed to load categories");
    categories = await response.json();
  } catch (error) {
    console.error("Error loading categories:", error);
    alert("Error loading categories from server");
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async function () {
  // Check authentication
  if (!localStorage.getItem("token")) {
    window.location.href = "/client/login.html";
    return;
  }

  // Check if user is admin
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "admin") {
    alert("Access denied. Admin privileges required.");
    window.location.href = "/index.html";
    return;
  }

  // Load data from API
  await loadCategories();
  await loadProducts();
  renderProductsTable();
  populateCategories();
  renderCategoryList();

  // Navigation between sections
  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      document.querySelectorAll(".sidebar-menu a").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked link
      this.classList.add("active");

      // Hide all sections
      document.querySelectorAll(".section-content").forEach((section) => {
        section.classList.remove("active");
      });

      // Show selected section
      const sectionId = this.getAttribute("data-section");
      document.getElementById(sectionId).classList.add("active");
    });
  });

  // Playlist tabs
  document.querySelectorAll(".section-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      document.querySelectorAll(".section-tab").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked tab
      this.classList.add("active");

      // Hide all playlist sections
      document
        .querySelectorAll("#playlists .section-content")
        .forEach((section) => {
          section.classList.remove("active");
        });

      // Show selected playlist section
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Character counter for description
  document
    .getElementById("productDescription")
    .addEventListener("input", function () {
      document.getElementById("charCount").textContent = this.value.length;
    });

  // Image upload functionality
  const imageUpload = document.getElementById("imageUpload");
  const fileInput = document.getElementById("fileInput");
  const imagePreview = document.getElementById("imagePreview");

  imageUpload.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    const files = this.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const previewItem = document.createElement("div");
          previewItem.className = "preview-item";
          previewItem.innerHTML = `
                                <img src="${e.target.result}" alt="Preview">
                                <div class="remove">&times;</div>
                            `;
          imagePreview.appendChild(previewItem);

          // Add remove functionality
          previewItem
            .querySelector(".remove")
            .addEventListener("click", function () {
              previewItem.remove();
            });
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Hero image upload
  const heroImageUpload = document.getElementById("heroImageUpload");
  const heroFileInput = document.getElementById("heroFileInput");

  heroImageUpload.addEventListener("click", function () {
    heroFileInput.click();
  });

  heroFileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item";
        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Hero Preview">
                            <div class="remove">&times;</div>
                        `;
        document
          .querySelector("#hero-images .image-preview")
          .appendChild(previewItem);

        // Add remove functionality
        previewItem
          .querySelector(".remove")
          .addEventListener("click", function () {
            previewItem.remove();
          });
      };
      reader.readAsDataURL(file);
    }
  });

  // Size selection
  document.querySelectorAll(".size-option").forEach((option) => {
    option.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  // Form submissions
  document
    .getElementById("productForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const productId = document.getElementById("productId").value;

      if (productId) {
        await updateProduct(productId);
      } else {
        await addProduct();
      }

      this.reset();
      document.getElementById("charCount").textContent = "0";
      imagePreview.innerHTML = "";
      document.getElementById("colorVariantsContainer").innerHTML = "";
      addColorVariant();
      document.getElementById("productSubmitBtn").textContent = "Add Product";
      document.getElementById("cancelEditBtn").style.display = "none";
      document.getElementById("productId").value = "";

      // Re-render products table
      await loadProducts();
      renderProductsTable();
    });

  document
    .getElementById("couponForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      await addCoupon();
      this.reset();
    });

  // Add category button
  document
    .getElementById("addCategoryBtn")
    .addEventListener("click", async function () {
      const categoryName = prompt("Enter category name:");
      if (categoryName) {
        await addCategory(categoryName);
      }
    });

  // Add color variant
  document
    .getElementById("addColorVariant")
    .addEventListener("click", function () {
      addColorVariant();
    });

  // Cancel edit
  document
    .getElementById("cancelEditBtn")
    .addEventListener("click", function () {
      document.getElementById("productForm").reset();
      document.getElementById("charCount").textContent = "0";
      imagePreview.innerHTML = "";
      document.getElementById("colorVariantsContainer").innerHTML = "";
      document.getElementById("productSubmitBtn").textContent = "Add Product";
      this.style.display = "none";
      document.getElementById("productId").value = "";
    });
});

// Function to render products table
function renderProductsTable() {
  const tableBody = document.getElementById("productsTableBody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : "https://via.placeholder.com/50";
    row.innerHTML = `
      <td>${product.name}</td>
      <td><img src="${imageUrl}" alt="${
      product.name
    }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td>${product.category}</td>
      <td>₹${product.price}</td>
      <td>${product.stock}</td>
      <td><span style="color: ${product.stock > 0 ? "green" : "red"};">${
      product.stock > 0 ? "Active" : "Out of Stock"
    }</span></td>
      <td class="table-actions">
        <button class="btn" onclick="editProduct('${
          product._id
        }')">Edit</button>
        <button class="btn btn-danger" onclick="deleteProduct('${
          product._id
        }')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to populate categories in dropdown
function populateCategories() {
  const categorySelect = document.getElementById("productCategory");
  categorySelect.innerHTML = '<option value="">Select Category</option>';

  categories.forEach((category) => {
    const categoryName = category.name || category;
    const option = document.createElement("option");
    option.value = categoryName;
    option.textContent = categoryName;
    categorySelect.appendChild(option);
  });
}

// Function to render category list
function renderCategoryList() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const categoryName = category.name || category;
    const tag = document.createElement("div");
    tag.className = "category-tag";
    tag.innerHTML = `
      ${categoryName}
      <span class="remove" onclick="deleteCategory('${categoryName}')">&times;</span>
    `;
    categoryList.appendChild(tag);
  });
}

// Function to remove category
async function deleteCategory(categoryName) {
  if (
    !confirm(`Are you sure you want to delete the category "${categoryName}"?`)
  ) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/categories/${categoryName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Category deleted successfully!");
      await loadCategories();
      populateCategories();
      renderCategoryList();
    } else {
      alert(`Error: ${data.message || "Failed to delete category"}`);
    }
  } catch (error) {
    alert(`Error deleting category: ${error.message}`);
    console.error(error);
  }
}

// Function to add color variant
function addColorVariant(color = { name: "", value: "#000000", image: "" }) {
  const container = document.getElementById("colorVariantsContainer");
  const colorId = "color_" + Date.now();

  const colorVariant = document.createElement("div");
  colorVariant.className = "color-variant";
  colorVariant.innerHTML = `
                <div class="color-preview" style="background-color: ${
                  color.value
                };"></div>
                <input type="color" class="color-picker" value="${
                  color.value
                }" onchange="updateColorPreview(this)">
                <input type="text" class="color-name" placeholder="Color Name" value="${
                  color.name
                }" onchange="updateColorName(this)">
                <div class="color-image-upload">
                    <input type="file" class="color-image-input" accept="image/*" style="display: none;" onchange="handleColorImageUpload(this, '${colorId}')">
                    <button type="button" class="btn" onclick="this.previousElementSibling.click()">Upload Image</button>
                </div>
                <div class="color-image-preview" id="${colorId}">
                    ${
                      color.image
                        ? `<img src="${color.image}" alt="${color.name}">`
                        : ""
                    }
                </div>
                <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">Remove</button>
            `;

  container.appendChild(colorVariant);
}

// Function to update color preview
function updateColorPreview(input) {
  const preview = input.previousElementSibling;
  preview.style.backgroundColor = input.value;
}

// Function to update color name
function updateColorName(input) {
  // You can add validation or other logic here if needed
}

// Function to handle color image upload
function handleColorImageUpload(input, previewId) {
  const file = input.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById(previewId);
      preview.innerHTML = `<img src="${e.target.result}" alt="Color Preview">`;
    };
    reader.readAsDataURL(file);
  }
}

// ===== CATEGORY OPERATIONS =====

async function addCategory(categoryName) {
  if (!categoryName.trim()) {
    alert("Please enter a category name");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });

    const data = await response.json();
    if (response.ok || response.status === 201) {
      alert("Category added successfully!");
      await loadCategories();
      populateCategories();
      renderCategoryList();
    } else {
      alert(`Error: ${data.message || "Failed to add category"}`);
    }
  } catch (error) {
    alert(`Error adding category: ${error.message}`);
    console.error(error);
  }
}

// ===== COUPON OPERATIONS =====

async function addCoupon() {
  const code = document.getElementById("couponCode").value.trim();
  const discount = parseFloat(document.getElementById("couponDiscount").value);
  const startDate = document.getElementById("couponStartDate").value;
  const endDate = document.getElementById("couponEndDate").value;
  const usageLimit =
    parseInt(document.getElementById("couponUsageLimit").value) || null;

  if (!code || !discount || !startDate || !endDate) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code,
        discount,
        startDate,
        endDate,
        usageLimit,
        applicableProducts: ["all"],
      }),
    });

    const data = await response.json();
    if (response.ok || response.status === 201) {
      alert("Coupon created successfully!");
      document.getElementById("couponForm").reset();
    } else {
      alert(`Error: ${data.message || "Failed to create coupon"}`);
    }
  } catch (error) {
    alert(`Error creating coupon: ${error.message}`);
    console.error(error);
  }
}

// Function to add product
async function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const shipping =
    parseFloat(document.getElementById("productShipping").value) || 0;

  if (!name || !category || !price || stock === "") {
    alert("Please fill in all required fields");
    return;
  }

  // Collect colors
  const colors = [];
  document.querySelectorAll(".color-variant").forEach((item) => {
    const colorName = item.querySelector(".color-name").value.trim();
    const colorValue = item.querySelector(".color-picker").value;
    if (colorName) {
      colors.push({
        name: colorName,
        value: colorValue,
        image: "",
      });
    }
  });

  // Collect sizes
  const sizes = Array.from(
    document.querySelectorAll(".size-option.active")
  ).map((option) => option.textContent.trim());

  const formData = new FormData();
  formData.append("name", name);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("stock", stock);
  formData.append("description", description);
  formData.append("shipping", shipping);
  formData.append("colors", JSON.stringify(colors));
  formData.append("sizes", JSON.stringify(sizes));

  // Add images from file input
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append("images", fileInput.files[i]);
    }
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok || response.status === 201) {
      alert("Product added successfully!");
      document.getElementById("fileInput").value = "";
      await loadProducts();
      renderProductsTable();
    } else {
      alert(`Error: ${data.message || "Failed to add product"}`);
    }
  } catch (error) {
    alert(`Error adding product: ${error.message}`);
    console.error(error);
  }
}

// Function to update product
async function updateProduct(productId) {
  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const shipping =
    parseFloat(document.getElementById("productShipping").value) || 0;

  if (!name || !category || !price || stock === "") {
    alert("Please fill in all required fields");
    return;
  }

  const colors = [];
  document.querySelectorAll(".color-variant").forEach((item) => {
    const colorName = item.querySelector(".color-name").value.trim();
    const colorValue = item.querySelector(".color-picker").value;
    if (colorName) {
      colors.push({
        name: colorName,
        value: colorValue,
        image: "",
      });
    }
  });

  const sizes = Array.from(
    document.querySelectorAll(".size-option.active")
  ).map((option) => option.textContent.trim());

  const formData = new FormData();
  formData.append("name", name);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("stock", stock);
  formData.append("description", description);
  formData.append("shipping", shipping);
  formData.append("colors", JSON.stringify(colors));
  formData.append("sizes", JSON.stringify(sizes));

  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append("images", fileInput.files[i]);
    }
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert("Product updated successfully!");
      document.getElementById("fileInput").value = "";
      await loadProducts();
      renderProductsTable();
    } else {
      alert(`Error: ${data.message || "Failed to update product"}`);
    }
  } catch (error) {
    alert(`Error updating product: ${error.message}`);
    console.error(error);
  }
}

// Function to edit product
function editProduct(productId) {
  const product = products.find((p) => p._id === productId);
  if (!product) {
    alert("Product not found");
    return;
  }

  // Navigate to add product section
  document.querySelectorAll(".sidebar-menu a").forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector('[data-section="add-product"]')
    .classList.add("active");

  document.querySelectorAll(".section-content").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById("add-product").classList.add("active");

  // Fill form with product data
  document.getElementById("productId").value = product._id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productDescription").value =
    product.description || "";
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productShipping").value = product.shipping || 0;
  document.getElementById("charCount").textContent = (
    product.description || ""
  ).length;

  // Clear and add color variants
  document.getElementById("colorVariantsContainer").innerHTML = "";
  if (product.colors && product.colors.length > 0) {
    product.colors.forEach((color) => {
      addColorVariant(color);
    });
  } else {
    addColorVariant();
  }

  // Set sizes
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("active");
  });
  if (product.sizes && product.sizes.length > 0) {
    product.sizes.forEach((size) => {
      const sizeBtn = Array.from(
        document.querySelectorAll(".size-option")
      ).find((btn) => btn.textContent.trim() === size);
      if (sizeBtn) {
        sizeBtn.classList.add("active");
      }
    });
  }

  // Update button text
  document.getElementById("productSubmitBtn").textContent = "Update Product";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
}

// Function to delete product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Product deleted successfully!");
      await loadProducts();
      renderProductsTable();
    } else {
      alert(`Error: ${data.message || "Failed to delete product"}`);
    }
  } catch (error) {
    alert(`Error deleting product: ${error.message}`);
    console.error(error);
  }
}
