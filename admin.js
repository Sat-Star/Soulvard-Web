// Comprehensive Data Management
let products = [];
let inventory = [];
let activities = [];
let orders = [];
let categories = [];
let selectedCollections = new Set();
let uploadedImages = [];
let selectedColors = [];
let selectedSizes = [];
let sizeChartData = {};
let heroImages = [];
let playlists = {
  "top-picks": [],
  "new-arrivals": [],
  "matching-products": [],
};
let currentPlaylistTab = "top-picks";
let currentPlaylistContext = "";
let editingCategoryId = null;

// Scalable Collections Data - INCLUDES Custom Product
let collections = [
  { id: "top-picks", name: "Top Picks", icon: "fas fa-star" },
  { id: "new-arrivals", name: "New Arrivals", icon: "fas fa-bolt" },
  { id: "matching-products", name: "Matching Products", icon: "fas fa-random" },
  { id: "custom-product", name: "Custom Product", icon: "fas fa-cogs" },
];

// Scalable Product Flags
let productFlags = [
  { id: "topPicks", name: "Top Picks", checked: false },
  { id: "newArrival", name: "New Arrival", checked: true },
  { id: "featuredProduct", name: "Featured Product", checked: false },
  { id: "bestSeller", name: "Best Seller", checked: false },
  { id: "trending", name: "Trending", checked: false },
  { id: "limitedEdition", name: "Limited Edition", checked: false },
];

// Sample Size Chart Templates
const sizeChartTemplates = {
  tshirt: {
    measurements: ["Chest", "Length", "Shoulder", "Sleeve"],
    sizes: ["S", "M", "L", "XL"],
    data: {
      S: { Chest: "38", Length: "28", Shoulder: "17", Sleeve: "8" },
      M: { Chest: "40", Length: "29", Shoulder: "18", Sleeve: "8.5" },
      L: { Chest: "42", Length: "30", Shoulder: "19", Sleeve: "9" },
      XL: { Chest: "44", Length: "31", Shoulder: "20", Sleeve: "9.5" },
    },
  },
  hoodie: {
    measurements: ["Chest", "Length", "Shoulder", "Sleeve", "Hood Height"],
    sizes: ["S", "M", "L", "XL"],
    data: {
      S: {
        Chest: "42",
        Length: "27",
        Shoulder: "18",
        Sleeve: "25",
        "Hood Height": "12",
      },
      M: {
        Chest: "44",
        Length: "28",
        Shoulder: "19",
        Sleeve: "26",
        "Hood Height": "12.5",
      },
      L: {
        Chest: "46",
        Length: "29",
        Shoulder: "20",
        Sleeve: "27",
        "Hood Height": "13",
      },
      XL: {
        Chest: "48",
        Length: "30",
        Shoulder: "21",
        Sleeve: "28",
        "Hood Height": "13.5",
      },
    },
  },
  pants: {
    measurements: ["Waist", "Hip", "Length", "Thigh"],
    sizes: ["S", "M", "L", "XL"],
    data: {
      S: { Waist: "30", Hip: "38", Length: "40", Thigh: "24" },
      M: { Waist: "32", Hip: "40", Length: "41", Thigh: "25" },
      L: { Waist: "34", Hip: "42", Length: "42", Thigh: "26" },
      XL: { Waist: "36", Hip: "44", Length: "43", Thigh: "27" },
    },
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadSampleData();
  initializeForm();
  setupEventListeners();
  updateDashboardStats();
  renderCollections();
  renderSizeOptions();
  renderActivityTable();
  initializeColorVariants();
  initializeHeroSection();
  loadPlaylists();
  renderAllProductsTable();
  renderInventoryTable();
  renderOrders();
  loadCategories();
  populateCategoryDropdown();

  // Render scalable components
  renderProductFlags();
  renderCollectionsList();

  // Fix any zoom issues
  fixZoomIssues();
});

function fixZoomIssues() {
  // Prevent zoom on mobile
  document.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  // Prevent double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );
}

