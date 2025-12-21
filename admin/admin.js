let products = [
  {
    id: "001",
    name: "Silk Shirt",
    category: "Top Picks",
    price: "₹24,917",
    stock: 15,
    status: "Active",
    description: "Luxurious silk shirt with premium finish",
    shipping: 200,
    colors: [
      {
        name: "Black",
        value: "#000000",
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
      },
      {
        name: "White",
        value: "#ffffff",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    sizes: ["XS", "S", "M"],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    featured: true,
  },
  {
    id: "002",
    name: "Tailored Trousers",
    category: "New Arrivals",
    price: "₹33,117",
    stock: 8,
    status: "Active",
    description: "Perfectly tailored trousers for a sharp look",
    shipping: 250,
    colors: [
      {
        name: "Navy",
        value: "#1a1a2e",
        image:
          "https://lh3.googleusercontent.com/p/AF1QipMIV1C6dppvP91qcgn6e8qDTcH0HCE2Qc5wWtQK=s1360-w1360-h1020-rw",
      },
      {
        name: "Charcoal",
        value: "#36454f",
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    sizes: ["S", "M", "L"],
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMIV1C6dppvP91qcgn6e8qDTcH0HCE2Qc5wWtQK=s1360-w1360-h1020-rw",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    featured: false,
  },
];

// Sample categories
let categories = [
  "Shirts",
  "Trousers",
  "Coats",
  "Jackets",
  "Accessories",
  "Top Picks",
  "New Arrivals",
];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
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
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const productId = document.getElementById("productId").value;

      if (productId) {
        // Update existing product
        updateProduct(productId);
        alert("Product updated successfully!");
      } else {
        // Add new product
        addProduct();
        alert("Product added successfully!");
      }

      this.reset();
      document.getElementById("charCount").textContent = "0";
      imagePreview.innerHTML = "";
      document.getElementById("colorVariantsContainer").innerHTML = "";
      document.getElementById("productSubmitBtn").textContent = "Add Product";
      document.getElementById("cancelEditBtn").style.display = "none";
      document.getElementById("productId").value = "";

      // Re-render products table
      renderProductsTable();
    });

  document
    .getElementById("couponForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Coupon created successfully!");
      this.reset();
    });

  // Remove existing images
  document.querySelectorAll(".preview-item .remove").forEach((removeBtn) => {
    removeBtn.addEventListener("click", function () {
      this.parentElement.remove();
    });
  });

  // Add category button
  document
    .getElementById("addCategoryBtn")
    .addEventListener("click", function () {
      document.getElementById("categoryModal").style.display = "flex";
    });

  // Close modal
  document.querySelector(".close-modal").addEventListener("click", function () {
    document.getElementById("categoryModal").style.display = "none";
  });

  // Save new category
  document
    .getElementById("saveNewCategoryBtn")
    .addEventListener("click", function () {
      const categoryName = document.getElementById("categoryName").value.trim();
      if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
        populateCategories();
        renderCategoryList();
        document.getElementById("categoryModal").style.display = "none";
        document.getElementById("categoryName").value = "";
      } else {
        alert("Category name is required and must be unique");
      }
    });

  // Save category from categories section
  document
    .getElementById("saveCategoryBtn")
    .addEventListener("click", function () {
      const categoryName = document
        .getElementById("newCategoryName")
        .value.trim();
      if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
        populateCategories();
        renderCategoryList();
        document.getElementById("newCategoryName").value = "";
      } else {
        alert("Category name is required and must be unique");
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
    row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.images[0]}" alt="${
      product.name
    }" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td><span style="color: ${
                      product.status === "Active"
                        ? "var(--success)"
                        : "var(--error)"
                    };">${product.status}</span></td>
                    <td class="table-actions">
                        <button class="btn" onclick="editProduct('${
                          product.id
                        }')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct('${
                          product.id
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
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Function to render category list
function renderCategoryList() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const tag = document.createElement("div");
    tag.className = "category-tag";
    tag.innerHTML = `
                    ${category}
                    <span class="remove" onclick="removeCategory('${category}')">&times;</span>
                `;
    categoryList.appendChild(tag);
  });
}

