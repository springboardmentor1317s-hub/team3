// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginViaApi, loginUserLocal, initPasswordToggles } from "../utils/auth";
import "../styles/original.css";
import Navbar from "../components/Navbar";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // initialize password toggles (UI helper)
    if (typeof initPasswordToggles === "function") initPasswordToggles();
  }, []);

  function handleRole(r) {
    setRole(r);
    setMsg({ type: "", text: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    // Try backend login first
    const payload = { email: email.trim(), password, role };
    const res = await loginViaApi(payload);
    if (res.success) {
      setMsg({ type: "success", text: res.message || "Login successful" });
      const cur = sessionStorage.getItem("currentUser");
      const u = cur ? JSON.parse(cur) : null;
      setTimeout(() => {
        if (u && (u.userType === "admin" || u.role === "admin")) navigate("/admin-dashboard");
        else navigate("/student-dashboard");
      }, 500);
      return;
    }

    // Fallback to local demo login if API failed
    const fallback = loginUserLocal(email.trim(), password, role);
    if (fallback.success) {
      setMsg({ type: "success", text: "Logged in (demo mode)" });
      setTimeout(() => {
        const u = JSON.parse(sessionStorage.getItem("currentUser"));
        if (u && u.userType === "admin") navigate("/admin-dashboard");
        else navigate("/student-dashboard");
      }, 400);
      return;
    }

    // Show API error if present, else fallback error
    setMsg({ type: "error", text: res.message || fallback.message || "Login failed" });
  }

  return (
    <div className="login-page">
      <Navbar />

      <div className="page-center">
        <div className="form-card">
          <h2 className="form-title">Welcome Back</h2>

          <div className="role-selector" style={{ marginBottom: 20 }}>
            <button type="button" className={`role-btn ${role === "student" ? "active" : ""}`} onClick={() => handleRole("student")}>Student</button>
            <button type="button" className={`role-btn ${role === "admin" ? "active" : ""}`} onClick={() => handleRole("admin")}>Admin</button>
          </div>

          {msg.type === "error" && <div className="error-message show">{msg.text}</div>}
          {msg.type === "success" && <div className="success-message show">{msg.text}</div>}

          <form className="flex flex-col" id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>

            <div className="form-group pw-field">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="form-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" className="pw-toggle" data-target="password" aria-label="Show password" title="Show password" />
              </div>
            </div>

            <button type="submit" className="form-button">Sign In</button>

            <p className="form-link">
              Don't have an account? <a href="/register">Create one</a>
            </p>
          </form>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(99,102,241,0.2)" }}>
            Demo fallback: admin@campus.com / student@campus.com (pass: admin123 / student123)
          </p>
        </div>
      </div>
    </div>
  );
}