function loadSampleData() {
  // Load categories first - SIMPLIFIED
  categories = [
    { id: 1, name: "T-Shirts", productCount: 2, createdAt: "2024-01-01" },
    { id: 2, name: "Hoodies", productCount: 1, createdAt: "2024-01-02" },
    { id: 3, name: "Sweatshirts", productCount: 1, createdAt: "2024-01-03" },
    { id: 4, name: "Jackets", productCount: 1, createdAt: "2024-01-04" },
    { id: 5, name: "Pants", productCount: 1, createdAt: "2024-01-05" },
    { id: 6, name: "Accessories", productCount: 1, createdAt: "2024-01-06" },
  ];

  // 6 Sample Products
  products = [
    {
      id: 1,
      title: "Premium Cotton T-Shirt",
      sku: "TSHIRT-BLK-M",
      description:
        "A premium quality cotton t-shirt with perfect fit and comfortable fabric. Made from 100% organic cotton, it's breathable and soft on skin.",
      price: 1599,
      discountPrice: 1299,
      stock: 45,
      lowStockAlert: 10,
      category: "t-shirts",
      colors: [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
      ],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          primary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=300&fit=crop",
          primary: false,
        },
      ],
      collections: ["top-picks", "custom-product"],
      flags: {
        topPicks: true,
        newArrival: true,
        featured: false,
        bestSeller: false,
        trending: true,
        limitedEdition: false,
      },
      status: { active: true, allowBackorder: false, requireShipping: true },
      additional: { weight: "0.3", material: "100% Organic Cotton" },
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Designer Hoodie",
      sku: "HOODIE-GRY-L",
      description:
        "Stylish designer hoodie with premium stitching and comfortable fabric. Perfect for casual outings and cool weather.",
      price: 3299,
      discountPrice: 2999,
      stock: 3,
      lowStockAlert: 5,
      category: "hoodies",
      colors: [
        { name: "Gray", value: "#808080" },
        { name: "Navy", value: "#000080" },
      ],
      sizes: ["M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
          primary: true,
        },
      ],
      collections: ["matching-products", "custom-product"],
      flags: {
        topPicks: false,
        newArrival: false,
        featured: true,
        bestSeller: true,
        trending: false,
        limitedEdition: false,
      },
      status: { active: true, allowBackorder: true, requireShipping: true },
      additional: { weight: "0.8", material: "Cotton Blend" },
      createdAt: "2024-01-14",
      updatedAt: "2024-01-14",
    },
    {
      id: 3,
      title: "Winter Sweatshirt",
      sku: "SWEAT-BRG-M",
      description:
        "Warm winter sweatshirt with fleece lining. Perfect for cold weather with comfortable fit and stylish design.",
      price: 2499,
      discountPrice: null,
      stock: 0,
      lowStockAlert: 3,
      category: "sweatshirts",
      colors: [{ name: "Burgundy", value: "#800020" }],
      sizes: ["S", "M", "L"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop",
          primary: true,
        },
      ],
      collections: ["new-arrivals"],
      flags: {
        topPicks: true,
        newArrival: true,
        featured: false,
        bestSeller: false,
        trending: true,
        limitedEdition: true,
      },
      status: { active: true, allowBackorder: false, requireShipping: true },
      additional: { weight: "0.6", material: "Fleece" },
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: 4,
      title: "Denim Jacket",
      sku: "JACKET-DNM-L",
      description:
        "Classic denim jacket with premium finish and durable fabric. Timeless design that goes with everything.",
      price: 4599,
      discountPrice: 3999,
      stock: 12,
      lowStockAlert: 5,
      category: "jackets",
      colors: [{ name: "Blue Denim", value: "#1560bd" }],
      sizes: ["S", "M", "L", "XL", "XXL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1524601500432-1e1a4c71d692?w=300&h=300&fit=crop",
          primary: true,
        },
      ],
      collections: ["top-picks", "matching-products", "custom-product"],
      flags: {
        topPicks: true,
        newArrival: false,
        featured: true,
        bestSeller: true,
        trending: true,
        limitedEdition: false,
      },
      status: { active: true, allowBackorder: false, requireShipping: true },
      additional: { weight: "1.2", material: "Denim" },
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
    },
    {
      id: 5,
      title: "Cargo Pants",
      sku: "PANTS-OLV-M",
      description:
        "Functional cargo pants with multiple pockets and comfortable fit. Made from durable cotton twill fabric.",
      price: 2899,
      discountPrice: 2499,
      stock: 8,
      lowStockAlert: 5,
      category: "pants",
      colors: [
        { name: "Olive Green", value: "#708238" },
        { name: "Black", value: "#000000" },
      ],
      sizes: ["S", "M", "L"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=300&fit=crop",
          primary: true,
        },
      ],
      collections: ["new-arrivals", "matching-products"],
      flags: {
        topPicks: false,
        newArrival: true,
        featured: false,
        bestSeller: false,
        trending: false,
        limitedEdition: false,
      },
      status: { active: true, allowBackorder: false, requireShipping: true },
      additional: { weight: "0.7", material: "Cotton Twill" },
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08",
    },
    {
      id: 6,
      title: "Leather Belt",
      sku: "BELT-BRN-32",
      description:
        "Genuine leather belt with premium buckle. Classic design that complements any outfit.",
      price: 1299,
      discountPrice: 999,
      stock: 25,
      lowStockAlert: 10,
      category: "accessories",
      colors: [
        { name: "Brown", value: "#964B00" },
        { name: "Black", value: "#000000" },
      ],
      sizes: ["S", "M", "L"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
          primary: true,
        },
      ],
      collections: ["top-picks"],
      flags: {
        topPicks: true,
        newArrival: false,
        featured: false,
        bestSeller: true,
        trending: false,
        limitedEdition: false,
      },
      status: { active: true, allowBackorder: false, requireShipping: true },
      additional: { weight: "0.2", material: "Genuine Leather" },
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05",
    },
  ];

  // Sample inventory data
  inventory = products.map((product) => ({
    id: product.id,
    name: product.title,
    sku: product.sku,
    category: product.category,
    currentStock: product.stock,
    lowStockAlert: product.lowStockAlert,
    status:
      product.stock === 0
        ? "out-of-stock"
        : product.stock <= product.lowStockAlert
          ? "low-stock"
          : "in-stock",
    lastUpdated: product.updatedAt,
    price: product.price,
    color: product.colors[0]?.name || "Multiple",
    size: product.sizes[0] || "Multiple",
  }));

  // Sample activities
  activities = [
    {
      id: 1,
      product: "Premium Cotton T-Shirt",
      type: "Stock Update",
      date: "2024-01-15",
      status: "updated",
    },
    {
      id: 2,
      product: "Designer Hoodie",
      type: "Low Stock Alert",
      date: "2024-01-14",
      status: "warning",
    },
    {
      id: 3,
      product: "Winter Sweatshirt",
      type: "Out of Stock",
      date: "2024-01-10",
      status: "danger",
    },
    {
      id: 4,
      product: "Denim Jacket",
      type: "Price Update",
      date: "2024-01-12",
      status: "updated",
    },
    {
      id: 5,
      product: "Cargo Pants",
      type: "New Arrival",
      date: "2024-01-08",
      status: "updated",
    },
  ];

  // Sample orders with enhanced details - INCLUDING SIZE AND COLOR
  orders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      email: "john.smith@email.com",
      phone: "+91 98765 43210",
      date: "2024-01-15",
      status: "pending",
      total: 5898,
      subtotal: 5898,
      shipping: 99,
      tax: 1061.64,
      paymentMethod: "Credit Card",
      transactionId: "TXN-001234",
      paymentStatus: "Paid",
      items: [
        {
          id: 4,
          name: "Denim Jacket",
          sku: "JACKET-DNM-L",
          quantity: 1,
          price: 4599,
          size: "L",
          color: "Blue Denim",
          colorValue: "#1560bd",
        },
        {
          id: 6,
          name: "Leather Belt",
          sku: "BELT-BRN-32",
          quantity: 1,
          price: 1299,
          size: "32",
          color: "Brown",
          colorValue: "#964B00",
        },
      ],
      shippingAddress: {
        name: "John Smith",
        address: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      },
      billingAddress: {
        name: "John Smith",
        address: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      },
    },
    {
      id: "ORD-002",
      customer: "Emma Johnson",
      email: "emma.j@email.com",
      phone: "+91 87654 32109",
      date: "2024-01-14",
      status: "processing",
      total: 1599,
      subtotal: 1599,
      shipping: 99,
      tax: 287.82,
      paymentMethod: "UPI",
      transactionId: "TXN-001235",
      paymentStatus: "Paid",
      items: [
        {
          id: 1,
          name: "Premium Cotton T-Shirt",
          sku: "TSHIRT-BLK-M",
          quantity: 1,
          price: 1599,
          size: "M",
          color: "Black",
          colorValue: "#000000",
        },
      ],
      shippingAddress: {
        name: "Emma Johnson",
        address: "456 Park Avenue",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      billingAddress: {
        name: "Emma Johnson",
        address: "456 Park Avenue",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
    },
    {
      id: "ORD-003",
      customer: "Michael Brown",
      email: "michael.b@email.com",
      phone: "+91 76543 21098",
      date: "2024-01-13",
      status: "completed",
      total: 6697,
      subtotal: 6598,
      shipping: 99,
      tax: 1187.64,
      paymentMethod: "Net Banking",
      transactionId: "TXN-001236",
      paymentStatus: "Paid",
      items: [
        {
          id: 2,
          name: "Designer Hoodie",
          sku: "HOODIE-GRY-L",
          quantity: 2,
          price: 3299,
          size: "L",
          color: "Gray",
          colorValue: "#808080",
        },
      ],
      shippingAddress: {
        name: "Michael Brown",
        address: "789 Ocean Drive, Villa 12",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        country: "India",
      },
      billingAddress: {
        name: "Michael Brown",
        address: "789 Ocean Drive, Villa 12",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        country: "India",
      },
    },
    // Additional sample orders with sizes
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      email: "sarah.w@email.com",
      phone: "+91 65432 10987",
      date: "2024-01-12",
      status: "completed",
      total: 8197,
      subtotal: 8098,
      shipping: 99,
      tax: 1457.64,
      paymentMethod: "Credit Card",
      transactionId: "TXN-001237",
      paymentStatus: "Paid",
      items: [
        {
          id: 4,
          name: "Denim Jacket",
          sku: "JACKET-DNM-M",
          quantity: 1,
          price: 4599,
          size: "M",
          color: "Blue Denim",
          colorValue: "#1560bd",
        },
        {
          id: 5,
          name: "Cargo Pants",
          sku: "PANTS-OLV-L",
          quantity: 1,
          price: 2899,
          size: "L",
          color: "Olive Green",
          colorValue: "#708238",
        },
        {
          id: 6,
          name: "Leather Belt",
          sku: "BELT-BLK-30",
          quantity: 1,
          price: 1299,
          size: "30",
          color: "Black",
          colorValue: "#000000",
        },
      ],
      shippingAddress: {
        name: "Sarah Wilson",
        address: "101 Palm Street",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001",
        country: "India",
      },
      billingAddress: {
        name: "Sarah Wilson",
        address: "101 Palm Street",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001",
        country: "India",
      },
    },
    {
      id: "ORD-005",
      customer: "David Lee",
      email: "david.l@email.com",
      phone: "+91 54321 09876",
      date: "2024-01-11",
      status: "pending",
      total: 4198,
      subtotal: 4099,
      shipping: 99,
      tax: 737.82,
      paymentMethod: "UPI",
      transactionId: "TXN-001238",
      paymentStatus: "Pending",
      items: [
        {
          id: 1,
          name: "Premium Cotton T-Shirt",
          sku: "TSHIRT-WHT-XL",
          quantity: 2,
          price: 1599,
          size: "XL",
          color: "White",
          colorValue: "#ffffff",
        },
        {
          id: 3,
          name: "Winter Sweatshirt",
          sku: "SWEAT-BRG-L",
          quantity: 1,
          price: 2499,
          size: "L",
          color: "Burgundy",
          colorValue: "#800020",
        },
      ],
      shippingAddress: {
        name: "David Lee",
        address: "202 Cedar Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        country: "India",
      },
      billingAddress: {
        name: "David Lee",
        address: "202 Cedar Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        country: "India",
      },
    },
  ];

  // Sample hero images
  heroImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop",
      slot: 1,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
      slot: 2,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1558769132-cb1cb458edf4?w=1920&h=1080&fit=crop",
      slot: 3,
    },
  ];

  // Sample playlists
  playlists = {
    "top-picks": [1, 4, 6], // Product IDs
    "new-arrivals": [1, 3, 5],
    "matching-products": [1, 2, 4, 5],
  };
}

function initializeForm() {
  // Initialize form tabs
  document.querySelectorAll(".form-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Character counter for description
  const description = document.getElementById("productDescription");
  description.addEventListener("input", updateCharCounter);
}

function setupEventListeners() {
  // Form submission
  document
    .getElementById("productForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      submitProductForm();
    });
}

function updateCharCounter() {
  const textarea = document.getElementById("productDescription");
  const counter = document.getElementById("charCounter");
  const length = textarea.value.length;
  counter.textContent = `${length}/300`;

  if (length < 150 || length > 300) {
    counter.classList.add("error");
  } else {
    counter.classList.remove("error");
  }
}

// Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add("active");
  }

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
  if (navLink) {
    navLink.classList.add("active");
  }

  // Update page title
  updatePageTitle(sectionId);

  // Close sidebar on mobile
  if (window.innerWidth <= 1200) {
    document.querySelector(".sidebar").classList.remove("active");
  }

  // Refresh data if needed
  if (sectionId === "dashboard") {
    renderActivityTable();
  } else if (sectionId === "playlists") {
    loadPlaylists();
  } else if (sectionId === "all-products") {
    renderAllProductsTable();
  } else if (sectionId === "inventory") {
    renderInventoryTable();
  } else if (sectionId === "orders") {
    renderOrders();
  } else if (sectionId === "categories") {
    loadCategories();
  }
}

function updatePageTitle(sectionId) {
  const titles = {
    dashboard: "Dashboard Overview",
    categories: "Category Management",
    "hero-section": "Hero Section Management",
    playlists: "Playlist Management",
    "add-product": "Add New Product",
    "all-products": "All Products",
    inventory: "Inventory Management",
    orders: "Order Management",
  };

  const title = titles[sectionId] || "Dashboard";
  document.getElementById("pageTitle").textContent = title;
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("active");
}

