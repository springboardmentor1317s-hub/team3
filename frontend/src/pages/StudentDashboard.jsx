// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, protectPage, logoutUser } from "../utils/auth";
import "../styles/original.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // preserve original protect behavior: if not logged in, redirect
    const ok = protectPage();
    if (!ok) return;
    const cur = getCurrentUser();
    setUser(cur);

    // if user exists but not student, redirect to admin dashboard
    if (cur && cur.userType && cur.userType === "admin") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  function handleLogout() {
    logoutUser();
    // preserve original behavior: redirect to login page after logout
    navigate("/login");
  }

  // If protectPage triggered a redirect, don't render sensitive UI
  if (!getCurrentUser()) return null;

  return (
    <div className="student-dashboard-page">
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
          <li><a href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
        </ul>
      </nav>

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome{user ? `, ${user.fullName || user.name || user.email}` : ""} — here are your activities.</p>
        </header>

        <section className="dashboard-grid">
          <div className="card">
            <h3>Registered Events</h3>
            <p>No data available yet — this will list events you registered for.</p>
            <a href="/events">Browse Events</a>
          </div>

          <div className="card">
            <h3>Profile</h3>
            <p>Email: {user ? (user.email || user.email) : "—"}</p>
            <p>Role: {user ? (user.userType || user.role || "student") : "student"}</p>
            <a href="/profile">Edit Profile</a>
          </div>

          <div className="card">
            <h3>Notifications</h3>
            <p>No notifications right now.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
