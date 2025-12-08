// src/utils/auth.js
// Unified auth utility: demo/local functions + api-backed functions + aliases
import { api } from "../services/api.js";

/* -------------------------
   Local demo storage helpers
   ------------------------- */
function initializeAuthLocal() {
  if (!sessionStorage.getItem("users")) {
    sessionStorage.setItem("users", JSON.stringify([]));
  }
  if (!sessionStorage.getItem("currentUser")) {
    sessionStorage.setItem("currentUser", JSON.stringify(null));
  }
}

export function registerUserLocal(fullName, email, password, userType = "student") {
  initializeAuthLocal();
  let users = JSON.parse(sessionStorage.getItem("users")) || [];

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "Email already registered! Please login instead." };
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password: btoa(password),
    userType,
    registeredDate: new Date().toISOString(),
  };

  users.push(newUser);
  sessionStorage.setItem("users", JSON.stringify(users));
  return { success: true, message: "Registration successful! Please login.", user: newUser };
}

export function loginUserLocal(email, password, userType = "student") {
  initializeAuthLocal();
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

  sessionStorage.setItem("currentUser", JSON.stringify(sessionUser));
  sessionStorage.setItem("token", `demo-${Date.now()}`);

  return { success: true, message: "Login successful!", user: sessionUser, token: sessionStorage.getItem("token") };
}

/* -------------------------
   API-backed helpers
   ------------------------- */
export async function registerViaApi(payload) {
  try {
    const res = await api.post("/auth/register", payload);
    return { success: true, message: res.message || "Registered (server)", raw: res };
  } catch (err) {
    const message = err?.data?.message || (err?.data && JSON.stringify(err.data)) || err.message || "Registration failed";
    return { success: false, message };
  }
}

export async function loginViaApi(payload) {
  try {
    const res = await api.post("/auth/login", payload);
    if (res.token) {
      sessionStorage.setItem("token", res.token);
    }
    if (res.user) {
      const normalized = {
        id: res.user.id || res.user._id || res.user.ID || res.user.id,
        fullName: res.user.name || res.user.fullName || res.user.email,
        email: res.user.email || "",
        userType: res.user.role || res.user.userType || "student"
      };
      sessionStorage.setItem("currentUser", JSON.stringify(normalized));
    }
    return { success: true, message: res.message || "Login successful", raw: res };
  } catch (err) {
    const message = err?.data?.message || (err?.data && JSON.stringify(err.data)) || err.message || "Login failed";
    return { success: false, message, raw: err?.data || err };
  }
}

export async function retrieveEvents() {
  try {
    const res = await api.get("/auth/events");
    if (res.token) {
      sessionStorage.setItem("token", res.token);
    }
    return { success: true, message: res.message || "Events Retrieval Successful", raw: res };
  } catch (err) {
    const message = err?.data?.message || (err?.data && JSON.stringify(err.data)) || err.message || "Retrieval failed";
    return { success: false, message, raw: err?.data || err };
  }
}

/* -------------------------
   initPasswordToggles
   (UI helper used by Login/Register pages)
   ------------------------- */
export function initPasswordToggles() {
  // svg icons used in original implementation
  const lockedSvg = `<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="13" rx="2"></rect><path d="M7 8V6a5 5 0 0110 0v2"></path></svg>`;
  const unlockedSvg = `<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="13" rx="2"></rect><path d="M16 8V6a4 4 0 10-8 0v2"></path></svg>`;

  // Find all toggle buttons
  const toggles = document.querySelectorAll(".pw-toggle");
  toggles.forEach((btn) => {
    // if button not initialized, set initial icon and state
    if (!btn.dataset.state) {
      btn.dataset.state = "locked";
      btn.innerHTML = lockedSvg;
      btn.setAttribute("aria-label", btn.getAttribute("title") || "Show password");
    }

    // ensure click handler only added once
    if (!btn._pwToggleInit) {
      btn.addEventListener("click", function () {
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        const state = this.dataset.state;
        const svg = this.querySelector(".svg-anim");

        if (state === "locked") {
          input.type = "text";
          this.innerHTML = unlockedSvg;
          this.dataset.state = "unlocked";
          this.classList.add("unlocked");
          this.setAttribute("aria-label", "Hide password");
          if (svg) svg.style.transform = "rotate(-12deg) scale(1.05)";
          setTimeout(() => { if (svg) svg.style.transform = ""; }, 260);
        } else {
          input.type = "password";
          this.innerHTML = lockedSvg;
          this.dataset.state = "locked";
          this.classList.remove("unlocked");
          this.setAttribute("aria-label", "Show password");
        }
      });
      btn._pwToggleInit = true;
    }
  });
}

/* -------------------------
   Common helpers
   ------------------------- */
export function getCurrentUser() {
  const cur = sessionStorage.getItem("currentUser");
  return cur ? JSON.parse(cur) : null;
}

export function logoutUser() {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("token");
  return { success: true, message: "Logged out" };
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function protectPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    try { alert("Please login first"); } catch {}
    window.location.href = "/login";
    return false;
  }
  return true;
}

/* -------------------------
   Backwards-compatible aliases (prevents import name errors)
   ------------------------- */
export const registerUser = registerUserLocal;
export const loginUser = loginUserLocal;