// Dashboard Functions
function updateDashboardStats() {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockItems = inventory.filter(
    (item) => item.status === "low-stock",
  ).length;

  // Update stats
  document.getElementById("statTotalOrders").textContent = totalOrders;
  document.getElementById("statTotalProducts").textContent = totalProducts;
  document.getElementById("statPendingOrders").textContent = pendingOrders;
  document.getElementById("statLowStock").textContent = lowStockItems;

  // Update badges
  updateBadges();
}

function updateBadges() {
  const totalProducts = products.length;
  const lowStockItems = inventory.filter(
    (item) => item.status === "low-stock",
  ).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  document.getElementById("totalProductsBadge").textContent = totalProducts;
  document.getElementById("lowStockBadge").textContent = lowStockItems;
  document.getElementById("totalOrdersBadge").textContent = totalOrders;
}

function renderActivityTable() {
  const table = document.getElementById("activityTable");
  table.innerHTML = activities
    .map((activity) => {
      const statusClass =
        activity.status === "updated"
          ? "status-in-stock"
          : activity.status === "warning"
            ? "status-low-stock"
            : "status-out-of-stock";
      const statusText =
        activity.status === "updated"
          ? "Updated"
          : activity.status === "warning"
            ? "Warning"
            : "Alert";

      return `
                    <tr>
                        <td>${activity.id}</td>
                        <td><strong>${activity.product}</strong></td>
                        <td>${activity.type}</td>
                        <td>${activity.date}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
    })
    .join("");
}

function searchActivities(query) {
  if (!query.trim()) {
    renderActivityTable();
    return;
  }

  const filtered = activities.filter(
    (activity) =>
      activity.product.toLowerCase().includes(query.toLowerCase()) ||
      activity.type.toLowerCase().includes(query.toLowerCase()),
  );

  const table = document.getElementById("activityTable");
  table.innerHTML = filtered
    .map((activity) => {
      const statusClass =
        activity.status === "updated"
          ? "status-in-stock"
          : activity.status === "warning"
            ? "status-low-stock"
            : "status-out-of-stock";
      const statusText =
        activity.status === "updated"
          ? "Updated"
          : activity.status === "warning"
            ? "Warning"
            : "Alert";

      return `
                    <tr>
                        <td>${activity.id}</td>
                        <td><strong>${activity.product}</strong></td>
                        <td>${activity.type}</td>
                        <td>${activity.date}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
    })
    .join("");
}

// Category Management Functions - SIMPLIFIED
function loadCategories() {
  renderCategoriesGrid();
}

function renderCategoriesGrid() {
  const grid = document.getElementById("categoriesGrid");

  grid.innerHTML = categories
    .map(
      (category) => `
                <div class="category-card">
                    <div class="category-card-header">
                        <div class="category-name">${category.name}</div>
                    </div>
                    <div class="category-card-actions">
                        <button class="btn btn-icon btn-sm" onclick="editCategory(${category.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-sm" onclick="deleteCategory(${category.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="category-products">
                        ${category.productCount} products
                    </div>
                    <div style="font-size: 11px; color: var(--dark-gray); margin-top: 8px;">
                        Created: ${category.createdAt}
                    </div>
                </div>
            `,
    )
    .join("");
}

function openAddCategoryModal() {
  editingCategoryId = null;
  document.getElementById("categoryModalTitle").textContent =
    "Add New Category";
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryModal").style.display = "flex";
}

function editCategory(categoryId) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return;

  editingCategoryId = categoryId;
  document.getElementById("categoryModalTitle").textContent = "Edit Category";
  document.getElementById("categoryName").value = category.name;
  document.getElementById("categoryModal").style.display = "flex";
}

function closeCategoryModal() {
  document.getElementById("categoryModal").style.display = "none";
  editingCategoryId = null;
}

function saveCategory() {
  const name = document.getElementById("categoryName").value.trim();

  if (!name) {
    alert("Please enter a category name");
    return;
  }

  if (editingCategoryId) {
    // Update existing category
    const category = categories.find((c) => c.id === editingCategoryId);
    if (category) {
      category.name = name;
    }
  } else {
    // Add new category
    const newCategory = {
      id:
        categories.length > 0
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1,
      name: name,
      productCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    categories.push(newCategory);
  }

  closeCategoryModal();
  renderCategoriesGrid();
  populateCategoryDropdown();
  showNotification(
    `Category ${editingCategoryId ? "updated" : "added"} successfully!`,
  );
}

function deleteCategory(categoryId) {
  if (
    !confirm(
      "Are you sure you want to delete this category? Products in this category will be uncategorized.",
    )
  ) {
    return;
  }

  // Check if any products use this category
  const category = categories.find((c) => c.id === categoryId);
  if (category && category.productCount > 0) {
    if (
      !confirm(
        `This category has ${category.productCount} products. They will become uncategorized. Continue?`,
      )
    ) {
      return;
    }
  }

  // Remove category
  categories = categories.filter((c) => c.id !== categoryId);

  // Update products that used this category
  products.forEach((product) => {
    if (product.category === category.name.toLowerCase()) {
      product.category = "uncategorized";
    }
  });

  renderCategoriesGrid();
  populateCategoryDropdown();
  renderAllProductsTable();
  showNotification("Category deleted successfully!");
}

function searchCategories(query) {
  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase()),
  );

  const grid = document.getElementById("categoriesGrid");

  grid.innerHTML = filtered
    .map(
      (category) => `
                <div class="category-card">
                    <div class="category-card-header">
                        <div class="category-name">${category.name}</div>
                    </div>
                    <div class="category-card-actions">
                        <button class="btn btn-icon btn-sm" onclick="editCategory(${category.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-sm" onclick="deleteCategory(${category.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="category-products">
                        ${category.productCount} products
                    </div>
                </div>
            `,
    )
    .join("");
}

function populateCategoryDropdown() {
  const select = document.getElementById("productCategory");
  const currentValue = select.value;

  select.innerHTML =
    '<option value="">Select Category</option>' +
    categories
      .map(
        (category) => `
                    <option value="${category.name.toLowerCase()}">${category.name}</option>
                `,
      )
      .join("");

  // Restore previous value if it exists
  if (currentValue) {
    select.value = currentValue;
  }
}

// Product Form Functions
function switchTab(tabId) {
  // Update active tab
  document.querySelectorAll(".form-tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.getAttribute("data-tab") === tabId) {
      tab.classList.add("active");
    }
  });

  // Show corresponding content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabId}-tab`).classList.add("active");
}

// Scalable Collections Management
function renderCollections() {
  const container = document.getElementById("collectionOptions");
  container.innerHTML = collections
    .map(
      (collection) => `
                <div class="collection-option ${selectedCollections.has(collection.id) ? "active" : ""}" 
                     data-collection="${collection.id}"
                     onclick="toggleCollection('${collection.id}', this)">
                    <div class="collection-icon">
                        <i class="${collection.icon}"></i>
                    </div>
                    <div class="collection-name">${collection.name}</div>
                </div>
            `,
    )
    .join("");
}

function renderCollectionsList() {
  const container = document.getElementById("collectionsList");
  container.innerHTML = collections
    .map(
      (collection) => `
                <div class="collection-item">
                    <div class="collection-item-info">
                        <i class="${collection.icon}" style="color: var(--accent);"></i>
                        <div class="collection-item-name">${collection.name}</div>
                    </div>
                    <button class="btn btn-icon btn-sm" onclick="removeCollectionFromList('${collection.id}')" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `,
    )
    .join("");
}

function openAddCollectionModal() {
  document.getElementById("addCollectionModal").style.display = "flex";
}

function closeAddCollectionModal() {
  document.getElementById("addCollectionModal").style.display = "none";
  document.getElementById("collectionName").value = "";
  document.getElementById("collectionIcon").value = "fas fa-cogs";
}

function saveNewCollection() {
  const name = document.getElementById("collectionName").value.trim();
  const icon = document.getElementById("collectionIcon").value;

  if (!name) {
    alert("Please enter a collection name");
    return;
  }

  // Check if collection already exists
  if (collections.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    alert("A collection with this name already exists");
    return;
  }

  // Generate unique ID
  const id = name.toLowerCase().replace(/\s+/g, "-");

  // Add new collection
  const newCollection = {
    id: id,
    name: name,
    icon: icon,
  };

  collections.push(newCollection);

  // Update UI
  renderCollections();
  renderCollectionsList();
  closeAddCollectionModal();
  showNotification(`Collection "${name}" added successfully!`);
}

function removeCollectionFromList(collectionId) {
  // Don't allow removing default collections
  const defaultCollections = [
    "top-picks",
    "new-arrivals",
    "matching-products",
    "custom-product",
  ];
  if (defaultCollections.includes(collectionId)) {
    alert("Default collections cannot be removed");
    return;
  }

  if (!confirm("Are you sure you want to remove this collection?")) {
    return;
  }

  // Remove collection from array
  collections = collections.filter((c) => c.id !== collectionId);

  // Remove from selected collections
  selectedCollections.delete(collectionId);

  // Update UI
  renderCollections();
  renderCollectionsList();
  updateSelectedCollectionsDisplay();
  showNotification("Collection removed successfully!");
}

