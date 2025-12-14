'use client';

import React, { useState } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  Activity,
  AlertCircle,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // State for real data
  const [statsData, setStatsData] = useState({
    totalEvents: 0,
    activeUsers: 0,
    totalRegistrations: 0,
    pendingApprovals: 0
  });
  const [eventsList, setEventsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "Technology",
    date: "",
    time: "",
    location: "",
    college: "",
    totalSeats: 100,
    registrationStartDate: "",
    registrationEndDate: "",
    createdBy: "" // Will be selected from users list
  });

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const [meRes, statsRes, eventsRes, usersRes, regsRes] = await Promise.all([
        fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/stats'),
        fetch('/api/admin/events'),
        fetch('/api/admin/users'),
        fetch('/api/admin/registrations')
      ]);

      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data.user);
      } else {
        window.location.href = "/login";
        return;
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStatsData(data);
      }

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEventsList(data.events || []);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsersList(data.users || []);
      }

      if (regsRes.ok) {
        const data = await regsRes.json();
        setRegistrationsList(data.registrations || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  React.useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    console.log("Updating profile for user ID:", user?._id);
    const formData = new FormData(e.target);
    const updates = {
      fullName: formData.get("fullName"),
      college: formData.get("college"),
    };
    const password = formData.get("password");
    if (password) updates.password = password;

    try {
      if (!user?._id) {
        console.error("User ID is missing!");
        alert("Error: User ID missing");
        return;
      }
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      console.log("Update response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, ...data.user });
        alert("Profile updated successfully!");
        e.target.reset();
      } else {
        const errData = await res.json();
        console.error("Update failed response:", errData);
        alert(`Failed to update profile: ${errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Update failed network error", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEventsList(eventsList.filter(ev => ev._id !== id));
        // Refresh stats potentially
      }
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsersList(usersList.filter(u => u._id !== id));
        setStatsData(prev => ({ ...prev, activeUsers: prev.activeUsers - 1 }));
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const stats = [
    { icon: Calendar, label: "Total Events", value: statsData.totalEvents.toString(), change: "Updated now", color: "purple", trend: "up" },
    { icon: Users, label: "Active Users", value: statsData.activeUsers.toString(), change: "Total registered", color: "blue", trend: "up" },
    { icon: CheckCircle, label: "Total Registrations", value: statsData.totalRegistrations.toString(), change: "All time", color: "green", trend: "up" },
    { icon: Clock, label: "Pending Approvals", value: statsData.pendingApprovals.toString(), change: "Action needed", color: "orange", trend: "alert" }
  ];

  const events = eventsList; // Use fetched events



  // Filter for pending approvals
  const pendingApprovals = eventsList.filter(ev => ev.status === 'pending');
  const pendingRegistrations = registrationsList.filter(r => r.status === 'pending');
  const totalPending = pendingApprovals.length + pendingRegistrations.length;

  const handleApproveEvent = async (id, approve = true) => {
    try {
      const status = approve ? 'active' : 'cancelled';
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setEventsList(eventsList.map(ev => ev._id === id ? { ...ev, status } : ev));
        setStatsData(prev => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
        }));
      }
    } catch (error) {
      console.error("Failed to update event status", error);
    }
  };

  const handleApproveRegistration = async (id, approve = true) => {
    try {
      const status = approve ? 'approved' : 'rejected';
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setRegistrationsList(registrationsList.map(r => r._id === id ? { ...r, status } : r));
        setStatsData(prev => ({
          ...prev,
          // Optimistically update totalRegistrations if approved? Maybe not needed for main stats yet
        }));
      }
    } catch (error) {
      console.error("Failed to update registration status", error);
    }
  };



  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      // Default to first user if no creator selected (fallback)
      const payload = {
        ...newEvent,
        createdBy: newEvent.createdBy || (usersList.length > 0 ? usersList[0]._id : null)
      };

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setEventsList([data.event, ...eventsList]);
        setStatsData(prev => ({ ...prev, totalEvents: prev.totalEvents + 1 }));
        setShowCreateModal(false);
        setNewEvent({
          title: "", description: "", category: "Technology", date: "", time: "", location: "", college: "", totalSeats: 100, registrationStartDate: "", registrationEndDate: "", createdBy: ""
        });
        alert("Event created successfully!");
      } else {
        alert("Failed to create event");
      }
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/events/${editingEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setEditingEvent(null);
        setNewEvent({ title: "", date: "", time: "", location: "", category: "hackathon", description: "", image: "" });
        fetchData();
        alert("Event updated successfully!");
      } else {
        alert("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  const handleEditClick = (event) => {
    setNewEvent({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
      registrationStartDate: event.registrationStartDate ? new Date(event.registrationStartDate).toISOString().split('T')[0] : '',
      registrationEndDate: event.registrationEndDate ? new Date(event.registrationEndDate).toISOString().split('T')[0] : '',
      createdBy: event.createdBy?._id || event.createdBy || ""
    });
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // Derived Activity Log
  const derivedActivity = [
    ...eventsList.map(ev => ({
      _id: ev._id,
      type: 'event',
      message: `New Event: ${ev.title}`,
      time: new Date(ev.createdAt).toLocaleString(),
      timestamp: new Date(ev.createdAt)
    })),
    ...usersList.map(u => ({
      _id: u._id,
      type: 'user',
      message: `New User: ${u.fullName}`,
      time: new Date(u.createdAt).toLocaleString(),
      timestamp: new Date(u.createdAt)
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  const getStatusColor = (status) => {
    const colors = {
      active: "status-active",
      completed: "status-completed",
      cancelled: "status-cancelled",
      pending: "status-pending"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={`dashboard-root ${darkMode ? "dark" : "light"}`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 w-full">
        <div className="max-w-full px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className="text-white font-bold text-xl">Campus Events</h1>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/Event" className="text-gray-300 hover:text-white transition-colors">Events</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "open" : "closed"}`} aria-hidden={!showSidebar} style={{ marginTop: '60px' }}>
        <div className="sidebar-top">
          <h2 className="brand">Admin Panel</h2>
          <button className="icon-btn hide-desktop" onClick={() => setShowSidebar(false)} title="Close sidebar">
            <X />
          </button>
        </div>

        <nav className="nav">
          <button className={`nav-item ${currentView === "overview" ? "active" : ""}`} onClick={() => setCurrentView("overview")}>
            <BarChart3 className="nav-icon" /> <span>Overview</span>
          </button>
          <button className={`nav-item ${currentView === "events" ? "active" : ""}`} onClick={() => setCurrentView("events")}>
            <Calendar className="nav-icon" /> <span>Manage Events</span>
          </button>
          <button className={`nav-item ${currentView === "users" ? "active" : ""}`} onClick={() => setCurrentView("users")}>
            <Users className="nav-icon" /> <span>User Management</span>
          </button>
          <button className={`nav-item ${currentView === "approvals" ? "active" : ""}`} onClick={() => setCurrentView("approvals")}>
            <CheckCircle className="nav-icon" /> <span>Approvals</span>
            {totalPending > 0 && <span className="badge">{totalPending}</span>}
          </button>
          <button className={`nav-item ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
            <TrendingUp className="nav-icon" /> <span>Analytics</span>
          </button>
          <button className={`nav-item ${currentView === "settings" ? "active" : ""}`} onClick={() => setCurrentView("settings")}>
            <Settings className="nav-icon" /> <span>Settings</span>
          </button>
        </nav>

        <div className="logout-container">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut className="nav-icon" /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className={`main-area ${showSidebar ? "with-sidebar" : "full"}`}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setShowSidebar(!showSidebar)} title="Toggle sidebar">
              <Menu />
            </button>
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-sub">Manage events and monitor performance</p>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>

            <div className="profile">
              <div className="profile-info">
                <div className="profile-name">{user?.fullName || "Admin"}</div>
                <div className="profile-role">Administrator</div>
              </div>
              <div className="avatar">{user?.fullName?.charAt(0) || "A"}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {currentView === "overview" && (
            <>
              {/* Stats grid */}
              <section className="stats-grid">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div className="card stat-card" key={i}>
                      <div className="stat-head">
                        <div className={`stat-icon ${stat.color}`}>
                          <Icon />
                        </div>
                        <div className="stat-trend">
                          {stat.trend === "up" && <TrendingUp />}
                          {stat.trend === "alert" && <AlertCircle />}
                        </div>
                      </div>
                      <div className="stat-body">
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                        <div className={`stat-change ${stat.trend === "alert" ? "alert" : "positive"}`}>{stat.change}</div>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Two columns: recent events & recent activity */}
              <section className="two-col">
                <div className="card recent-events">
                  <div className="card-head">
                    <h3>Recent Events</h3>
                    <button className="btn primary small" onClick={() => setShowCreateModal(true)}>
                      <Plus /> <span>Add Event</span>
                    </button>
                  </div>
                  <div className="card-body">
                    {loading ? <div style={{ padding: 20 }}>Loading...</div> : eventsList.slice(0, 4).map((ev) => (
                      <div className="list-row" key={ev._id}>
                        <div>
                          <div className="list-title">{ev.title}</div>
                          <div className="list-sub">{ev.category} • {ev.registeredCount || 0} registered</div>
                        </div>
                        <div className={`pill ${getStatusColor(ev.status)}`}>{ev.status}</div>
                      </div>
                    ))}
                    {!loading && eventsList.length === 0 && <div style={{ padding: 20 }}>No recent events</div>}
                  </div>
                </div>

                <div className="card recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="card-body">
                    {derivedActivity.length === 0 && <div style={{ padding: 10 }}>No recent activity</div>}
                    {derivedActivity.map((act, idx) => (
                      <div className="activity-row" key={idx}>
                        <div className={`act-icon ${act.type}`}><Activity /></div>
                        <div className="act-body">
                          <div className="act-message">{act.message}</div>
                          <div className="act-time">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* System health */}
              <section className="card system-health">
                <h3>System Health</h3>
                <div className="health-grid">
                  <div className="health-item">
                    <div className="health-label">Server Status</div>
                    <div className="health-row"><span className="dot"></span><span className="health-value">Healthy</span></div>
                  </div>
                  <div className="health-item">
                    <div className="health-label">Database</div>
                    <div className="health-row"><span className="dot"></span><span className="health-value">Connected</span></div>
                  </div>
                  <div className="health-item">
                    <div className="health-label">API Response</div>
                    <div className="health-row"><span className="dot"></span><span className="health-value">120ms</span></div>
                  </div>
                  <div className="health-item">
                    <div className="health-label">Uptime</div>
                    <div className="health-row"><span className="dot"></span><span className="health-value">99.9%</span></div>
                  </div>
                </div>
              </section>
            </>
          )}

          {currentView === "events" && (
            <section>
              <div className="section-head">
                <h2>Manage Events</h2>
                <button className="btn primary" onClick={() => setShowCreateModal(true)}>
                  <Plus /> <span>Create New Event</span>
                </button>
              </div>

              <div className="filters">
                <div className="search-wrap">
                  <Search className="search-icon" />
                  <input
                    className="search-input"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="search-input"
                    style={{
                      width: 'auto',
                      paddingLeft: '12px',
                      border: '2px solid #6B7280', // Thicker border
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', // White bg in light mode
                      color: darkMode ? '#F9FAFB' : '#111827',
                      fontWeight: '600', // Bolder text
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">📂 All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Culture">Culture</option>
                    <option value="Academic">Academic</option>
                    <option value="Business">Business</option>
                    <option value="Workshop">Workshop</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="search-input"
                    style={{
                      width: 'auto',
                      paddingLeft: '12px',
                      border: '2px solid #6B7280',
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      color: darkMode ? '#F9FAFB' : '#111827',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">📊 All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="card table-card">
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Registrations</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsList
                      .filter(ev => {
                        const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = filterCategory === 'all' || ev.category === filterCategory;
                        const matchesStatus = filterStatus === 'all' || ev.status === filterStatus;
                        return matchesSearch && matchesCategory && matchesStatus;
                      })
                      .map(ev => (
                        <tr key={ev._id}>
                          <td className="ev-title">{ev.title}</td>
                          <td>{ev.category}</td>
                          <td>{ev.date}</td>
                          <td>{ev.registeredCount || 0}/{ev.totalSeats}</td>
                          <td className="ev-rev">{ev.revenue || "Free"}</td>
                          <td><span className={`pill ${getStatusColor(ev.status)}`}>{ev.status}</span></td>
                          <td>
                            <div className="actions-cell">
                              <button className="btn icon-btn edit" onClick={() => handleEditClick(ev)}><Edit size={16} /></button>
                              <button className="btn icon-btn delete" onClick={() => handleDeleteEvent(ev._id)}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {currentView === "approvals" && (
            <section>
              <div className="section-head">
                <h2>Pending Approvals</h2>
                <div className="actions-inline">
                  {/* Bulk actions could go here */}
                </div>
              </div>

              <div className="approvals-list">
                <h3 className="mb-4 text-xl font-bold">Event Requests</h3>
                {pendingApprovals.length === 0 && <div className="card" style={{ padding: 20 }}>No pending event requests</div>}
                {pendingApprovals.map(a => (
                  <div className="approval-row card" key={a._id}>
                    <div className="approval-left">
                      <div className="avatar-lg">{a.createdBy?.fullName?.charAt(0) || '?'}</div>
                      <div>
                        <div className="approval-name">{a.title}</div>
                        <div className="approval-sub">{a.college}</div>
                        <div className="approval-sub">Host: {a.createdBy?.fullName || 'Unknown'}</div>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <div className="time-txt">{new Date(a.createdAt).toLocaleDateString()}</div>
                      <button className="btn success ghost" onClick={() => handleApproveEvent(a._id, true)}><CheckCircle /> Approve</button>
                      <button className="btn danger ghost" onClick={() => handleApproveEvent(a._id, false)}><XCircle /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="approvals-list mt-8">
                <h3 className="mb-4 text-xl font-bold">Registration Requests</h3>
                {pendingRegistrations.length === 0 && <div className="card" style={{ padding: 20 }}>No pending registrations</div>}
                {pendingRegistrations.map(a => (
                  <div className="approval-row card" key={a._id}>
                    <div className="approval-left">
                      <div className="avatar-lg bg-gradient-to-r from-blue-500 to-cyan-500">{a.user?.fullName?.charAt(0) || '?'}</div>
                      <div>
                        <div className="approval-name">{a.user?.fullName}</div>
                        <div className="approval-sub">Registered for: <strong>{a.event?.title}</strong></div>
                        <div className="approval-sub">Email: {a.user?.email}</div>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <div className="time-txt">{new Date(a.createdAt).toLocaleDateString()}</div>
                      <button className="btn success ghost" onClick={() => handleApproveRegistration(a._id, true)}><CheckCircle /> Accept</button>
                      <button className="btn danger ghost" onClick={() => handleApproveRegistration(a._id, false)}><XCircle /> Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentView === "users" && (
            <section>
              <div className="section-head">
                <h2>User Management</h2>
                <div className="actions-inline">
                  <button className="btn primary ghost"><Download /> Export CSV</button>
                </div>
              </div>

              <div className="card table-card">
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>College</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{u.fullName?.charAt(0)}</div>
                            {u.fullName}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.college}</td>
                        <td><span className={`pill ${u.role === 'admin' ? 'status-active' : 'status-completed'}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="icon-btn small danger" title="Delete" onClick={() => handleDeleteUser(u._id)}><Trash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {currentView === "analytics" && (
            <section>
              <div className="section-head"><h2>Analytics Overview</h2></div>

              <div className="stats-grid" style={{ marginBottom: 20 }}>
                <div className="card stat-card">
                  <div className="stat-label">Total Events</div>
                  <div className="stat-value">{eventsList.length}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Active Users</div>
                  <div className="stat-value">{usersList.length}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Pending Approvals</div>
                  <div className="stat-value">{pendingApprovals.length}</div>
                </div>
              </div>

              <div className="two-col">
                <div className="card">
                  <h3>Events by Status</h3>
                  <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['active', 'completed', 'pending', 'cancelled'].map(status => {
                      const count = eventsList.filter(e => e.status === status).length;
                      const pct = eventsList.length ? Math.round((count / eventsList.length) * 100) : 0;
                      return (
                        <div key={status}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, textTransform: 'capitalize' }}>
                            <span>{status}</span><span>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: getStatusColor(status) === 'status-active' ? '#34d399' : '#fb923c', borderRadius: 4 }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="card">
                  <h3>Events by Category</h3>
                  <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Array.from(new Set(eventsList.map(e => e.category))).map(cat => {
                      const count = eventsList.filter(e => e.category === cat).length;
                      const pct = eventsList.length ? Math.round((count / eventsList.length) * 100) : 0;
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span>{cat}</span><span>{count}</span>
                          </div>
                          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: '#818cf8', borderRadius: 4 }}></div>
                          </div>
                        </div>
                      )
                    })}
                    {eventsList.length === 0 && <div>No data available</div>}
                  </div>
                </div>
              </div>
            </section>
          )}
          {currentView === "settings" && user && (
            <section>
              <div className="section-head">
                <h2>Profile Settings</h2>
              </div>
              <div className="card" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="fullName" defaultValue={user.fullName} className="search-input" style={{ width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>College</label>
                    <input name="college" defaultValue={user.college} className="search-input" style={{ width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input name="password" type="password" placeholder="Leave blank to keep current" className="search-input" style={{ width: '100%' }} />
                  </div>
                  <button type="submit" className="btn primary">Update Profile</button>
                </form>
              </div>
            </section>
          )}
        </main>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-head">
              <h2>{editingEvent ? "Edit Event" : "Create New Event"}</h2>
              <button className="close-btn" onClick={() => { setShowCreateModal(false); setEditingEvent(null); setNewEvent({ title: "", date: "", time: "", location: "", category: "hackathon", description: "", image: "" }); }}>&times;</button>
            </div>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="create-form">
              <div className="form-group">
                <label>Title</label>
                <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event Title" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                  <option>Technology</option>
                  <option>Sports</option>
                  <option>Culture</option>
                  <option>Academic</option>
                  <option>Business</option>
                  <option>Workshop</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" required value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Registration Start</label>
                  <input type="date" required value={newEvent.registrationStartDate} onChange={e => setNewEvent({ ...newEvent, registrationStartDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Registration End</label>
                  <input type="date" required value={newEvent.registrationEndDate} onChange={e => setNewEvent({ ...newEvent, registrationEndDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="Venue" />
              </div>
              <div className="form-group">
                <label>College</label>
                <input required value={newEvent.college} onChange={e => setNewEvent({ ...newEvent, college: e.target.value })} placeholder="Organizing College" />
              </div>
              <div className="form-group">
                <label>Total Seats</label>
                <input type="number" required value={newEvent.totalSeats} onChange={e => setNewEvent({ ...newEvent, totalSeats: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Host (User)</label>
                <select value={newEvent.createdBy} onChange={e => setNewEvent({ ...newEvent, createdBy: e.target.value })} required>
                  <option value="">Select Host User</option>
                  {usersList.map(u => <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => { setShowCreateModal(false); setEditingEvent(null); }}>Cancel</button>
                <button type="submit" className="btn primary">{editingEvent ? "Update Event" : "Create Event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        :root{
          --bg-dark-1: #0b1220;
          --bg-dark-2: #062025;
          --card-dark: rgba(255,255,255,0.06);
          --muted: #94a3b8;
          --accent-emerald: #10b981;
          --accent-teal: #14b8a6;
          --glass-border: rgba(255,255,255,0.08);
          --glass-border-2: rgba(0,0,0,0.06);
          --radius: 14px;
          --trans: 200ms;
        }

        .dashboard-root {
          min-height: 100vh;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          background: linear-gradient(135deg, #0b1220 0%, #03323a 50%, #08202b 100%);
          color: #e6eef6;
        }
        .dashboard-root.light {
          background: linear-gradient(135deg, #f7fafc 0%, #ecfdf5 50%, #f1f5f9 100%);
          color: #0f172a;
          --muted: #475569;
          --glass-border: rgba(0,0,0,0.08);
          --card-dark: #ffffff;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 260px;
          height: 100vh;
          padding: 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 18px;
          z-index: 40;
          transition: transform var(--trans) ease, background var(--trans);
          border-right: 1px solid var(--glass-border);
          backdrop-filter: blur(8px);
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius: 0 18px 18px 0;
        }
        .dashboard-root.light .sidebar {
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01));
          border-right: 1px solid var(--glass-border-2);
        }
        .sidebar.closed { transform: translateX(-320px); }
        .sidebar.open { transform: translateX(0); }

        .sidebar-top { display:flex; justify-content:space-between; align-items:center; }
        .brand { font-size:20px; margin:0; font-weight:700; letter-spacing:0.2px; }
        .icon-btn { background: transparent; border: none; color: inherit; display: inline-flex; align-items:center; justify-content:center; padding:8px; border-radius:8px; cursor:pointer; }
        .hide-desktop { display:none; }

        .nav { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
        .nav-item {
          display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:12px; border:1px solid transparent;
          background: transparent; color:inherit; cursor:pointer; text-align:left; font-weight:600;
          transition: background var(--trans), transform var(--trans), border-color var(--trans);
        }
        .nav-item .nav-icon { width:18px; height:18px; }
        .nav-item:hover { background: rgba(255,255,255,0.03); transform: translateY(-2px); }
        .nav-item.active { background: linear-gradient(90deg,var(--accent-emerald), var(--accent-teal)); color: #fff; box-shadow: 0 6px 18px rgba(16,185,129,0.08); }
        .badge { margin-left:auto; background:#ef4444; color:white; padding:4px 8px; border-radius:999px; font-size:12px; font-weight:700; }

        .sidebar-bottom { margin-top:auto; }

        .main-area { transition: margin-left var(--trans); margin-left: 260px; min-height: 100vh; padding-top: 80px; }
        .main-area.full { margin-left: 0; }

        .topbar {
          position: sticky; top: 0; z-index: 30; display:flex; justify-content:space-between; align-items:center;
          padding:18px 28px; backdrop-filter: blur(8px); border-bottom: 1px solid var(--glass-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        }
        .dashboard-root.light .topbar { background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01)); border-bottom:1px solid var(--glass-border-2); }

        .topbar-left { display:flex; align-items:center; gap:16px; }
        .topbar-right { display:flex; align-items:center; gap:12px; }
        .page-title { margin:0; font-size:20px; font-weight:700; }
        .page-sub { margin:0; color:var(--muted); font-size:13px; }

        .profile { display:flex; align-items:center; gap:12px; }
        .profile-info { text-align:right; }
        .profile-name { font-weight:700; }
        .profile-role { font-size:12px; color:var(--muted); }
        .avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: linear-gradient(90deg,var(--accent-emerald), var(--accent-teal)); color:white; font-weight:700; }

        .content { padding:28px; max-width:1200px; margin:0 auto; box-sizing:border-box; }

        .card { background: var(--card-dark); border: 1px solid var(--glass-border); padding:18px; border-radius: var(--radius); box-shadow: 0 6px 18px rgba(2,6,23,0.3); }

        .stats-grid { display:grid; grid-template-columns: repeat(1,1fr); gap:18px; margin-bottom:18px; }
        @media(min-width:720px){ .stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media(min-width:1100px){ .stats-grid { grid-template-columns: repeat(4,1fr); } }

        .stat-card { padding:18px; display:flex; flex-direction:column; gap:8px; transition: transform var(--trans); }
        .stat-card:hover { transform: translateY(-6px); }
        .stat-head { display:flex; justify-content:space-between; align-items:center; }
        .stat-icon { width:48px; height:48px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
        .stat-icon svg { width:22px; height:22px; }
        .stat-body { margin-top:6px; }
        .stat-value { font-size:28px; font-weight:800; }
        .stat-label { color:var(--muted); margin-top:6px; }
        .stat-change { font-size:13px; margin-top:6px; }

        .purple { background: rgba(139,92,246,0.12); color:#c084fc; }
        .blue { background: rgba(56,189,248,0.08); color:#7dd3fc; }
        .green { background: rgba(16,185,129,0.08); color:#34d399; }
        .orange { background: rgba(249,115,22,0.08); color:#fb923c; }

        .positive { color: #34d399; }
        .alert { color: #fb923c; }

        .two-col { display:grid; grid-template-columns:1fr; gap:18px; margin:18px 0; }
        @media(min-width:1000px){ .two-col { grid-template-columns: 1fr 420px; } }

        .card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:10px; border:1px solid transparent; cursor:pointer; font-weight:700; }
        .btn.small { padding:8px 10px; }
        .btn.primary { background: linear-gradient(90deg,var(--accent-emerald), var(--accent-teal)); color:white; box-shadow:0 8px 24px rgba(16,185,129,0.08); border: none; }
        .btn.primary.small { padding:8px 10px; font-size:13px; }
        .btn.ghost { background:transparent; border:1px solid rgba(255,255,255,0.04); color: inherit; padding:8px 12px; }
        .btn.success { color:#10b981; border:1px solid rgba(16,185,129,.12); }
        .btn.danger { color:#ef4444; border:1px solid rgba(239,68,68,.08); }

        .recent-events .list-row { display:flex; justify-content:space-between; align-items:center; padding:12px; border-radius:10px; margin-bottom:8px; background:transparent; border:1px solid rgba(255,255,255,0.02); }
        .list-title { font-weight:700; }
        .list-sub { color:var(--muted); font-size:13px; margin-top:4px; }

        .pill { padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px; border:1px solid rgba(255,255,255,0.06); }
        .status-active { background: rgba(16,185,129,0.12); color: #34d399; border-color: rgba(16,185,129,0.2); }
        .status-completed { background: rgba(59,130,246,0.08); color: #7dd3fc; border-color: rgba(59,130,246,0.18); }
        .status-cancelled { background: rgba(239,68,68,0.08); color: #fb7185; border-color: rgba(239,68,68,0.18); }
        .status-pending { background: rgba(250,204,21,0.08); color: #facc15; border-color: rgba(250,204,21,0.18); }

        .recent-activity .activity-row { display:flex; gap:12px; align-items:center; padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.02); }
        .act-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
        .act-icon.registration { background: rgba(56,189,248,0.06); color:#38bdf8; }
        .act-icon.approval { background: rgba(16,185,129,0.06); color:#34d399; }
        .act-icon.event { background: rgba(139,92,246,0.06); color:#c084fc; }
        .act-icon.user { background: rgba(249,115,22,0.06); color:#fb923c; }
        .act-body .act-message { font-weight:700; }
        .act-body .act-time { font-size:13px; color:var(--muted); margin-top:4px; }

        .system-health .health-grid { display:grid; grid-template-columns:repeat(1,1fr); gap:10px; }
        @media(min-width:720px){ .system-health .health-grid { grid-template-columns:repeat(4,1fr); } }
        .health-item { padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.02); background:transparent; }
        .health-label { color:var(--muted); font-size:13px; margin-bottom:8px; }
        .health-row { display:flex; align-items:center; gap:8px; }
        .dot { width:10px; height:10px; background:#34d399; border-radius:50%; display:inline-block; animation: pulse 1.6s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity:1; } 50% { transform: scale(1.3); opacity:0.7; } 100% { transform: scale(1); opacity:1; } }
        .health-value { color:#34d399; font-weight:700; }

        .table-card { margin-top:16px; overflow:auto; }
        .events-table { width:100%; border-collapse:collapse; min-width:900px; }
        .events-table thead tr { border-bottom:1px solid rgba(255,255,255,0.04); }
        .events-table th, .events-table td { padding:12px 14px; text-align:left; color:inherit; font-weight:600; }
        .events-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.02); transition: background var(--trans); }
        .events-table tbody tr:hover { background: rgba(255,255,255,0.02); }

        .row-actions { display:flex; gap:8px; align-items:center; }
        .icon-btn.small { padding:6px; }

        .approvals-list { display:flex; flex-direction:column; gap:12px; margin-top:14px; }
        .approval-row { display:flex; justify-content:space-between; align-items:center; padding:14px; }
        .approval-left { display:flex; gap:12px; align-items:center; }
        .avatar-lg { width:56px; height:56px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:linear-gradient(90deg,#7c3aed,#ec4899); color:white; font-weight:800; font-size:20px; }
        .approval-name { font-weight:800; }
        .approval-sub { color:var(--muted); font-size:13px; margin-top:6px; }
        .approval-actions { display:flex; gap:10px; align-items:center; }

        .coming-soon { text-align:center; padding:48px; }
        .big-emoji { font-size:48px; margin-bottom:10px; }

        .filters { display:flex; gap:12px; align-items:center; margin:18px 0; }
        .search-wrap { position:relative; flex:1; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); opacity:0.8; }
        .search-input { width:100%; padding:10px 12px 10px 40px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); background:transparent; color:inherit; font-weight:600; }

        @media(max-width:900px){
          .hide-desktop { display:inline-flex; }
          .sidebar { z-index:60; }
          .main-area { margin-left: 0; }
        }

        .dashboard-root.light .card { background: #ffffff; border-color: #e6eef6; color: #0f172a; box-shadow: 0 6px 20px rgba(2,6,23,0.04); }
        .dashboard-root.light .nav-item:hover { background: rgba(2,6,23,0.02); }
        .dashboard-root.light .pill { border-color: rgba(15,23,42,0.04); }
        .dashboard-root.light .stat-card { background: #ffffff; }

        .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:100; backdrop-filter:blur(5px); }
        .modal-content { width:100%; max-width:500px; max-height:90vh; overflow-y:auto; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .modal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
        .create-form { display:flex; flex-direction:column; gap:14px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-group label { font-size:13px; color:var(--muted); font-weight:600; }
        .form-group input, .form-group select, .form-group textarea {
           background: rgba(0,0,0,0.2); border:1px solid var(--glass-border); padding:10px; border-radius:8px; color:inherit; font-family:inherit;
        }
        .dashboard-root.light .form-group input, .dashboard-root.light .form-group select, .dashboard-root.light .form-group textarea {
           background: #f8fafc; border-color: #cbd5e1;
        }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .modal-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:20px; }

      `}</style>
    </div>
  );
}
