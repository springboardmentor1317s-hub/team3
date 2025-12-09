import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <>
    <div className="bg-orbs">
      <div className="orb"></div>
      <div className="orb"></div>
      <div className="orb"></div>
    </div>

    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">CampusEventHub</div>
        </div>
        <ul className="sidebar-nav">
          <li><a href="#" className="active"><span className="sidebar-icon">📊</span> Dashboard</a></li>
          <li><a href="#"><span className="sidebar-icon">🎫</span> My Events</a></li>
          <li><a href="#"><span className="sidebar-icon">⭐</span> Favorites</a></li>
          <li><a href="#"><span className="sidebar-icon">📋</span> Registrations</a></li>
          <li><a href="#"><span className="sidebar-icon">⚙️</span> Settings</a></li>
          <li><Link to="/"><span className="sidebar-icon">🏠</span> Back to Home</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="user-info">
            <div className="user-avatar">{user ? user?.name?.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-text">
              <h3>{user ? user.name : 'User'}</h3>
              <p>Student • {user ? user.institution || 'Institution' : 'Institution'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-label">Events Registered</div>
              <div className="stat-value">8</div>
              <div className="stat-change">+2 this month</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <div className="stat-label">Upcoming Events</div>
              <div className="stat-value">3</div>
              <div className="stat-change">Next: Tomorrow</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">Events Attended</div>
              <div className="stat-value">12</div>
              <div className="stat-change">Experience points: 450</div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="section">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="event-list">
            <div className="event-item">
              <div className="event-details">
                <h4>Hackathon X 2025</h4>
                <p>📅 December 15-16 • 🏢 Main Auditorium</p>
              </div>
              <span className="event-status status-registered">Registered</span>
            </div>
            <div className="event-item">
              <div className="event-details">
                <h4>AI & ML Workshop</h4>
                <p>📅 December 18 • 🏢 Tech Block</p>
              </div>
              <span className="event-status status-pending">Pending</span>
            </div>
            <div className="event-item">
              <div className="event-details">
                <h4>Sports Meet 2025</h4>
                <p>📅 December 22 • 🏢 Sports Ground</p>
              </div>
              <span className="event-status status-registered">Registered</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="full-width-card">
            <div className="event-item">
              <div className="event-details">
                <h4>✅ Successfully registered for Debate Championship</h4>
                <p>2 days ago</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-details">
                <h4>⭐ Added Cultural Fest to favorites</h4>
                <p>5 days ago</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-details">
                <h4>🏆 Attended Startup Pitch Battle - Earned 50 points</h4>
                <p>1 week ago</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-details">
                <h4>🎯 Profile completed at 90%</h4>
                <p>2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
)}