function toggleCollection(collectionId, element) {
  if (selectedCollections.has(collectionId)) {
    selectedCollections.delete(collectionId);
    element.classList.remove("active");
  } else {
    selectedCollections.add(collectionId);
    element.classList.add("active");
  }
  updateSelectedCollectionsDisplay();
}

function updateSelectedCollectionsDisplay() {
  const container = document.getElementById("selectedCollections");
  container.innerHTML = "";

  selectedCollections.forEach((collectionId) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (collection) {
      const tag = document.createElement("div");
      tag.className = "collection-tag";
      tag.innerHTML = `
                        <i class="${collection.icon}"></i>
                        <span>${collection.name}</span>
                        <i class="fas fa-times" onclick="removeCollection('${collectionId}')"></i>
                    `;
      container.appendChild(tag);
    }
  });
}

function removeCollection(collectionId) {
  selectedCollections.delete(collectionId);
  updateSelectedCollectionsDisplay();

  // Update collection option
  const option = document.querySelector(
    `.collection-option[data-collection="${collectionId}"]`,
  );
  if (option) {
    option.classList.remove("active");
  }
}

// Scalable Product Flags Management
function renderProductFlags() {
  const container = document.getElementById("productFlagsContainer");
  container.innerHTML = productFlags
    .map(
      (flag) => `
                <div class="flag-item">
                    <div class="flag-item-info">
                        <label class="checkbox-group">
                            <input type="checkbox" id="${flag.id}" ${flag.checked ? "checked" : ""}>
                            <span class="flag-item-name">${flag.name}</span>
                        </label>
                    </div>
                    <button class="btn btn-icon btn-sm" onclick="removeFlag('${flag.id}')" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `,
    )
    .join("");
}

function addNewFlag() {
  const flagName = document.getElementById("newFlagName").value.trim();

  if (!flagName) {
    alert("Please enter a flag name");
    return;
  }

  // Check if flag already exists
  if (
    productFlags.some((f) => f.name.toLowerCase() === flagName.toLowerCase())
  ) {
    alert("A flag with this name already exists");
    return;
  }

  // Generate unique ID
  const id = flagName.toLowerCase().replace(/\s+/g, "-");

  // Add new flag
  const newFlag = {
    id: id,
    name: flagName,
    checked: false,
  };

  productFlags.push(newFlag);

  // Update UI
  renderProductFlags();
  document.getElementById("newFlagName").value = "";
  showNotification(`Flag "${flagName}" added successfully!`);
}

function removeFlag(flagId) {
  // Don't allow removing default flags
  const defaultFlags = ["topPicks", "newArrival", "featuredProduct"];
  if (defaultFlags.includes(flagId)) {
    alert("Default flags cannot be removed");
    return;
  }

  if (!confirm("Are you sure you want to remove this flag?")) {
    return;
  }

  // Remove flag from array
  productFlags = productFlags.filter((f) => f.id !== flagId);

  // Update UI
  renderProductFlags();
  showNotification("Flag removed successfully!");
}

function renderSizeOptions() {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const container = document.getElementById("sizeOptionsContainer");

  container.innerHTML = sizes
    .map(
      (size) => `
                <div class="size-option" data-size="${size}" onclick="toggleSize('${size}', this)">
                    ${size}
                </div>
            `,
    )
    .join("");
}

function toggleSize(size, element) {
  if (selectedSizes.includes(size)) {
    selectedSizes = selectedSizes.filter((s) => s !== size);
    element.classList.remove("selected");
  } else {
    selectedSizes.push(size);
    element.classList.add("selected");
  }
  // Update size chart if sizes changed
  if (sizeChartData.sizes) {
    updateSizeChartSizes();
  }
}

function initializeColorVariants() {
  const colors = [
    { name: "Black", color: "#000000" },
    { name: "White", color: "#ffffff" },
    { name: "Navy", color: "#000080" },
    { name: "Gray", color: "#808080" },
  ];

  colors.forEach((color) => {
    addColorVariant(color.name, color.color);
  });
}

function addColorVariant(name = "New Color", color = "#000000") {
  const container = document.getElementById("colorVariantsContainer");
  const colorId = Date.now();

  const card = document.createElement("div");
  card.className = "color-variant-card";
  card.innerHTML = `
                <button type="button" class="remove-color" onclick="removeColorVariant(this)">
                    <i class="fas fa-times"></i>
                </button>
                <div class="color-header">
                    <div class="color-preview" style="background-color: ${color};"></div>
                    <input type="text" class="color-name-input" value="${name}" placeholder="Color Name" oninput="updateColorName(this)">
                </div>
                <input type="color" value="${color}" onchange="updateColorPreview(this)" style="width: 100%;">
            `;

  container.appendChild(card);
  selectedColors.push({ id: colorId, name, color });
}

function updateColorPreview(input) {
  const card = input.closest(".color-variant-card");
  const preview = card.querySelector(".color-preview");
  preview.style.backgroundColor = input.value;
}

function updateColorName(input) {
  // Update the color name in selectedColors array
  const card = input.closest(".color-variant-card");
  const colorInput = card.querySelector('input[type="color"]');
  const colorIndex = selectedColors.findIndex(
    (c) => c.color === colorInput.value,
  );
  if (colorIndex > -1) {
    selectedColors[colorIndex].name = input.value;
  }
}

function removeColorVariant(button) {
  const card = button.closest(".color-variant-card");
  card.remove();
}

// SIZE CHART FUNCTIONALITY
function loadSizeChartTemplate() {
  const template = document.getElementById("sizeChartTemplate").value;

  if (!template || template === "custom") {
    initializeCustomSizeChart();
    return;
  }

  const templateData = sizeChartTemplates[template];
  if (!templateData) return;

  // Set selected sizes from template
  selectedSizes = [...templateData.sizes];
  document.querySelectorAll(".size-option").forEach((option) => {
    const size = option.getAttribute("data-size");
    if (selectedSizes.includes(size)) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });

  // Initialize size chart data
  sizeChartData = {
    measurements: [...templateData.measurements],
    sizes: [...templateData.sizes],
    data: JSON.parse(JSON.stringify(templateData.data)),
  };

  renderSizeChart();
}

function initializeCustomSizeChart() {
  // Start with default sizes if none selected
  if (selectedSizes.length === 0) {
    selectedSizes = ["S", "M", "L"];
    document
      .querySelectorAll(
        '.size-option[data-size="S"], .size-option[data-size="M"], .size-option[data-size="L"]',
      )
      .forEach((option) => {
        option.classList.add("selected");
      });
  }

  sizeChartData = {
    measurements: ["Chest", "Length"],
    sizes: [...selectedSizes],
    data: {},
  };

  // Initialize empty data
  selectedSizes.forEach((size) => {
    sizeChartData.data[size] = {
      Chest: "",
      Length: "",
    };
  });

  renderSizeChart();
}

function renderSizeChart() {
  const header = document.getElementById("sizeChartHeader");
  const body = document.getElementById("sizeChartBody");

  if (!sizeChartData.sizes || sizeChartData.sizes.length === 0) {
    header.innerHTML = "<tr><th>Measurement</th></tr>";
    body.innerHTML =
      '<tr><td colspan="1" style="text-align: center; padding: 40px;">Select sizes and template first</td></tr>';
    return;
  }

  // Update header
  header.innerHTML = `
                <tr>
                    <th>Measurement</th>
                    ${sizeChartData.sizes.map((size) => `<th>${size}</th>`).join("")}
                    <th style="width: 50px;">Actions</th>
                </tr>
            `;

  // Update body
  body.innerHTML = sizeChartData.measurements
    .map(
      (measurement, index) => `
                <tr>
                    <td class="measurement-label">
                        <input type="text" class="form-control" value="${measurement}" 
                               onchange="updateMeasurementName(${index}, this.value)"
                               style="min-width: 150px;">
                    </td>
                    ${sizeChartData.sizes
                      .map(
                        (size) => `
                        <td>
                            <input type="text" 
                                   value="${sizeChartData.data[size]?.[measurement] || ""}"
                                   oninput="updateSizeChartValue('${size}', '${measurement}', this.value)"
                                   placeholder="--">
                        </td>
                    `,
                      )
                      .join("")}
                    <td>
                        <button class="btn btn-icon" onclick="removeMeasurement(${index})" title="Remove Measurement">
                            <i class="fas fa-trash" style="font-size: 12px;"></i>
                        </button>
                    </td>
                </tr>
            `,
    )
    .join("");
}

function updateSizeChartSizes() {
  if (!sizeChartData.sizes) return;

  // Add new sizes
  selectedSizes.forEach((size) => {
    if (!sizeChartData.sizes.includes(size)) {
      sizeChartData.sizes.push(size);
      sizeChartData.data[size] = {};
      sizeChartData.measurements.forEach((measurement) => {
        sizeChartData.data[size][measurement] = "";
      });
    }
  });

  // Remove unselected sizes
  sizeChartData.sizes = sizeChartData.sizes.filter((size) =>
    selectedSizes.includes(size),
  );
  Object.keys(sizeChartData.data).forEach((size) => {
    if (!selectedSizes.includes(size)) {
      delete sizeChartData.data[size];
    }
  });

  renderSizeChart();
}

