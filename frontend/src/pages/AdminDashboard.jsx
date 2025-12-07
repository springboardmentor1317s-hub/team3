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
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <nav>
        <div className="logo">CampusEventHub</div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/admin-dashboard" style={{ color: "#a855f7" }}>Admin Panel</a></li>
          <li><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
        </ul>
      </nav>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Control Panel</h1>
          <p>Welcome {user?.fullName || user?.name || "Admin"}, manage events and registrations below.</p>
        </header>

        <section className="dashboard-grid admin-grid">
          <div className="card">
            <h3>➕ Create Event</h3>
            <p>Create new campus events and set registration details for students to participate.</p>
            <a href="/create-event">Create New</a>
          </div>

          <div className="card">
            <h3>📊 All Registrations</h3>
            <p>View and manage all event registrations from students across your campus.</p>
            <a href="/registrations">View Registrations</a>
          </div>

          <div className="card">
            <h3>👥 Manage Users</h3>
            <p>Add, edit, or remove student and admin accounts from the system.</p>
            <a href="/users">Manage Users</a>
          </div>
        </section>
      </div>
    </div>
  );
}