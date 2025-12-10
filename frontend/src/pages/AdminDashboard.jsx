import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUsers, FaChartBar, FaChartLine } from "react-icons/fa";
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

      <div className="admin-dashboard-wrapper">
        <div className="admin-top-bar">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
            <div className="admin-user-text">
              <h3>{user?.name || 'Admin'}</h3>
              <p>Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your events and monitor participant performance</p>
        </div>

        <div className="admin-metrics">
          <div className="metric-card metric-card-1">
            <div className="metric-icon"><FaCalendarAlt size={28} /></div>
            <div className="metric-content">
              <div className="metric-label">Total Events</div>
              <div className="metric-value">12</div>
              <div className="metric-change">+3 this month</div>
            </div>
          </div>

          <div className="metric-card metric-card-2">
            <div className="metric-icon"><FaUsers size={28} /></div>
            <div className="metric-content">
              <div className="metric-label">Active Users</div>
              <div className="metric-value">1,234</div>
              <div className="metric-change">+120 new</div>
            </div>
          </div>

          <div className="metric-card metric-card-3">
            <div className="metric-icon"><FaChartBar size={28} /></div>
            <div className="metric-content">
              <div className="metric-label">Total Registrations</div>
              <div className="metric-value">5,678</div>
              <div className="metric-change">89% capacity</div>
            </div>
          </div>

          <div className="metric-card metric-card-4">
            <div className="metric-icon"><FaChartLine size={28} /></div>
            <div className="metric-content">
              <div className="metric-label">Pending Approvals</div>
              <div className="metric-value">24</div>
              <div className="metric-change">Action needed</div>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <div className="admin-tab">Overview</div>
          <div className="admin-tab">User Management</div>
          <div className="admin-tab">Analytics</div>
        </div>

        <div className="admin-sections">
          <section className="admin-section">
            <h2 className="section-title">Recent Events</h2>
            <div className="admin-list">
              <div className="admin-item">
                <div className="item-info">
                  <h4>Inter College Hackathon 2024</h4>
                  <p>Tech Events • 147 participants</p>
                </div>
                <span className="item-badge">Active</span>
              </div>
              <div className="admin-item">
                <div className="item-info">
                  <h4>Cultural Fest - Harmony 2024</h4>
                  <p>Cultural Events • 523 participants</p>
                </div>
                <span className="item-badge">Active</span>
              </div>
              <div className="admin-item">
                <div className="item-info">
                  <h4>Basketball Championship</h4>
                  <p>Sports Events • 89 participants</p>
                </div>
                <span className="item-badge">Completed</span>
              </div>
              <div className="admin-item">
                <div className="item-info">
                  <h4>Tech Seminar - Innovation 2024</h4>
                  <p>Academic • 234 participants</p>
                </div>
                <span className="item-badge">Active</span>
              </div>
            </div>
          </section>

          <section className="admin-section">
            <h2 className="section-title">System Health</h2>
            <div className="health-grid">
              <div className="health-item">
                <div className="health-label">Server Status</div>
                <div className="health-status healthy">Healthy</div>
              </div>
              <div className="health-item">
                <div className="health-label">Database</div>
                <div className="health-status healthy">Connected</div>
              </div>
              <div className="health-item">
                <div className="health-label">API Response</div>
                <div className="health-status healthy">120ms</div>
              </div>
              <div className="health-item">
                <div className="health-label">Uptime</div>
                <div className="health-status healthy">99.9%</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}