function addSizeChartMeasurement() {
  if (!sizeChartData.measurements) {
    sizeChartData.measurements = [];
    sizeChartData.data = {};
  }

  const measurementName = `Measurement ${sizeChartData.measurements.length + 1}`;
  sizeChartData.measurements.push(measurementName);

  // Add to all sizes
  sizeChartData.sizes.forEach((size) => {
    if (!sizeChartData.data[size]) {
      sizeChartData.data[size] = {};
    }
    sizeChartData.data[size][measurementName] = "";
  });

  renderSizeChart();
}

function addSizeChartSize() {
  const sizeName = prompt("Enter new size name:");
  if (!sizeName) return;

  if (!sizeChartData.sizes) sizeChartData.sizes = [];
  if (!sizeChartData.data) sizeChartData.data = {};
  if (!sizeChartData.measurements)
    sizeChartData.measurements = ["Chest", "Length"];

  sizeChartData.sizes.push(sizeName);
  sizeChartData.data[sizeName] = {};

  // Initialize with empty values for all measurements
  sizeChartData.measurements.forEach((measurement) => {
    sizeChartData.data[sizeName][measurement] = "";
  });

  // Add to selected sizes and update UI
  selectedSizes.push(sizeName);
  renderSizeOptions(); // Re-render to show new size
  renderSizeChart();
}

function updateMeasurementName(index, newName) {
  const oldName = sizeChartData.measurements[index];
  sizeChartData.measurements[index] = newName;

  // Update data structure
  sizeChartData.sizes.forEach((size) => {
    if (
      sizeChartData.data[size] &&
      sizeChartData.data[size][oldName] !== undefined
    ) {
      sizeChartData.data[size][newName] = sizeChartData.data[size][oldName];
      delete sizeChartData.data[size][oldName];
    }
  });
}

function updateSizeChartValue(size, measurement, value) {
  if (!sizeChartData.data[size]) {
    sizeChartData.data[size] = {};
  }
  sizeChartData.data[size][measurement] = value;
}

function removeMeasurement(index) {
  const measurement = sizeChartData.measurements[index];
  sizeChartData.measurements.splice(index, 1);

  // Remove from all sizes
  sizeChartData.sizes.forEach((size) => {
    if (sizeChartData.data[size]) {
      delete sizeChartData.data[size][measurement];
    }
  });

  renderSizeChart();
}

function resetSizeChart() {
  if (
    confirm(
      "Are you sure you want to reset the size chart? All data will be lost.",
    )
  ) {
    sizeChartData = {};
    selectedSizes = [];
    document.querySelectorAll(".size-option").forEach((option) => {
      option.classList.remove("selected");
    });
    renderSizeChart();
  }
}

function triggerImageUpload() {
  document.getElementById("imageUpload").click();
}

function handleImageUpload(event) {
  const files = event.target.files;
  const preview = document.getElementById("imagePreview");

  // Check max limit
  const currentCount = preview.children.length;
  if (currentCount + files.length > 5) {
    alert("Maximum 5 images allowed. Remove some images first.");
    return;
  }

  Array.from(files)
    .slice(0, 5 - currentCount)
    .forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imgUrl = e.target.result;
          uploadedImages.push({
            url: imgUrl,
            name: file.name,
            primary: uploadedImages.length === 0,
          });

          renderImagePreviews();
        };
        reader.readAsDataURL(file);
      }
    });

  // Reset file input
  event.target.value = "";
}

function renderImagePreviews() {
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = uploadedImages
    .map(
      (img, index) => `
                <div class="preview-image">
                    <img src="${img.url}" alt="Product Image ${index + 1}">
                    <div class="image-actions">
                        <button class="image-action-btn" onclick="setAsPrimaryImage(${index})" 
                                title="${img.primary ? "Primary Image" : "Set as primary"}">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="image-action-btn" onclick="removeImage(${index})" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${img.primary ? '<div style="position: absolute; bottom: 5px; left: 5px; background: var(--accent); color: white; padding: 2px 8px; font-size: 10px;">Primary</div>' : ""}
                </div>
            `,
    )
    .join("");
}

function setAsPrimaryImage(index) {
  uploadedImages.forEach((img, i) => {
    img.primary = i === index;
  });
  renderImagePreviews();
}

function removeImage(index) {
  uploadedImages.splice(index, 1);
  // If we removed the primary image and there are other images, set first as primary
  if (uploadedImages.length > 0 && !uploadedImages.some((img) => img.primary)) {
    uploadedImages[0].primary = true;
  }
  renderImagePreviews();
}

function submitProductForm() {
  // Validate description length
  const description = document.getElementById("productDescription").value;
  if (description.length < 150 || description.length > 300) {
    alert("Description must be between 150 and 300 characters");
    return;
  }

  // Validate required fields
  const requiredFields = [
    "productTitle",
    "productSKU",
    "productPrice",
    "productStock",
    "productCategory",
  ];
  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      alert(`Please fill in ${field.previousElementSibling.textContent}`);
      field.focus();
      return;
    }
  }

  // Validate at least one image
  if (uploadedImages.length === 0) {
    alert("Please upload at least one product image");
    return;
  }

  // Get color variants
  const colorElements = document.querySelectorAll(".color-variant-card");
  const colorVariants = Array.from(colorElements).map((card) => {
    const nameInput = card.querySelector(".color-name-input");
    const colorInput = card.querySelector('input[type="color"]');
    return {
      name: nameInput.value || "Unnamed Color",
      value: colorInput.value,
    };
  });

  // Get size chart data if exists
  let finalSizeChartData = {};
  if (sizeChartData.sizes && sizeChartData.sizes.length > 0) {
    finalSizeChartData = JSON.parse(JSON.stringify(sizeChartData));
  }

  // Get product flags
  const flags = {};
  productFlags.forEach((flag) => {
    const checkbox = document.getElementById(flag.id);
    flags[flag.id] = checkbox ? checkbox.checked : false;
  });

  // Create product object
  const product = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    title: document.getElementById("productTitle").value,
    sku: document.getElementById("productSKU").value,
    description: description,
    price: parseFloat(document.getElementById("productPrice").value),
    discountPrice: document.getElementById("productDiscountPrice").value
      ? parseFloat(document.getElementById("productDiscountPrice").value)
      : null,
    stock: parseInt(document.getElementById("productStock").value),
    lowStockAlert:
      parseInt(document.getElementById("productLowStockAlert").value) || 5,
    category: document.getElementById("productCategory").value,
    colors: colorVariants,
    sizes: selectedSizes,
    sizeChart: finalSizeChartData,
    images: uploadedImages.map((img) => ({
      url: img.url,
      primary: img.primary,
    })),
    collections: Array.from(selectedCollections),
    flags: flags,
    status: {
      active: document.getElementById("isActive").checked,
      allowBackorder: document.getElementById("allowBackorder").checked,
      requireShipping: document.getElementById("requireShipping").checked,
    },
    additional: {
      weight: document.getElementById("productWeight").value || null,
      material: document.getElementById("productMaterial").value || null,
    },
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  // Add to products array
  products.push(product);

  // Update category product count
  const category = categories.find(
    (c) => c.name.toLowerCase() === product.category,
  );
  if (category) {
    category.productCount++;
  }

  // Add to inventory
  const status =
    product.stock === 0
      ? "out-of-stock"
      : product.stock <= product.lowStockAlert
        ? "low-stock"
        : "in-stock";

  inventory.push({
    id: product.id,
    name: product.title,
    sku: product.sku,
    category: product.category,
    currentStock: product.stock,
    lowStockAlert: product.lowStockAlert,
    status: status,
    lastUpdated: product.updatedAt,
    price: product.price,
    color: product.colors[0]?.name || "Multiple",
    size: product.sizes[0] || "Multiple",
  });

  // Add activity
  activities.unshift({
    id: activities.length + 1,
    product: product.title,
    type: "Product Added",
    date: new Date().toISOString().split("T")[0],
    status: "updated",
  });

  // Update dashboard
  updateDashboardStats();

  // Show success modal
  showSuccessModal(`"${product.title}" published successfully!`);

  // Reset form
  resetProductForm();
}

function resetProductForm() {
  document.getElementById("productForm").reset();
  document.getElementById("charCounter").textContent = "0/300";
  document.getElementById("charCounter").classList.remove("error");

  // Clear color variants
  document.getElementById("colorVariantsContainer").innerHTML = "";
  selectedColors = [];
  initializeColorVariants();

  // Clear size selections
  selectedSizes = [];
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Clear size chart
  sizeChartData = {};
  document.getElementById("sizeChartHeader").innerHTML = "";
  document.getElementById("sizeChartBody").innerHTML = "";
  document.getElementById("sizeChartTemplate").value = "";

  // Clear images
  uploadedImages = [];
  renderImagePreviews();

  // Clear collections
  selectedCollections.clear();
  updateSelectedCollectionsDisplay();
  document.querySelectorAll(".collection-option").forEach((option) => {
    option.classList.remove("active");
  });

  // Reset product flags checkboxes
  productFlags.forEach((flag) => {
    flag.checked = flag.id === "newArrival"; // Default new arrival checked
  });
  renderProductFlags();

  // Switch to basic tab
  switchTab("basic");
}

