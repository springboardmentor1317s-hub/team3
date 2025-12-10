// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerViaApi, registerUserLocal } from "../utils/auth";
import Navbar from "../components/Navbar";
import "../styles/original.css";

export default function Register() {
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [college, setCollege]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // UI password toggle init if needed
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!fullName || !email || !password || !confirmPassword) {
      setMsg({ type: "error", text: "Please fill in all fields" });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    // Try backend register first
    const payload = { name: fullName.trim(), email: email.trim(), password, college, role };
    const res = await registerViaApi(payload);
    if (res.success) {
      setMsg({ type: "success", text: res.message || "Registration successful. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    // Fallback to local register if API failed
    const fallback = registerUserLocal(fullName.trim(), email.trim(), password, role);
    if (fallback.success) {
      setMsg({ type: "success", text: "Registered (demo). Redirecting to login..." });
      setTimeout(() => navigate("/login"), 900);
      return;
    }

    setMsg({ type: "error", text: res.message || fallback.message || "Registration failed" });
  }

  return (
    <div className="register-page">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <Navbar />

      <div className="page-center">
        <div className="form-card">
          <h2 className="form-title">Join Us</h2>

          <div className="role-selector">
            <button type="button" className={`role-btn ${role === "student" ? "active" : ""}`} onClick={() => setRole("student")}>Student</button>
            <button type="button" className={`role-btn ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>Admin</button>
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

             <div className="form-group">
              <label className="form-label">College/University</label>
              <input className="form-input" type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Your College" required />
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
