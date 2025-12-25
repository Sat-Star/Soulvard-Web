/\*\*

- EXAMPLE: How to Update Admin Panel to Use Backend API
-
- Replace the mock data fetch/storage with actual API calls
  \*/

// ============================================
// 1. Store token from login
// ============================================

// After successful login, store the token
async function handleAdminLogin(email, password) {
try {
const response = await fetch('http://localhost:5000/api/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password })
});

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.user.role);

      // Redirect to admin panel
      window.location.href = '/admin/admin.html';
      return true;
    } else {
      alert('Login failed: ' + data.message);
      return false;
    }

} catch (error) {
console.error('Login error:', error);
return false;
}
}

// ============================================
// 2. Get authorization header helper
// ============================================

function getAuthHeader() {
const token = localStorage.getItem('authToken');
return {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json'
};
}

// ============================================
// 3. Replace renderProductsTable() function
// ============================================

async function renderProductsTable() {
try {
const response = await fetch('http://localhost:5000/api/products');
const products = await response.json();

    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';

    products.forEach((product) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${product.images[0]}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>₹${product.price.toLocaleString('en-IN')}</td>
        <td>${product.stock}</td>
        <td><span style="color: ${product.status === 'Active' ? 'var(--success)' : 'var(--error)'};">${product.status}</span></td>
        <td class="table-actions">
          <button class="btn" onclick="editProduct('${product._id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

} catch (error) {
console.error('Error fetching products:', error);
}
}

// ============================================
// 4. Replace addProduct() function
// ============================================

async function addProduct() {
try {
const formData = new FormData();

    // Collect form data
    formData.append('id', document.getElementById('productId').value || generateId());
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('category', document.getElementById('productCategory').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('stock', document.getElementById('productStock').value);
    formData.append('shipping', document.getElementById('productShipping').value);
    formData.append('featured', document.getElementById('productFeatured').checked);

    // Collect colors
    const colors = [];
    document.querySelectorAll('.color-variant').forEach((variant) => {
      const colorName = variant.querySelector('.color-name').value;
      const colorValue = variant.querySelector('.color-picker').value;
      if (colorName) {
        colors.push({ name: colorName, value: colorValue, image: '' });
      }
    });
    formData.append('colors', JSON.stringify(colors));

    // Collect sizes
    const sizes = [];
    document.querySelectorAll('.size-option.active').forEach((size) => {
      sizes.push(size.textContent);
    });
    formData.append('sizes', JSON.stringify(sizes));

    // Collect images
    const fileInputs = document.getElementById('fileInput').files;
    for (let i = 0; i < fileInputs.length; i++) {
      formData.append('images', fileInputs[i]);
    }

    // Send to API
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Product added successfully!');
      document.getElementById('productForm').reset();
      renderProductsTable();
    } else {
      alert('Error: ' + data.message);
    }

} catch (error) {
console.error('Error adding product:', error);
alert('Failed to add product');
}
}

// ============================================
// 5. Replace editProduct() function
// ============================================

async function editProduct(productId) {
try {
const response = await fetch(`http://localhost:5000/api/products/${productId}`);
const product = await response.json();

    // Fill form with product data
    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productShipping').value = product.shipping;
    document.getElementById('productFeatured').checked = product.featured;

    // Clear and add color variants
    document.getElementById('colorVariantsContainer').innerHTML = '';
    product.colors.forEach((color) => {
      addColorVariant(color);
    });

    // Set sizes
    document.querySelectorAll('.size-option').forEach((option) => {
      if (product.sizes.includes(option.textContent)) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });

    // Update button text
    document.getElementById('productSubmitBtn').textContent = 'Update Product';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';

    // Scroll to form
    document.querySelector('[data-section="add-product"]').click();

} catch (error) {
console.error('Error fetching product:', error);
}
}

// ============================================
// 6. Replace deleteProduct() function
// ============================================

async function deleteProduct(productId) {
if (confirm('Are you sure you want to delete this product?')) {
try {
const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
method: 'DELETE',
headers: getAuthHeader()
});

      if (response.ok) {
        alert('Product deleted successfully!');
        renderProductsTable();
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }

}
}

// ============================================
// 7. Replace populateCategories() function
// ============================================

async function populateCategories() {
try {
const response = await fetch('http://localhost:5000/api/categories');
const categories = await response.json();

    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

} catch (error) {
console.error('Error fetching categories:', error);
}
}

// ============================================
// 8. Update category save function
// ============================================

async function saveCategoryFromModal() {
try {
const categoryName = document.getElementById('categoryName').value.trim();

    if (!categoryName) {
      alert('Category name is required');
      return;
    }

    const response = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ name: categoryName })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Category created successfully!');
      document.getElementById('categoryName').value = '';
      document.getElementById('categoryModal').style.display = 'none';
      populateCategories();
      renderCategoryList();
    } else {
      alert('Error: ' + data.message);
    }

} catch (error) {
console.error('Error saving category:', error);
}
}

// ============================================
// 9. Replace renderCategoryList() function
// ============================================

async function renderCategoryList() {
try {
const response = await fetch('http://localhost:5000/api/categories');
const categories = await response.json();

    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    categories.forEach((category) => {
      const tag = document.createElement('div');
      tag.className = 'category-tag';
      tag.innerHTML = `
        ${category.name}
        <span class="remove" onclick="deleteCategory('${category._id}')">&times;</span>
      `;
      categoryList.appendChild(tag);
    });

} catch (error) {
console.error('Error fetching categories:', error);
}
}

// ============================================
// 10. Update deleteCategory function
// ============================================

async function deleteCategory(categoryId) {
if (confirm('Are you sure you want to remove this category?')) {
try {
const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
method: 'DELETE',
headers: getAuthHeader()
});

      if (response.ok) {
        populateCategories();
        renderCategoryList();
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }

}
}

// ============================================
// 11. Helper function to generate ID
// ============================================

function generateId() {
return String(Date.now()).slice(-3);
}

// ============================================
// 12. Update initialization (in DOMContentLoaded)
// ============================================

document.addEventListener('DOMContentLoaded', function () {
// Check if user is logged in
const token = localStorage.getItem('authToken');
if (!token) {
window.location.href = '/login.html'; // Redirect to login page
return;
}

// Load data from API
renderProductsTable();
populateCategories();
renderCategoryList();

// ... rest of the initialization code
});

// ============================================
// 13. Logout function
// ============================================

function logout() {
localStorage.removeItem('authToken');
localStorage.removeItem('userRole');
window.location.href = '/login.html';
}

// Similar patterns for other CRUD operations:
// - Coupons: POST/PUT/DELETE to /api/coupons
// - Playlists: POST/PUT/DELETE to /api/playlists
// - Hero Images: POST/PUT/DELETE to /api/hero-images
// - Size Charts: POST/PUT/DELETE to /api/size-charts
// - Promotions: POST/PUT/DELETE to /api/promotions