function saveAsDraft() {
  // Save form data as draft
  const formData = {
    title: document.getElementById("productTitle").value,
    sku: document.getElementById("productSKU").value,
    description: document.getElementById("productDescription").value,
    price: document.getElementById("productPrice").value,
    // ... save other fields
  };

  localStorage.setItem("productDraft", JSON.stringify(formData));
  showNotification("Product saved as draft!");
}

function showSuccessModal(message) {
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("successModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("successModal").style.display = "none";
}

function viewAllProducts() {
  closeModal();
  showSection("all-products");
}

// HERO SECTION MANAGEMENT
function initializeHeroSection() {
  renderHeroImages();
}

function renderHeroImages() {
  const grid = document.getElementById("heroImagesGrid");
  grid.innerHTML = "";

  // Create 5 slots (minimum 2, maximum 5)
  for (let i = 1; i <= 5; i++) {
    const slot = document.createElement("div");
    slot.className = `hero-image-slot ${heroImages.find((img) => img.slot === i) ? "has-image" : ""}`;
    slot.dataset.slot = i;

    const heroImage = heroImages.find((img) => img.slot === i);

    if (heroImage) {
      slot.innerHTML = `
                        <div class="hero-image-slot-number">${i}</div>
                        <img src="${heroImage.url}" alt="Hero Image ${i}">
                        <div class="hero-image-actions">
                            <button class="hero-image-action-btn" onclick="changeHeroImage(${i})" title="Change Image">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="hero-image-action-btn" onclick="removeHeroImage(${i})" title="Remove Image">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
    } else {
      slot.innerHTML = `
                        <div class="hero-image-slot-number">${i}</div>
                        <i class="fas fa-plus" style="font-size: 48px; color: var(--dark-gray); margin-bottom: 16px;"></i>
                        <div style="font-weight: 600; margin-bottom: 8px;">Slot ${i}</div>
                        <div style="font-size: 14px; color: var(--dark-gray);">Click to upload image</div>
                    `;
      slot.onclick = function () {
        changeHeroImage(i);
      };
    }

    grid.appendChild(slot);
  }
}

function changeHeroImage(slotNumber) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Remove existing image for this slot
        heroImages = heroImages.filter((img) => img.slot !== slotNumber);

        // Add new image
        heroImages.push({
          id: Date.now(),
          url: e.target.result,
          slot: slotNumber,
        });

        renderHeroImages();
        showNotification(`Hero image for slot ${slotNumber} updated!`);
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function removeHeroImage(slotNumber) {
  if (heroImages.length <= 2) {
    alert(
      "Minimum 2 hero images are required. Please add another image before removing this one.",
    );
    return;
  }

  heroImages = heroImages.filter((img) => img.slot !== slotNumber);
  renderHeroImages();
  showNotification(`Hero image for slot ${slotNumber} removed!`);
}

function saveHeroSection() {
  if (heroImages.length < 2) {
    alert("Please add at least 2 hero images.");
    return;
  }

  localStorage.setItem("heroImages", JSON.stringify(heroImages));
  showNotification("Hero section saved successfully!");
}

function resetHeroSection() {
  if (confirm("Reset hero section to default images?")) {
    heroImages = [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop",
        slot: 1,
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
        slot: 2,
      },
    ];
    renderHeroImages();
    showNotification("Hero section reset to default!");
  }
}

// PLAYLIST MANAGEMENT
function switchPlaylistTab(tabId) {
  currentPlaylistTab = tabId;

  // Update active tab
  document.querySelectorAll(".playlist-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document
    .querySelector(`.playlist-tab[onclick*="${tabId}"]`)
    .classList.add("active");

  // Show corresponding content
  document.querySelectorAll(".playlist-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabId}-content`).classList.add("active");

  // Load playlist
  renderPlaylist(tabId);
}

function loadPlaylists() {
  // Load from localStorage or use sample data
  const savedPlaylists = localStorage.getItem("playlists");
  if (savedPlaylists) {
    playlists = JSON.parse(savedPlaylists);
  }

  renderPlaylist(currentPlaylistTab);
}

function renderPlaylist(playlistId) {
  const container = document.getElementById(
    `${playlistId.replace("-", "")}Products`,
  );
  if (!container) return;

  const productIds = playlists[playlistId] || [];
  const playlistProducts = products.filter((p) => productIds.includes(p.id));

  if (playlistProducts.length === 0) {
    container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--dark-gray);">
                        <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <div style="font-size: 16px; margin-bottom: 8px;">No products in this playlist</div>
                        <div style="font-size: 14px;">Click "Add Product" to add products to this playlist</div>
                    </div>
                `;
    return;
  }

  container.innerHTML = playlistProducts
    .map(
      (product, index) => `
                <div class="playlist-product-card" data-product-id="${product.id}">
                    <div class="playlist-product-header">
                        <img src="${product.images[0]?.url || "https://via.placeholder.com/60"}" 
                             alt="${product.title}" class="playlist-product-img">
                        <div class="playlist-product-info">
                            <div class="playlist-product-title">${product.title}</div>
                            <div class="playlist-product-sku">SKU: ${product.sku}</div>
                            <div style="font-size: 14px; color: var(--accent); font-weight: 600;">₹${product.price}</div>
                        </div>
                    </div>
                    <div class="playlist-product-actions">
                        <button class="btn btn-icon" onclick="editProductInPlaylist(${product.id}, '${playlistId}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon" onclick="removeProductFromPlaylist(${product.id}, '${playlistId}')" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="product-sortable-handle" title="Drag to reorder">
                            <i class="fas fa-arrows-alt"></i>
                        </div>
                    </div>
                    <div style="font-size: 12px; color: var(--dark-gray); margin-top: 8px;">
                        Position: ${index + 1} • ${product.category} • Stock: ${product.stock}
                    </div>
                </div>
            `,
    )
    .join("");
}

function openAddProductModal(playlistId) {
  currentPlaylistContext = playlistId;

  // Populate product select with SKU information
  const select = document.getElementById("playlistProductSelect");
  select.innerHTML =
    '<option value="">Select a product</option>' +
    products
      .map(
        (product) => `
                    <option value="${product.id}">${product.sku} - ${product.title} (₹${product.price})</option>
                `,
      )
      .join("");

  document.getElementById("addToPlaylistModal").style.display = "flex";
}

function closeAddToPlaylistModal() {
  document.getElementById("addToPlaylistModal").style.display = "none";
  currentPlaylistContext = "";
}

function addProductToPlaylist() {
  const select = document.getElementById("playlistProductSelect");
  const productId = parseInt(select.value);
  const position =
    parseInt(document.getElementById("playlistPosition").value) - 1;

  if (!productId) {
    alert("Please select a product");
    return;
  }

  // Check if product already in playlist
  if (playlists[currentPlaylistContext].includes(productId)) {
    alert("This product is already in the playlist");
    return;
  }

  // Add product at specified position
  playlists[currentPlaylistContext].splice(position, 0, productId);

  closeAddToPlaylistModal();
  renderPlaylist(currentPlaylistContext);
  showNotification("Product added to playlist!");
}

function removeProductFromPlaylist(productId, playlistId) {
  if (confirm("Remove this product from the playlist?")) {
    playlists[playlistId] = playlists[playlistId].filter(
      (id) => id !== productId,
    );
    renderPlaylist(playlistId);
    showNotification("Product removed from playlist!");
  }
}

function editProductInPlaylist(productId, playlistId) {
  // In a real application, this would open an edit modal
  alert(
    `Edit product ${productId} in ${playlistId}. In a real application, this would open an edit modal.`,
  );
}

function savePlaylists() {
  localStorage.setItem("playlists", JSON.stringify(playlists));
  showNotification("All playlists saved successfully!");
}

// ALL PRODUCTS TABLE
function renderAllProductsTable() {
  const table = document.getElementById("allProductsTable");

  table.innerHTML = products
    .map((product) => {
      const status =
        product.stock === 0
          ? "out-of-stock"
          : product.stock <= product.lowStockAlert
            ? "low-stock"
            : "in-stock";
      const statusClass =
        status === "in-stock"
          ? "status-in-stock"
          : status === "low-stock"
            ? "status-low-stock"
            : "status-out-of-stock";
      const statusText =
        status === "in-stock"
          ? "In Stock"
          : status === "low-stock"
            ? "Low Stock"
            : "Out of Stock";

      return `
                    <tr>
                        <td>${product.id}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <img src="${product.images[0]?.url || "https://via.placeholder.com/40"}" 
                                     alt="${product.title}" 
                                     style="width: 40px; height: 40px; object-fit: cover; border: 1px solid var(--border);">
                                <div>
                                    <div style="font-weight: 600;">${product.title}</div>
                                    <div style="font-size: 12px; color: var(--dark-gray);">${product.sku}</div>
                                </div>
                            </div>
                        </td>
                        <td>${product.category}</td>
                        <td>
                            <div style="font-weight: 600;">₹${product.price}</div>
                            ${product.discountPrice ? `<div style="font-size: 12px; color: var(--danger); text-decoration: line-through;">₹${product.discountPrice}</div>` : ""}
                        </td>
                        <td>${product.stock}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>
                            <button class="btn btn-sm" onclick="editProduct(${product.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm" onclick="deleteProduct(${product.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
    })
    .join("");
}

