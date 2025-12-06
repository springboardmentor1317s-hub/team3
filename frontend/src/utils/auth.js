// src/utils/auth.js
// Ported from original auth.js (converted to ES module + sessionStorage)
// NOTE: This is intentionally a thin port — keeps behavior, function names and demo data.

function initializeAuth() {
  if (!sessionStorage.getItem("users")) {
    sessionStorage.setItem("users", JSON.stringify([]));
  }
  if (!sessionStorage.getItem("currentUser")) {
    sessionStorage.setItem("currentUser", JSON.stringify(null));
  }
}

export function registerUser(fullName, email, password, userType) {
  initializeAuth();
  let users = JSON.parse(sessionStorage.getItem("users")) || [];

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "Email already registered! Please login instead." };
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    // keep same weak encoding as original for parity; backend should replace with hashing later
    password: btoa(password),
    userType,
    registeredDate: new Date().toISOString(),
  };

  users.push(newUser);
  sessionStorage.setItem("users", JSON.stringify(users));

  return { success: true, message: "Registration successful! Please login.", user: newUser };
}

export function loginUser(email, password, userType) {
  initializeAuth();
  let users = JSON.parse(sessionStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email && u.userType === userType);
  if (!user) return { success: false, message: "Invalid email or user type. Please check your credentials." };

  if (btoa(password) !== user.password) {
    return { success: false, message: "Incorrect password. Please try again." };
  }

  const sessionUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    userType: user.userType,
    loginTime: new Date().toISOString(),
  };

  // NOTE: using sessionStorage instead of localStorage (safer for this context)
  sessionStorage.setItem("currentUser", JSON.stringify(sessionUser));

  return { success: true, message: "Login successful!", user, userType: user.userType };
}

export function getCurrentUser() {
  initializeAuth();
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
}

export function logoutUser() {
  sessionStorage.setItem("currentUser", JSON.stringify(null));
  return { success: true, message: "Logged out successfully" };
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function redirectToDashboard(userType) {
  if (userType === "admin") {
    window.location.href = "/admin-dashboard"; // react routes will later map to this
  } else {
    window.location.href = "/student-dashboard";
  }
}

export function protectPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert("Please login first");
    window.location.href = "/login";
    return false;
  }
  return true;
}

export function getAllUsers() {
  initializeAuth();
  return JSON.parse(sessionStorage.getItem("users")) || [];
}

export function updateUserProfile(userId, updatedData) {
  initializeAuth();
  let users = JSON.parse(sessionStorage.getItem("users")) || [];

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return { success: false, message: "User not found" };

  users[userIndex] = { ...users[userIndex], ...updatedData };
  sessionStorage.setItem("users", JSON.stringify(users));

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    sessionStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...updatedData }));
  }

  return { success: true, message: "Profile updated successfully" };
}

export function deleteUser(userId) {
  initializeAuth();
  let users = JSON.parse(sessionStorage.getItem("users")) || [];
  users = users.filter((u) => u.id !== userId);
  sessionStorage.setItem("users", JSON.stringify(users));
  return { success: true, message: "User deleted successfully" };
}

export function createDemoUsers() {
  initializeAuth();
  sessionStorage.setItem("users", JSON.stringify([]));
  registerUser("Admin User", "admin@campus.com", "admin123", "admin");
  registerUser("Student User", "student@campus.com", "student123", "student");
  // keep console hint for devs
  console.log("Demo users created. Admin: admin@campus.com (pass: admin123), Student: student@campus.com (pass: student123)");
}

// Keep password toggle initializer as on-page code relies on it
export function initPasswordToggles() {
  const lockedSvg = `<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="13" rx="2"></rect><path d="M7 8V6a5 5 0 0110 0v2"></path></svg>`;
  const unlockedSvg = `<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="13" rx="2"></rect><path d="M16 8V6a4 4 0 10-8 0v2"></path></svg>`;

  document.querySelectorAll(".pw-toggle").forEach((btn) => {
    if (!btn.dataset.state) {
      btn.dataset.state = "locked";
      btn.innerHTML = lockedSvg;
    }
    btn.addEventListener("click", function () {
      const targetId = this.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const state = this.dataset.state;
      if (state === "locked") {
        input.type = "text";
        this.innerHTML = unlockedSvg;
        this.dataset.state = "unlocked";
        this.classList.add("unlocked");
        this.setAttribute("aria-label", this.getAttribute("title") ? "Hide password" : "Hide");
        const svg = this.querySelector(".svg-anim");
        if (svg) svg.style.transform = "rotate(-12deg) scale(1.05)";
        setTimeout(() => {
          if (svg) svg.style.transform = "";
        }, 260);
      } else {
        input.type = "password";
        this.innerHTML = lockedSvg;
        this.dataset.state = "locked";
        this.classList.remove("unlocked");
        this.setAttribute("aria-label", this.getAttribute("title") ? "Show password" : "Show");
      }
    });
  });
}

// Initialize on module load for pages that expect it
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initializeAuth);
}
