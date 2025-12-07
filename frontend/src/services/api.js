// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};

  // If not sending FormData, default to JSON
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Add token from sessionStorage if present
  const token = sessionStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers, credentials: "include" });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export const api = {
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  get: (path) => request(path, { method: "GET" }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" })
};
