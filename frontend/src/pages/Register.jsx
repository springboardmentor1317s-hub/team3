// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, initPasswordToggles } from "../utils/auth";
import "../styles/original.css";

export default function Register() {
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof initPasswordToggles === "function") initPasswordToggles();
  }, []);

  function handleRole(r) {
    setRole(r);
    setMsg({ type: "", text: "" });
  }

  function showError(message) {
    setMsg({ type: "error", text: message });
  }

  function showSuccess(message) {
    setMsg({ type: "success", text: message });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!fullName || !email || !password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return;
    }

    const result = registerUser(fullName.trim(), email.trim(), password, role);
    if (result.success) {
      showSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      showError(result.message);
    }
  }

  return (
    <div className="register-page">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <nav>
        <div className="logo">CampusEventHub</div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/register" style={{ color: "#a855f7" }}>Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      <div className="flex justify-center items-center min-h-screen py-20">
        <div className="form-card">
          <h2 className="form-title">Join Us</h2>

          <div className="role-selector">
            <button type="button" className={`role-btn ${role === "student" ? "active" : ""}`} onClick={() => handleRole("student")}>Student</button>
            <button type="button" className={`role-btn ${role === "admin" ? "active" : ""}`} onClick={() => handleRole("admin")}>Admin</button>
          </div>

          {msg.type === "error" && <div className="error-message show">{msg.text}</div>}
          {msg.type === "success" && <div className="success-message show">{msg.text}</div>}

          <form className="flex flex-col" id="registerForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>

            <div className="form-group pw-field">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="form-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
                <button type="button" className="pw-toggle" data-target="password" aria-label="Show password" title="Show password" />
              </div>
            </div>

            <div className="form-group pw-field">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input className="form-input" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
                <button type="button" className="pw-toggle" data-target="confirmPassword" aria-label="Show confirm password" title="Show confirm password" />
              </div>
            </div>

            <button type="submit" className="form-button">Create Account</button>

            <p className="form-link">Already have an account? <a href="/login">Sign in</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}