// Function to remove category
function removeCategory(categoryName) {
  if (
    confirm(`Are you sure you want to remove the category "${categoryName}"?`)
  ) {
    categories = categories.filter((cat) => cat !== categoryName);
    populateCategories();
    renderCategoryList();
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

// Function to add product
function addProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;
  const category = document.getElementById("productCategory").value;
  const stock = document.getElementById("productStock").value;
  const shipping = document.getElementById("productShipping").value;
  const featured = document.getElementById("productFeatured").checked;

  // Get color variants
  const colorVariants = [];
  document.querySelectorAll(".color-variant").forEach((variant) => {
    const colorName = variant.querySelector(".color-name").value;
    const colorValue = variant.querySelector(".color-picker").value;
    const colorImage = variant.querySelector(".color-image-preview img");

    if (colorName) {
      colorVariants.push({
        name: colorName,
        value: colorValue,
        image: colorImage ? colorImage.src : "",
      });
    }
  });

  // Get selected sizes
  const sizes = [];
  document.querySelectorAll(".size-option.active").forEach((size) => {
    sizes.push(size.textContent);
  });

  // Get product images
  const images = [];
  document
    .querySelectorAll("#imagePreview .preview-item img")
    .forEach((img) => {
      images.push(img.src);
    });

  // Create new product
  const newProduct = {
    id: String(products.length + 1).padStart(3, "0"),
    name,
    category,
    price: `₹${parseInt(price).toLocaleString("en-IN")}`,
    stock: parseInt(stock),
    status: stock > 0 ? "Active" : "Out of Stock",
    description,
    shipping: parseInt(shipping),
    colors: colorVariants,
    sizes,
    images,
    featured,
  };

  products.push(newProduct);
}

// Function to update product
function updateProduct(productId) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) return;

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;
  const category = document.getElementById("productCategory").value;
  const stock = document.getElementById("productStock").value;
  const shipping = document.getElementById("productShipping").value;
  const featured = document.getElementById("productFeatured").checked;

  // Get color variants
  const colorVariants = [];
  document.querySelectorAll(".color-variant").forEach((variant) => {
    const colorName = variant.querySelector(".color-name").value;
    const colorValue = variant.querySelector(".color-picker").value;
    const colorImage = variant.querySelector(".color-image-preview img");

    if (colorName) {
      colorVariants.push({
        name: colorName,
        value: colorValue,
        image: colorImage ? colorImage.src : "",
      });
    }
  });

  // Get selected sizes
  const sizes = [];
  document.querySelectorAll(".size-option.active").forEach((size) => {
    sizes.push(size.textContent);
  });

  // Get product images
  const images = [];
  document
    .querySelectorAll("#imagePreview .preview-item img")
    .forEach((img) => {
      images.push(img.src);
    });

  // Update product
  products[productIndex] = {
    ...products[productIndex],
    name,
    category,
    price: `₹${parseInt(price).toLocaleString("en-IN")}`,
    stock: parseInt(stock),
    status: stock > 0 ? "Active" : "Out of Stock",
    description,
    shipping: parseInt(shipping),
    colors: colorVariants,
    sizes,
    images,
    featured,
  };
}

// Function to edit product
function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

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
  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productPrice").value = product.price
    .replace("₹", "")
    .replace(/,/g, "");
  document.getElementById("productDescription").value = product.description;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productShipping").value = product.shipping;
  document.getElementById("productFeatured").checked = product.featured;
  document.getElementById("charCount").textContent = product.description.length;

  // Clear and add color variants
  document.getElementById("colorVariantsContainer").innerHTML = "";
  product.colors.forEach((color) => {
    addColorVariant(color);
  });

  // Set sizes
  document.querySelectorAll(".size-option").forEach((option) => {
    if (product.sizes.includes(option.textContent)) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });

  // Set images
  const imagePreview = document.getElementById("imagePreview");
  imagePreview.innerHTML = "";
  product.images.forEach((image) => {
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.innerHTML = `
                    <img src="${image}" alt="Preview">
                    <div class="remove">&times;</div>
                `;
    imagePreview.appendChild(previewItem);

    // Add remove functionality
    previewItem.querySelector(".remove").addEventListener("click", function () {
      previewItem.remove();
    });
  });

  // Update button text
  document.getElementById("productSubmitBtn").textContent = "Update Product";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
}

// Function to delete product
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((p) => p.id !== productId);
    renderProductsTable();
  }
}
