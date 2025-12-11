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

export default function AdminDashboard() {
  const [user] = useState({ name: "Admin User", email: "admin@campus.com" });
  const [currentView, setCurrentView] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const stats = [
    { icon: Calendar, label: "Total Events", value: "12", change: "+3 this month", color: "purple", trend: "up" },
    { icon: Users, label: "Active Users", value: "1,234", change: "+120 new", color: "blue", trend: "up" },
    { icon: CheckCircle, label: "Total Registrations", value: "5,678", change: "89% capacity", color: "green", trend: "up" },
    { icon: Clock, label: "Pending Approvals", value: "24", change: "Action needed", color: "orange", trend: "alert" }
  ];

  const events = [
    {
      id: 1,
      title: "Inter College Hackathon 2024",
      category: "Tech Events",
      participants: 147,
      date: "Dec 15-16, 2025",
      status: "active",
      registrations: "147/200",
      revenue: "$2,450"
    },
    {
      id: 2,
      title: "Cultural Fest - Harmony 2024",
      category: "Cultural Events",
      participants: 523,
      date: "Dec 20-22, 2025",
      status: "active",
      registrations: "523/600",
      revenue: "$8,450"
    },
    {
      id: 3,
      title: "Basketball Championship",
      category: "Sports Events",
      participants: 89,
      date: "Dec 10, 2025",
      status: "completed",
      registrations: "89/100",
      revenue: "$1,780"
    },
    {
      id: 4,
      title: "Tech Seminar - Innovation 2024",
      category: "Academic",
      participants: 234,
      date: "Dec 25, 2025",
      status: "active",
      registrations: "234/300",
      revenue: "$3,510"
    }
  ];

  const pendingApprovals = [
    { id: 1, student: "Rahul Sharma", event: "Hackathon X", college: "IIT Bombay", time: "2 hours ago" },
    { id: 2, student: "Priya Patel", event: "Cultural Fest", college: "Delhi University", time: "4 hours ago" },
    { id: 3, student: "Amit Kumar", event: "Sports Meet", college: "MIT College", time: "6 hours ago" },
    { id: 4, student: "Sneha Singh", event: "AI Workshop", college: "NIT Trichy", time: "8 hours ago" }
  ];

  const recentActivity = [
    { type: "registration", message: "New registration for Hackathon X", time: "5 min ago" },
    { type: "approval", message: "Approved 12 registrations", time: "1 hour ago" },
    { type: "event", message: "Created new event: Tech Summit 2025", time: "3 hours ago" },
    { type: "user", message: "15 new users registered", time: "5 hours ago" }
  ];

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
      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "open" : "closed"}`} aria-hidden={!showSidebar}>
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
            <span className="badge">24</span>
          </button>
          <button className={`nav-item ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
            <TrendingUp className="nav-icon" /> <span>Analytics</span>
          </button>
          <button className="nav-item">
            <Settings className="nav-icon" /> <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item logout">
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
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">Administrator</div>
              </div>
              <div className="avatar">{user.name.charAt(0)}</div>
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
                    <button className="btn primary small">
                      <Plus /> <span>Add Event</span>
                    </button>
                  </div>
                  <div className="card-body">
                    {events.slice(0, 4).map((ev) => (
                      <div className="list-row" key={ev.id}>
                        <div>
                          <div className="list-title">{ev.title}</div>
                          <div className="list-sub">{ev.category} • {ev.participants} participants</div>
                        </div>
                        <div className={`pill ${getStatusColor(ev.status)}`}>{ev.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="card-body">
                    {recentActivity.map((act, idx) => (
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
                <button className="btn primary">
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
                <button className="btn ghost">
                  <Filter /> <span>Filter</span>
                </button>
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
                    {events.map(ev => (
                      <tr key={ev.id}>
                        <td className="ev-title">{ev.title}</td>
                        <td>{ev.category}</td>
                        <td>{ev.date}</td>
                        <td>{ev.registrations}</td>
                        <td className="ev-rev">{ev.revenue}</td>
                        <td><span className={`pill ${getStatusColor(ev.status)}`}>{ev.status}</span></td>
                        <td>
                          <div className="row-actions">
                            <button className="icon-btn small" title="View"><Eye /></button>
                            <button className="icon-btn small" title="Edit"><Edit /></button>
                            <button className="icon-btn small danger" title="Delete"><Trash2 /></button>
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
                  <button className="btn success ghost">Approve All</button>
                  <button className="btn danger ghost">Reject All</button>
                </div>
              </div>

              <div className="approvals-list">
                {pendingApprovals.map(a => (
                  <div className="approval-row card" key={a.id}>
                    <div className="approval-left">
                      <div className="avatar-lg">{a.student.charAt(0)}</div>
                      <div>
                        <div className="approval-name">{a.student}</div>
                        <div className="approval-sub">{a.college}</div>
                        <div className="approval-sub">Event: {a.event}</div>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <div className="time-txt">{a.time}</div>
                      <button className="btn success ghost"><CheckCircle /> Approve</button>
                      <button className="btn danger ghost"><XCircle /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(currentView === "users" || currentView === "analytics") && (
            <div className="coming-soon card">
              <div className="big-emoji">🚧</div>
              <h3>Coming Soon</h3>
              <p>This section is under development</p>
            </div>
          )}
        </main>
      </div>

      {/* Styles (No Tailwind) */}
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

        /* Layout root */
        .dashboard-root {
          min-height: 100vh;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          background: linear-gradient(135deg, #0b1220 0%, #03323a 50%, #08202b 100%);
          color: #e6eef6;
        }
        .dashboard-root.light {
          background: linear-gradient(135deg, #f7fafc 0%, #ecfdf5 50%, #f1f5f9 100%);
          color: #0f172a;
        }

        /* Sidebar */
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

        /* Main area */
        .main-area { transition: margin-left var(--trans); margin-left: 260px; min-height: 100vh; }
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

        /* Content */
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

        /* colors for stat icons */
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

        /* system health */
        .system-health .health-grid { display:grid; grid-template-columns:repeat(1,1fr); gap:10px; }
        @media(min-width:720px){ .system-health .health-grid { grid-template-columns:repeat(4,1fr); } }
        .health-item { padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.02); background:transparent; }
        .health-label { color:var(--muted); font-size:13px; margin-bottom:8px; }
        .health-row { display:flex; align-items:center; gap:8px; }
        .dot { width:10px; height:10px; background:#34d399; border-radius:50%; display:inline-block; animation: pulse 1.6s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity:1; } 50% { transform: scale(1.3); opacity:0.7; } 100% { transform: scale(1); opacity:1; } }
        .health-value { color:#34d399; font-weight:700; }

        /* events table */
        .table-card { margin-top:16px; overflow:auto; }
        .events-table { width:100%; border-collapse:collapse; min-width:900px; }
        .events-table thead tr { border-bottom:1px solid rgba(255,255,255,0.04); }
        .events-table th, .events-table td { padding:12px 14px; text-align:left; color:inherit; font-weight:600; }
        .events-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.02); transition: background var(--trans); }
        .events-table tbody tr:hover { background: rgba(255,255,255,0.02); }

        .row-actions { display:flex; gap:8px; align-items:center; }
        .icon-btn.small { padding:6px; }

        /* approvals */
        .approvals-list { display:flex; flex-direction:column; gap:12px; margin-top:14px; }
        .approval-row { display:flex; justify-content:space-between; align-items:center; padding:14px; }
        .approval-left { display:flex; gap:12px; align-items:center; }
        .avatar-lg { width:56px; height:56px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:linear-gradient(90deg,#7c3aed,#ec4899); color:white; font-weight:800; font-size:20px; }
        .approval-name { font-weight:800; }
        .approval-sub { color:var(--muted); font-size:13px; margin-top:6px; }
        .approval-actions { display:flex; gap:10px; align-items:center; }

        /* coming soon */
        .coming-soon { text-align:center; padding:48px; }
        .big-emoji { font-size:48px; margin-bottom:10px; }

        /* filters */
        .filters { display:flex; gap:12px; align-items:center; margin:18px 0; }
        .search-wrap { position:relative; flex:1; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); opacity:0.8; }
        .search-input { width:100%; padding:10px 12px 10px 40px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); background:transparent; color:inherit; font-weight:600; }

        /* responsive tweaks */
        @media(max-width:900px){
          .hide-desktop { display:inline-flex; }
          .sidebar { z-index:60; }
          .main-area { margin-left: 0; }
        }

        /* Light theme overrides */
        .dashboard-root.light .card { background: #ffffff; border-color: #e6eef6; color: #0f172a; box-shadow: 0 6px 20px rgba(2,6,23,0.04); }
        .dashboard-root.light .nav-item:hover { background: rgba(2,6,23,0.02); }
        .dashboard-root.light .pill { border-color: rgba(15,23,42,0.04); }
        .dashboard-root.light .stat-card { background: #ffffff; }

      `}</style>
    </div>
  );
}
