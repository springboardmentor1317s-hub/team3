// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, initPasswordToggles } from "../utils/auth";
import "../styles/original.css";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // initialize password toggles (port of original UI script)
    if (typeof initPasswordToggles === "function") initPasswordToggles();
  }, []);

  function handleRole(r) {
    setRole(r);
    setMsg({ type: "", text: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const res = loginUser(email.trim(), password, role);
    if (!res.success) {
      setMsg({ type: "error", text: res.message });
      return;
    }

    setMsg({ type: "success", text: res.message });
    // redirect to dashboard — preserve original redirect behavior
    setTimeout(() => {
      if (res.userType === "admin") navigate("/admin-dashboard");
      else navigate("/student-dashboard");
    }, 600);
  }

  return (
    <div className="login-page">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <nav>
        <div className="logo">CampusEventHub</div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/login" style={{ color: "#a855f7" }}>Login</a></li>
        </ul>
      </nav>

      <div className="flex justify-center items-center h-screen">
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
            Demo: admin@campus.com / student@campus.com (pass: admin123 / student123)
          </p>
        </div>
      </div>
    </div>
  );
}
