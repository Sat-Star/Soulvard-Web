/**
 * Authentication Helper
 * Manages login, logout, user profile display
 */

function getHomePagePath() {
  return window.location.pathname.includes("/admin/")
    ? "../client/index.html"
    : "index.html";
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Storage write skipped for ${key}:`, error);
  }
}

function getAdminPagePath() {
  return window.location.pathname.includes("/client/")
    ? "../admin/admin.html"
    : "admin.html";
}

function closeAuthModals() {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  if (loginModal) loginModal.style.display = "none";
  if (signupModal) signupModal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Check if user is logged in on page load
function checkAuthStatus() {
  const token = getAuthToken();
  const user = getCurrentUser();

  if (token && user) {
    showLoggedInState(user);
  } else {
    showLoggedOutState();
  }
}

// Show logged in state
function showLoggedInState(user) {
  // Update user menu if it exists
  const userMenu = document.getElementById("userMenu");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const userNameDisplay = document.getElementById("userName");

  if (userMenu) {
    userMenu.style.display = "block";
    userMenu.innerHTML = `
      <span>Welcome, ${user.name}</span>
      <a href="#" onclick="handleLogout(event)">Logout</a>
    `;
  }
  safeSetItem("currentUser", JSON.stringify(user));

  if (loginBtn) loginBtn.style.display = "none";
  if (signupBtn) signupBtn.style.display = "none";
  if (userNameDisplay) userNameDisplay.textContent = user.name;

  // Update navigation
  updateNavigationForAuth(user);
}

// Show logged out state
function showLoggedOutState() {
  const userMenu = document.getElementById("userMenu");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  if (userMenu) userMenu.style.display = "none";
  if (loginBtn) loginBtn.style.display = "block";
  if (signupBtn) signupBtn.style.display = "block";

  // Update navigation
  updateNavigationForAuth(null);
}

// Update navigation based on auth status
function updateNavigationForAuth(user) {
  const profileLink = document.querySelector('a[href="#profile"]');
  const ordersLink = document.querySelector('a[href="#orders"]');
  const adminLink = document.querySelector('a[href="/admin"]');

  if (user) {
    if (profileLink) profileLink.style.display = "block";
    if (ordersLink) ordersLink.style.display = "block";
    if (adminLink && user.role === "admin") {
      adminLink.style.display = "block";
    }
  } else {
    if (profileLink) profileLink.style.display = "none";
    if (ordersLink) ordersLink.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
  }
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    showError("Please fill all fields");
    return;
  }

  try {
    const response = await authAPI.login(email, password);

    if (response.success) {
      showSuccess(`Welcome back, ${response.data.name}!`);
      checkAuthStatus();

      // Close login modal if exists
      closeAuthModals();

      // Redirect based on role
      if (response.data.role === "admin") {
        setTimeout(() => {
          window.location.href = getAdminPagePath();
        }, 1000);
      }
    }
  } catch (error) {
    showError(error.message || "Login failed");
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById("signupName")?.value;
  const email = document.getElementById("signupEmail")?.value;
  const password = document.getElementById("signupPassword")?.value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword",
  )?.value;
  const phone = document.getElementById("signupPhone")?.value;

  if (!name || !email || !password || !confirmPassword || !phone) {
    showError("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    return;
  }

  try {
    const response = await authAPI.register(name, email, password, phone);

    if (response.success) {
      showSuccess(
        `Welcome, ${response.data.name}! Account created successfully.`,
      );
      checkAuthStatus();

      // Close signup modal if exists
      closeAuthModals();

      // Redirect to home
      setTimeout(() => {
        window.location.href = getHomePagePath();
      }, 1000);
    }
  } catch (error) {
    showError(error.message || "Signup failed");
  }
}

// Handle logout
async function handleLogout(event) {
  event.preventDefault();

  if (confirm("Are you sure you want to logout?")) {
    authAPI.logout();
    showSuccess("Logged out successfully");
    checkAuthStatus();

    // Redirect to home
    setTimeout(() => {
      window.location.href = getHomePagePath();
    }, 500);
  }
}

// Open login modal
function openLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

// Open signup modal
function openSignupModal() {
  const modal = document.getElementById("signupModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

// Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const bothClosed =
    (!loginModal || loginModal.style.display === "none") &&
    (!signupModal || signupModal.style.display === "none");
  if (bothClosed) {
    document.body.style.overflow = "auto";
  }
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");

  if (event.target === loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target === signupModal) {
    signupModal.style.display = "none";
  }
  if (
    (!loginModal || loginModal.style.display === "none") &&
    (!signupModal || signupModal.style.display === "none")
  ) {
    document.body.style.overflow = "auto";
  }
});

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
});
