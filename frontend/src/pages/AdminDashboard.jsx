// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, protectPage, logoutUser } from "../utils/auth";
import "../styles/original.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const ok = protectPage();
    if (!ok) return;
    const cur = getCurrentUser();
    setUser(cur);

    // If non-admin logs in here, redirect to student dashboard
    if (cur && cur.userType && cur.userType !== "admin") {
      navigate("/student-dashboard");
    }
  }, [navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (!getCurrentUser()) return null;

  return (
    <div className="admin-dashboard-page">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <nav>
        <div className="logo">CampusEventHub</div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/admin-dashboard" style={{ color: "#a855f7" }}>Admin</a></li>
          <li><a href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
        </ul>
      </nav>

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome{user ? `, ${user.fullName || user.name || user.email}` : ""} — manage events and registrations.</p>
        </header>

        <section className="dashboard-grid admin-grid">
          <div className="card">
            <h3>Create Event</h3>
            <p>Create new events that students can register for.</p>
            <a href="/create-event">Create</a>
          </div>

          <div className="card">
            <h3>All Registrations</h3>
            <p>View and export all event registrations.</p>
            <a href="/registrations">View</a>
          </div>

          <div className="card">
            <h3>Users</h3>
            <p>List and manage users (students & admins).</p>
            <a href="/users">Manage</a>
          </div>
        </section>
      </main>
    </div>
  );
}