function editProduct(productId) {
  // In a real application, this would load product data into the form
  showSection("add-product");
  showNotification(
    `Edit product ${productId}. In a real application, this would load product data.`,
  );
}

function deleteProduct(productId) {
  if (
    confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    )
  ) {
    // Remove from products
    const product = products.find((p) => p.id === productId);
    products = products.filter((p) => p.id !== productId);

    // Remove from inventory
    inventory = inventory.filter((i) => i.id !== productId);

    // Remove from playlists
    Object.keys(playlists).forEach((playlistId) => {
      playlists[playlistId] = playlists[playlistId].filter(
        (id) => id !== productId,
      );
    });

    // Update category product count
    if (product) {
      const category = categories.find(
        (c) => c.name.toLowerCase() === product.category,
      );
      if (category && category.productCount > 0) {
        category.productCount--;
      }
    }

    renderAllProductsTable();
    renderInventoryTable();
    updateDashboardStats();
    showNotification("Product deleted successfully!");
  }
}

function searchProducts(query) {
  const filtered = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()),
  );

  const table = document.getElementById("allProductsTable");

  table.innerHTML = filtered
    .map((product) => {
      const status =
        product.stock === 0
          ? "out-of-stock"
          : product.stock <= product.lowStockAlert
            ? "low-stock"
            : "in-stock";
      const statusClass =
        status === "in-stock"
          ? "status-in-stock"
          : status === "low-stock"
            ? "status-low-stock"
            : "status-out-of-stock";
      const statusText =
        status === "in-stock"
          ? "In Stock"
          : status === "low-stock"
            ? "Low Stock"
            : "Out of Stock";

      return `
                    <tr>
                        <td>${product.id}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <img src="${product.images[0]?.url || "https://via.placeholder.com/40"}" 
                                     alt="${product.title}" 
                                     style="width: 40px; height: 40px; object-fit: cover; border: 1px solid var(--border);">
                                <div>
                                    <div style="font-weight: 600;">${product.title}</div>
                                    <div style="font-size: 12px; color: var(--dark-gray);">${product.sku}</div>
                                </div>
                            </div>
                        </td>
                        <td>${product.category}</td>
                        <td>₹${product.price}</td>
                        <td>${product.stock}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>
                            <button class="btn btn-sm" onclick="editProduct(${product.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;
    })
    .join("");
}

// INVENTORY TABLE
function renderInventoryTable() {
  const table = document.getElementById("inventoryTable");

  table.innerHTML = inventory
    .map((item) => {
      const statusClass =
        item.status === "in-stock"
          ? "status-in-stock"
          : item.status === "low-stock"
            ? "status-low-stock"
            : "status-out-of-stock";
      const statusText =
        item.status === "in-stock"
          ? "In Stock"
          : item.status === "low-stock"
            ? "Low Stock"
            : "Out of Stock";

      return `
                    <tr>
                        <td>${item.sku}</td>
                        <td style="font-weight: 600;">${item.name}</td>
                        <td>${item.category}</td>
                        <td>
                            <input type="number" class="stock-input" value="${item.currentStock}" 
                                   min="0" onchange="updateStock(${item.id}, this.value)">
                        </td>
                        <td>${item.lowStockAlert}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>${item.lastUpdated}</td>
                        <td>
                            <button class="btn btn-sm" onclick="updateStock(${item.id})" title="Update Stock">
                                <i class="fas fa-sync"></i>
                            </button>
                        </td>
                    </tr>
                `;
    })
    .join("");
}

function updateStock(productId, newStock) {
  const stock = parseInt(newStock);
  if (isNaN(stock) || stock < 0) return;

  // Update inventory
  const inventoryItem = inventory.find((i) => i.id === productId);
  if (inventoryItem) {
    inventoryItem.currentStock = stock;
    inventoryItem.status =
      stock === 0
        ? "out-of-stock"
        : stock <= inventoryItem.lowStockAlert
          ? "low-stock"
          : "in-stock";
    inventoryItem.lastUpdated = new Date().toISOString().split("T")[0];
  }

  // Update product
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.stock = stock;
    product.updatedAt = new Date().toISOString().split("T")[0];
  }

  // Add activity
  activities.unshift({
    id: activities.length + 1,
    product: product?.title || inventoryItem?.name,
    type: "Stock Updated",
    date: new Date().toISOString().split("T")[0],
    status: "updated",
  });

  renderInventoryTable();
  renderAllProductsTable();
  updateDashboardStats();
  showNotification("Stock updated successfully!");
}

function searchInventory(query) {
  const filtered = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sku.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  const table = document.getElementById("inventoryTable");

  table.innerHTML = filtered
    .map((item) => {
      const statusClass =
        item.status === "in-stock"
          ? "status-in-stock"
          : item.status === "low-stock"
            ? "status-low-stock"
            : "status-out-of-stock";
      const statusText =
        item.status === "in-stock"
          ? "In Stock"
          : item.status === "low-stock"
            ? "Low Stock"
            : "Out of Stock";

      return `
                    <tr>
                        <td>${item.sku}</td>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td>${item.currentStock}</td>
                        <td>${item.lowStockAlert}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>${item.lastUpdated}</td>
                        <td>
                            <button class="btn btn-sm" onclick="updateStock(${item.id})">
                                <i class="fas fa-sync"></i>
                            </button>
                        </td>
                    </tr>
                `;
    })
    .join("");
}

function exportInventory() {
  // In a real application, this would export to CSV
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "SKU,Product Name,Category,Current Stock,Low Stock Alert,Status,Last Updated\n" +
    inventory
      .map(
        (item) =>
          `${item.sku},${item.name},${item.category},${item.currentStock},${item.lowStockAlert},${item.status},${item.lastUpdated}`,
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "inventory_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification("Inventory exported successfully!");
}

// ORDERS MANAGEMENT with Enhanced Details and EXPORT ALL functionality
function renderOrders(filter = "all") {
  const container = document.getElementById("ordersList");
  let filteredOrders = orders;

  if (filter !== "all") {
    filteredOrders = orders.filter((order) => order.status === filter);
  }

  if (filteredOrders.length === 0) {
    container.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; color: var(--dark-gray);">
                        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <div style="font-size: 18px; margin-bottom: 8px;">No ${filter === "all" ? "" : filter} orders found</div>
                        <div style="font-size: 14px;">${filter === "pending" ? "All pending orders will appear here" : "All orders will appear here"}</div>
                    </div>
                `;
    return;
  }

  container.innerHTML = filteredOrders
    .map((order) => {
      const statusClass =
        order.status === "pending"
          ? "status-pending"
          : order.status === "processing"
            ? "status-processing"
            : order.status === "completed"
              ? "status-completed"
              : "status-warning";
      const statusText =
        order.status.charAt(0).toUpperCase() + order.status.slice(1);

      return `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <div style="font-weight: 600; font-size: 16px;">Order #${order.id}</div>
                                <div style="font-size: 14px; color: var(--dark-gray); margin-top: 4px;">
                                    Customer: ${order.customer} • Date: ${order.date}
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span class="status-badge ${statusClass}">${statusText}</span>
                                <div style="font-weight: 600; font-size: 18px;">₹${order.total}</div>
                            </div>
                        </div>
                        <div class="order-body">
                            <!-- Enhanced Order Details -->
                            <div class="order-details-grid">
                                <div class="order-detail-group">
                                    <h4>Customer Information</h4>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">Name:</span>
                                        <span class="order-detail-value">${order.customer}</span>
                                    </div>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">Email:</span>
                                        <span class="order-detail-value">${order.email}</span>
                                    </div>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">Phone:</span>
                                        <span class="order-detail-value">${order.phone}</span>
                                    </div>
                                </div>
                                
                                <div class="order-detail-group">
                                    <h4>Shipping Address</h4>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">Address:</span>
                                        <span class="order-detail-value">${order.shippingAddress.address}</span>
                                    </div>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">City:</span>
                                        <span class="order-detail-value">${order.shippingAddress.city}</span>
                                    </div>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">Pincode:</span>
                                        <span class="order-detail-value">${order.shippingAddress.pincode}</span>
                                    </div>
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">State:</span>
                                        <span class="order-detail-value">${order.shippingAddress.state}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="font-weight: 600; margin-bottom: 12px;">Order Items (${order.items.length})</div>
                            <div class="order-products">
                                ${order.items
                                  .map(
                                    (item) => `
                                    <div class="order-product">
                                        <img src="${products.find((p) => p.id === item.id)?.images[0]?.url || "https://via.placeholder.com/50"}" 
                                             alt="${item.name}" class="order-product-img">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600;">${item.name}</div>
                                            <div style="font-size: 12px; color: var(--dark-gray); margin-top: 2px;">
                                                SKU: ${item.sku}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                                ${item.size ? `<span class="size-badge">Size: ${item.size}</span>` : ""}
                                                ${
                                                  item.color
                                                    ? `
                                                    <div style="display: flex; align-items: center; gap: 4px;">
                                                        <span class="color-badge" style="background-color: ${item.colorValue || "#ccc"};"></span>
                                                        <span style="font-size: 12px;">${item.color}</span>
                                                    </div>
                                                `
                                                    : ""
                                                }
                                            </div>
                                            <div style="font-size: 14px; color: var(--dark-gray);">
                                                Quantity: ${item.quantity} × ₹${item.price}
                                            </div>
                                        </div>
                                        <div style="font-weight: 600;">₹${item.quantity * item.price}</div>
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                            <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
                                <button class="btn btn-sm" onclick="updateOrderStatus('${order.id}', 'processing')" ${order.status !== "pending" ? "disabled" : ""}>
                                    <i class="fas fa-cog"></i> Process
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.id}', 'completed')" ${order.status !== "processing" ? "disabled" : ""}>
                                    <i class="fas fa-check"></i> Complete
                                </button>
                                <button class="btn btn-sm" onclick="viewOrderDetails('${order.id}')">
                                    <i class="fas fa-eye"></i> Details
                                </button>
                                <button class="btn btn-sm" onclick="generateInvoice('${order.id}')">
                                    <i class="fas fa-file-invoice"></i> Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    })
    .join("");
}

