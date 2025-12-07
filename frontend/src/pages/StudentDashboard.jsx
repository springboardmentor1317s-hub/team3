import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, protectPage, logoutUser } from "../utils/auth";
import "../styles/original.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const ok = protectPage();
    if (!ok) return;
    const cur = getCurrentUser();
    setUser(cur);

    if (cur && cur.userType && cur.userType === "admin") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (!getCurrentUser()) return null;

  return (
    <div className="student-dashboard-page">
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
          <li><a href="/student-dashboard" style={{ color: "#a855f7" }}>Dashboard</a></li>
          <li><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
        </ul>
      </nav>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          <p>Hi {user?.fullName || user?.name || "Student"}, here are your event activities and profile information.</p>
        </header>

        <section className="dashboard-grid">
          <div className="card">
            <h3>📋 Registered Events</h3>
            <p>View all the events you have registered for and track your participation status.</p>
            <a href="/events">View Events</a>
          </div>

          <div className="card">
            <h3>👤 My Profile</h3>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            <p><strong>Role:</strong> {user?.userType || "Student"}</p>
            <a href="/profile">Edit Profile</a>
          </div>

          <div className="card">
            <h3>🔔 Notifications</h3>
            <p>Stay updated with the latest announcements and event reminders from your campus.</p>
            <a href="/notifications">View All</a>
          </div>
        </section>
      </div>
    </div>
  );
}