function filterOrders(status) {
  // Update active filter button
  document.querySelectorAll(".order-filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  renderOrders(status);
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = newStatus;

    // Add activity
    activities.unshift({
      id: activities.length + 1,
      product: `Order #${orderId}`,
      type: `Order ${newStatus}`,
      date: new Date().toISOString().split("T")[0],
      status: "updated",
    });

    renderOrders();
    updateDashboardStats();
    showNotification(`Order #${orderId} status updated to ${newStatus}!`);
  }
}

function viewOrderDetails(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  const details = `
                Order ID: ${order.id}
                Customer: ${order.customer}
                Email: ${order.email}
                Phone: ${order.phone}
                Date: ${order.date}
                Status: ${order.status}
                Total: ₹${order.total}
                
                Shipping Address:
                ${order.shippingAddress.name}
                ${order.shippingAddress.address}
                ${order.shippingAddress.city}, ${order.shippingAddress.state}
                ${order.shippingAddress.pincode}, ${order.shippingAddress.country}
                
                Items:
                ${order.items.map((item) => `- ${item.name} (${item.sku}): ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price} | Size: ${item.size || "N/A"} | Color: ${item.color || "N/A"}`).join("\n")}
            `;

  alert(details);
}

// NEW FUNCTION: Export All Orders
function exportAllOrders() {
  if (orders.length === 0) {
    alert("No orders to export");
    return;
  }

  // Prepare CSV content
  const headers = [
    "Order ID",
    "Customer Name",
    "Email",
    "Phone",
    "Date",
    "Status",
    "Total Amount (₹)",
    "Payment Method",
    "Payment Status",
    "Shipping City",
    "Shipping State",
    "Item Count",
  ];

  const csvRows = orders.map((order) => {
    const row = [
      order.id,
      order.customer,
      order.email,
      order.phone,
      order.date,
      order.status,
      order.total,
      order.paymentMethod,
      order.paymentStatus,
      order.shippingAddress.city,
      order.shippingAddress.state,
      order.items.length,
    ];

    // Escape any commas in the data
    return row.map((field) => `"${field}"`).join(",");
  });

  const csvContent = [headers.join(","), ...csvRows].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `orders_export_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification(`Exported ${orders.length} orders successfully!`);
}

// PREMIUM INVOICE GENERATION
function generateInvoice(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  // Populate invoice details
  document.getElementById("invoiceDetails").innerHTML = `
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Invoice #:</span>
                    <span class="invoice-info-value">INV-${order.id.replace("ORD-", "")}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Order #:</span>
                    <span class="invoice-info-value">${order.id}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Invoice Date:</span>
                    <span class="invoice-info-value">${new Date().toLocaleDateString("en-IN")}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Due Date:</span>
                    <span class="invoice-info-value">${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}</span>
                </div>
            `;

  // Populate customer details
  document.getElementById("invoiceCustomer").innerHTML = `
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Name:</span>
                    <span class="invoice-info-value">${order.customer}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Email:</span>
                    <span class="invoice-info-value">${order.email}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Phone:</span>
                    <span class="invoice-info-value">${order.phone}</span>
                </div>
            `;

  // Populate shipping details
  document.getElementById("invoiceShipping").innerHTML = `
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Name:</span>
                    <span class="invoice-info-value">${order.shippingAddress.name}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Address:</span>
                    <span class="invoice-info-value">${order.shippingAddress.address}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">City, State:</span>
                    <span class="invoice-info-value">${order.shippingAddress.city}, ${order.shippingAddress.state}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Pincode:</span>
                    <span class="invoice-info-value">${order.shippingAddress.pincode}</span>
                </div>
                <div class="invoice-info-item">
                    <span class="invoice-info-label">Country:</span>
                    <span class="invoice-info-value">${order.shippingAddress.country}</span>
                </div>
            `;

  // Populate order items with size and color
  const itemsBody = document.getElementById("invoiceItemsBody");
  itemsBody.innerHTML = order.items
    .map(
      (item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.size || "N/A"}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${item.colorValue ? `<div class="color-badge" style="background-color: ${item.colorValue};"></div>` : ""}
                            <span>${item.color || "N/A"}</span>
                        </div>
                    </td>
                    <td>₹${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.quantity * item.price}</td>
                </tr>
            `,
    )
    .join("");

  // Calculate totals
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = order.shipping || 99;
  const tax = subtotal * 0.18; // 18% GST

  document.getElementById("invoiceSubtotal").textContent =
    `₹${subtotal.toFixed(2)}`;
  document.getElementById("invoiceShippingFee").textContent =
    `₹${shipping.toFixed(2)}`;
  document.getElementById("invoiceTax").textContent = `₹${tax.toFixed(2)}`;
  document.getElementById("invoiceTotal").textContent =
    `Total: ₹${(subtotal + shipping + tax).toFixed(2)}`;

  // Payment information
  document.getElementById("invoicePaymentMethod").textContent =
    order.paymentMethod;
  document.getElementById("invoiceTransactionId").textContent =
    order.transactionId;
  document.getElementById("invoicePaymentStatus").textContent =
    order.paymentStatus;

  // Show invoice modal
  document.getElementById("invoiceModal").style.display = "flex";
}

function closeInvoiceModal() {
  document.getElementById("invoiceModal").style.display = "none";
}

function printInvoice() {
  window.print();
}

function downloadInvoice() {
  // In a real application, this would generate a PDF
  showNotification(
    "Invoice PDF generation would be implemented with a backend service",
  );
}

function searchOrders(query) {
  const filtered = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.customer.toLowerCase().includes(query.toLowerCase()) ||
      order.status.toLowerCase().includes(query.toLowerCase()) ||
      order.email.toLowerCase().includes(query.toLowerCase()),
  );

  // Re-render with filtered orders
  const container = document.getElementById("ordersList");

  if (filtered.length === 0) {
    container.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; color: var(--dark-gray);">
                        <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <div style="font-size: 18px; margin-bottom: 8px;">No orders found</div>
                        <div style="font-size: 14px;">Try a different search term</div>
                    </div>
                `;
    return;
  }

  container.innerHTML = filtered
    .map((order) => {
      const statusClass =
        order.status === "pending"
          ? "status-pending"
          : order.status === "processing"
            ? "status-processing"
            : order.status === "completed"
              ? "status-completed"
              : "status-warning";
      const statusText =
        order.status.charAt(0).toUpperCase() + order.status.slice(1);

      return `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <div style="font-weight: 600; font-size: 16px;">Order #${order.id}</div>
                                <div style="font-size: 14px; color: var(--dark-gray); margin-top: 4px;">
                                    Customer: ${order.customer} • Date: ${order.date}
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span class="status-badge ${statusClass}">${statusText}</span>
                                <div style="font-weight: 600; font-size: 18px;">₹${order.total}</div>
                            </div>
                        </div>
                        <div class="order-body">
                            <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
                                <button class="btn btn-sm" onclick="updateOrderStatus('${order.id}', 'processing')" ${order.status !== "pending" ? "disabled" : ""}>
                                    <i class="fas fa-cog"></i> Process
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.id}', 'completed')" ${order.status !== "processing" ? "disabled" : ""}>
                                    <i class="fas fa-check"></i> Complete
                                </button>
                                <button class="btn btn-sm" onclick="viewOrderDetails('${order.id}')">
                                    <i class="fas fa-eye"></i> Details
                                </button>
                                <button class="btn btn-sm" onclick="generateInvoice('${order.id}')">
                                    <i class="fas fa-file-invoice"></i> Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    })
    .join("");
}

function refreshOrders() {
  // In a real application, this would fetch new orders from the server
  showNotification("Orders refreshed!");
}

// Notification System
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary);
                color: white;
                padding: 12px 20px;
                z-index: 1000;
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
                border-radius: 4px;
            `;

  notification.innerHTML = `
                <i class="fas fa-check-circle" style="color: var(--accent);"></i>
                <span>${message}</span>
            `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
