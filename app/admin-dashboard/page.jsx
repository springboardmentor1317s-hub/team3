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
  Filter,
  Search,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  Bell,
  MapPin,
  Star
} from "lucide-react";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterRegistrationEvent, setFilterRegistrationEvent] = useState("all");
  const [filterMyEvents, setFilterMyEvents] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState({}); // For accordion view

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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
    teamSizeMin: 1,
    teamSizeMax: 1,
    registrationStartDate: "",
    registrationEndDate: "",
    image: "", // Event banner image
    college: "" // Organizing College
  });
  const [imagePreview, setImagePreview] = useState("");

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
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/events', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users'),
        fetch('/api/admin/registrations', { headers: { Authorization: `Bearer ${token}` } })
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

      // Fetch notifications for admin (will be fetched after user is set)
      // This will be handled in a separate useEffect
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

  // Fetch notifications when user is loaded
  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user._id) {
        try {
          const notifsRes = await fetch(`/api/notifications?userId=${user._id}`);
          if (notifsRes.ok) {
            const data = await notifsRes.json();
            setNotifications(data.notifications || []);
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };
    fetchNotifications();
  }, [user]);

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
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
    {
      icon: Calendar,
      label: "Total Events",
      value: statsData.totalEvents.toString(),
      change: "Updated now",
      color: "purple",
      trend: "up",
      onClick: () => { setCurrentView("events"); setFilterMyEvents(false); }
    },
    {
      icon: Users,
      label: "Active Users",
      value: statsData.activeUsers.toString(),
      change: "Total registered",
      color: "blue",
      trend: "up",
      onClick: () => setCurrentView("users")
    },
    {
      icon: CheckCircle,
      label: "Total Registrations",
      value: statsData.totalRegistrations.toString(),
      change: "All time",
      color: "green",
      trend: "up",
      onClick: () => setCurrentView("registrations")
    },
    {
      icon: Clock,
      label: "Pending Approvals",
      value: statsData.pendingApprovals.toString(),
      change: "Action needed",
      color: "orange",
      trend: "alert",
      onClick: () => { setCurrentView("events"); setFilterStatus("pending"); setFilterMyEvents(true); }
    },

  ];

  // Group Registrations by Event
  const groupedRegistrations = registrationsList.reduce((acc, reg) => {
    if (!reg.event) return acc;
    const eventId = reg.event._id;
    if (!acc[eventId]) {
      acc[eventId] = {
        event: reg.event,
        registrations: [],
        pendingCount: 0,
        approvedCount: 0
      };
    }
    acc[eventId].registrations.push(reg);
    if (reg.status === 'pending') acc[eventId].pendingCount++;
    if (reg.status === 'approved') acc[eventId].approvedCount++;
    return acc;
  }, {});

  const toggleEventAccordion = (eventId) => {
    setExpandedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const events = eventsList; // Use fetched events

  // Filter Logic
  const filteredEvents = eventsList.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesDate = !filterDate || event.date === filterDate;
    const matchesMyEvents = !filterMyEvents || (user && event.createdBy?._id === user._id);

    return matchesSearch && matchesCategory && matchesStatus && matchesDate && matchesMyEvents;
  });



  // Filter for pending approvals
  const pendingApprovals = eventsList.filter(ev => ev.status === 'pending');
  const pendingRegistrations = registrationsList.filter(r => r.status === 'pending');
  const totalPending = pendingApprovals.length + pendingRegistrations.length;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const localToday = `${year}-${month}-${day}`;

  const handleApproveEvent = async (id, approve = true) => {
    try {
      const token = localStorage.getItem("token");
      const status = approve ? 'active' : 'cancelled';
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      const token = localStorage.getItem("token");
      const status = approve ? 'approved' : 'rejected';
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const localToday = `${year}-${month}-${day}`;

    if (newEvent.date < localToday) return alert("Event date cannot be in the past.");

    // Registration Validation
    if (newEvent.registrationEndDate && newEvent.date && newEvent.registrationEndDate > newEvent.date) {
      return alert("Registration cannot end after the event date.");
    }

    if (newEvent.registrationStartDate && newEvent.registrationEndDate && newEvent.registrationStartDate > newEvent.registrationEndDate) {
      return alert("Registration start date cannot be after end date.");
    }

    try {
      // Use current logged-in user as creator
      const payload = {
        ...newEvent,
        createdBy: user?._id || (usersList.length > 0 ? usersList[0]._id : null)
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
          title: "", description: "", category: "Technology", date: "", time: "", location: "", college: "", totalSeats: 100, teamSizeMin: 1, teamSizeMax: 1, registrationStartDate: "", registrationEndDate: "", image: ""
        });
        setImagePreview("");
        alert("Event created successfully!");
      } else {
        const errorData = await res.json();
        alert(`Failed to create event: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to create event", error);
      alert(`Failed to create event: ${error.message}`);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const localToday = `${year}-${month}-${day}`;

    if (newEvent.date < localToday) return alert("Event date cannot be in the past.");

    // Registration Validation
    if (newEvent.registrationEndDate && newEvent.date && newEvent.registrationEndDate > newEvent.date) {
      return alert("Registration cannot end after the event date.");
    }

    if (newEvent.registrationStartDate && newEvent.registrationEndDate && newEvent.registrationStartDate > newEvent.registrationEndDate) {
      return alert("Registration start date cannot be after end date.");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setEditingEvent(null);
        setNewEvent({ title: "", description: "", category: "Technology", date: "", time: "", location: "", college: "", totalSeats: 100, teamSizeMin: 1, teamSizeMax: 1, registrationStartDate: "", registrationEndDate: "", image: "" });
        setImagePreview("");
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
      teamSizeMin: event.teamSizeMin || 1,
      teamSizeMax: event.teamSizeMax || 1,
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

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium animate-pulse">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] blur-[100px] rounded-full mix-blend-screen opacity-50 ${darkMode ? 'bg-purple-600/30' : 'bg-purple-400/40'}`}
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute top-[20%] right-[-10%] w-[400px] h-[400px] blur-[100px] rounded-full mix-blend-screen opacity-50 ${darkMode ? 'bg-pink-600/20' : 'bg-pink-400/30'}`}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className={`absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] blur-[100px] rounded-full mix-blend-screen opacity-50 ${darkMode ? 'bg-orange-600/20' : 'bg-orange-400/30'}`}
        />
      </div>

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-lg transition-all ${darkMode ? "bg-slate-950/70 border-white/10 shadow-black/20" : "bg-white/70 border-white/40 shadow-slate-200/50"}`}>
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-700'}`}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Logo size={32} className={`${darkMode ? "bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-pink-500/30" : "bg-gradient-to-br from-pink-100 to-orange-100 border border-pink-200"}`} />
              <h1 className={`font-bold text-xl tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Admin Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-purple-600'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2.5 rounded-xl border transition-all relative ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-4 w-80 rounded-2xl shadow-2xl overflow-hidden border z-50 ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                    <h3 className="font-bold">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm opacity-50">No notifications</div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n._id} className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'} ${!n.read ? 'bg-pink-500/5 border-l-2 border-pink-500' : ''}`}>
                          <p className="font-semibold text-sm">{n.title}</p>
                          <p className="text-xs opacity-70 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-500/20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block">
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user?.fullName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-20 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full z-40 pt-24 transition-all duration-300 ease-in-out ${showSidebar ? 'w-72 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'} ${darkMode ? "bg-slate-950/80 backdrop-blur-xl border-r border-white/10" : "bg-white/80 backdrop-blur-xl border-r border-white/40"}`}>
          <div className="px-6 py-6 space-y-2 overflow-y-auto h-full pb-24 custom-scrollbar">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'events', icon: Calendar, label: 'Event Management' },
              { id: 'users', icon: Users, label: 'User Management' },
              { id: 'registrations', icon: CheckCircle, label: 'Registrations' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group ${currentView === item.id
                  ? "bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-lg shadow-pink-500/30 scale-[1.02]"
                  : darkMode
                    ? "text-slate-400 hover:bg-white/10 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <item.icon size={22} className={currentView === item.id ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
                <span>{item.label}</span>
              </button>
            ))}

            {/* Logout Button at bottom of sidebar */}
            <div className="mt-8 pt-8 border-t border-gray-500/10">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${darkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
              >
                <LogOut size={22} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Scrollable */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 p-8 pb-20 relative z-10 ${showSidebar ? 'ml-72' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className={`text-4xl font-bold bg-gradient-to-r ${darkMode ? 'from-white via-pink-200 to-orange-200' : 'from-slate-900 via-purple-800 to-slate-900'} bg-clip-text text-transparent mb-2`}>
                  {currentView === 'overview' ? 'Dashboard Overview' :
                    currentView === 'events' ? 'Event Management' :
                      currentView === 'users' ? 'User Directory' :
                        currentView === 'registrations' ? 'Registration Requests' :
                          currentView === 'analytics' ? 'Analytics & Insights' :
                            currentView === 'settings' ? 'Settings' : 'Dashboard'}
                </h1>
                <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage and monitor your campus events platform.
                </p>
              </div>
              {currentView === 'events' && (
                <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all flex items-center gap-2">
                  <Plus size={20} /> Create New Event
                </button>
              )}
            </header>

            {currentView === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative overflow-hidden rounded-3xl p-6 border cursor-pointer group transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/70 border-white/50 hover:bg-white/90 shadow-lg'}`}
                      onClick={stat.onClick}
                    >
                      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-${stat.color}-500/20 blur-2xl group-hover:bg-${stat.color}-500/30 transition-all`}></div>

                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                          <stat.icon size={24} />
                        </div>
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</span>
                      </div>

                      <div className="relative z-10">
                        <h3 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-500 flex items-center gap-1 font-medium bg-green-500/10 px-2 py-0.5 rounded-lg">
                            <TrendingUp size={12} /> {stat.trend === 'up' ? '+' : ''}12%
                          </span>
                          <span className={darkMode ? 'text-slate-500' : 'text-slate-400'}>{stat.change}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentView === "events" && (
              <div className={`rounded-3xl border backdrop-blur-xl overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/40 shadow-xl'}`}>
                {/* Tool bar */}
                <div className="p-6 border-b border-gray-500/10 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-white/10 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'} focus:ring-2 focus:ring-pink-500 outline-none`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Category Filter */}
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className={`p-3 rounded-xl border appearance-none cursor-pointer ${darkMode ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <option value="all">All Categories</option>
                      {["Technology", "Sports", "Cultural", "Academic", "Business", "Workshop", "Music", "Arts"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`p-3 rounded-xl border appearance-none cursor-pointer ${darkMode ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Date Filter */}
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className={`p-3 rounded-xl border cursor-pointer ${darkMode ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    />

                    {/* My Events Filter */}
                    <button
                      onClick={() => setFilterMyEvents(!filterMyEvents)}
                      className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${filterMyEvents
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-pink-500/30 shadow-lg shadow-pink-500/30'
                        : darkMode
                          ? 'bg-slate-900/50 border-white/10 text-white hover:bg-white/10'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      title={filterMyEvents ? "Show All Events" : "Show Only My Events"}
                    >
                      {filterMyEvents ? "My Events" : "All Events"}
                    </button>
                    {(filterCategory !== 'all' || filterStatus !== 'all' || filterDate) && (
                      <button
                        onClick={() => { setFilterCategory('all'); setFilterStatus('all'); setFilterDate(''); setSearchQuery(''); }}
                        className={`p-3 rounded-xl border hover:bg-red-500/10 hover:text-red-500 transition-colors ${darkMode ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                        title="Clear Filters"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                      <tr className="text-left text-xs uppercase tracking-wider font-semibold">
                        <th className="px-6 py-4 rounded-tl-lg">Event</th>
                        <th className="px-6 py-4">Date & Location</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Registrations</th>
                        <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                      {filteredEvents.map((event) => (
                        <tr key={event._id} className={`group transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-12 rounded-lg overflow-hidden relative">
                                <img src={event.image} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{event.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              <p className="flex items-center gap-2"><Calendar size={14} className="text-pink-500" /> {event.date}</p>
                              <p className="flex items-center gap-2 mt-1"><MapPin size={14} className="text-orange-500" /> {event.location}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                              ${event.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                event.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                  event.status === 'completed' ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' :
                                    'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                              {event.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full max-w-[140px]">
                              <div className="flex justify-between text-xs mb-1">
                                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{event.registeredCount || 0}/{event.totalSeats}</span>
                                <span className="text-pink-500 font-bold">{Math.round(((event.registeredCount || 0) / event.totalSeats) * 100)}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-700/30 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-pink-500 to-orange-500" style={{ width: `${((event.registeredCount || 0) / event.totalSeats) * 100}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {event.createdBy?._id === user._id && (
                                <>
                                  <button onClick={() => { setEditingEvent(event); setNewEvent(event); setShowCreateModal(true); }} className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}>
                                    <Edit size={18} />
                                  </button>
                                  <button onClick={() => handleDeleteEvent(event._id)} className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-red-50 text-red-600'}`}>
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredEvents.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      No events found. Create one to get started.
                    </div>
                  )}
                </div>
              </div>
            )}



            {currentView === "users" && (
              <div className={`p-1 rounded-3xl overflow-hidden border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                    <tr>
                      <th className="px-6 py-4 text-left">User</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">College</th>
                      <th className="px-6 py-4 text-left">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                    {usersList.filter(u => u.role === 'student').map(u => (
                      <tr key={u._id} className={darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">{u.fullName?.charAt(0) || '?'}</div>
                          <span className={darkMode ? "text-white" : "text-slate-900"}>{u.fullName || 'Unknown User'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm opacity-70">{u.email}</td>
                        <td className="px-6 py-4 text-sm opacity-70">{u.college}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 uppercase">{u.role}</span></td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {currentView === "registrations" && (
              <div className="space-y-6">
                <header className="flex items-center justify-between mb-2">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Event Registrations</h2>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                    Total: {registrationsList.length} Requests
                  </div>
                </header>

                {Object.keys(groupedRegistrations).length === 0 ? (
                  <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No registrations found.</p>
                  </div>
                ) : (
                  Object.values(groupedRegistrations).map(({ event, registrations, pendingCount, approvedCount }) => (
                    <div key={event._id} className={`rounded-3xl border overflow-hidden transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      {/* Accordion Header */}
                      <div
                        onClick={() => toggleEventAccordion(event._id)}
                        className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <Calendar size={24} className="text-pink-500" />
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h3>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex gap-4 text-sm font-medium">
                            <span className="text-green-500">{approvedCount} Approved</span>
                            <span className={pendingCount > 0 ? "text-orange-500" : "opacity-50"}>{pendingCount} Pending</span>
                            <span className="opacity-50">{registrations.length} Total</span>
                          </div>
                          <div className={`transition-transform duration-300 ${expandedEvents[event._id] ? 'rotate-180' : ''}`}>
                            <Menu size={20} className="opacity-50" />
                          </div>
                        </div>
                      </div>

                      {/* Accordion Content */}
                      <motion.div
                        initial={false}
                        animate={{ height: expandedEvents[event._id] ? "auto" : 0, opacity: expandedEvents[event._id] ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`border-t ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                          <table className="w-full">
                            <thead className={`${darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                              <tr className="text-left text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4 pl-10">User Details</th>
                                <th className="px-6 py-4">Registration Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                              {registrations.map(reg => (
                                <tr key={reg._id} className={darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}>
                                  <td className="px-6 py-4 pl-10">
                                    <div>
                                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reg.user?.fullName || 'Unknown'}</p>
                                      <p className="text-xs opacity-70">{reg.user?.email}</p>
                                      {reg.teamName && (
                                        <p className="text-xs text-pink-500 mt-1">Team: {reg.teamName}</p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm opacity-70">
                                    {new Date(reg.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${reg.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                      reg.status === 'rejected' || reg.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                        'bg-yellow-500/10 text-yellow-500'
                                      }`}>
                                      {reg.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {/* Allow Approval if not already approved */}
                                      {reg.status !== 'approved' && (
                                        <button
                                          onClick={() => handleApproveRegistration(reg._id, true)}
                                          className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                          title="Approve"
                                        >
                                          <CheckCircle size={18} />
                                        </button>
                                      )}

                                      {/* Allow Rejection if not already rejected - THIS IS THE FIX FOR "REVERT APPROVAL" */}
                                      {reg.status !== 'rejected' && reg.status !== 'cancelled' && (
                                        <button
                                          onClick={() => handleApproveRegistration(reg._id, false)}
                                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                          title={reg.status === 'approved' ? "Revoke Approval" : "Reject"}
                                        >
                                          <XCircle size={18} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentView === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Events by Category</h3>
                    <div className="space-y-4">
                      {Array.from(new Set(eventsList.map(e => e.category))).map(cat => {
                        const count = eventsList.filter(e => e.category === cat).length;
                        const pct = eventsList.length ? Math.round((count / eventsList.length) * 100) : 0;
                        return (
                          <div key={cat}>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>{cat}</span>
                              <span>{count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-700/30 overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        )
                      })}
                      {eventsList.length === 0 && <p className="opacity-50">No data</p>}
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Events by Status</h3>
                    <div className="space-y-4">
                      {['active', 'completed', 'pending', 'cancelled'].map(status => {
                        const count = eventsList.filter(e => e.status === status).length;
                        const pct = eventsList.length ? Math.round((count / eventsList.length) * 100) : 0;
                        return (
                          <div key={status}>
                            <div className="flex justify-between mb-1 text-sm capitalize">
                              <span>{status}</span>
                              <span>{count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-700/30 overflow-hidden">
                              <div className={`h-full rounded-full ${status === 'active' ? 'bg-green-500' : status === 'cancelled' ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === "settings" && (
              <div className={`max-w-2xl p-8 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Profile Settings</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">Full Name</label>
                    <input name="fullName" defaultValue={user.fullName} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">College</label>
                    <input name="college" defaultValue={user.college} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">New Password</label>
                    <input name="password" type="password" placeholder="Leave blank to keep current" className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">Update Profile</button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-500/20">
                  <h4 className="text-lg font-bold mb-2">Role Management</h4>
                  <p className="text-sm opacity-70 mb-4">Switch between Admin and Student views if authorized.</p>
                  {user.availableRoles && user.availableRoles.length > 1 ? (
                    <button onClick={() => router.push(user.role === 'admin' ? '/student-dashboard' : '/admin-dashboard')} className={`px-6 py-3 rounded-xl border font-bold ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
                      Switch to {user.role === 'admin' ? 'Student' : 'Admin'} Dashboard
                    </button>
                  ) : (
                    <p className="text-sm opacity-50 italic">Single role account.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Create Event Modal - Styled */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl ${darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white text-slate-900'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent`}>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} focus:ring-2 focus:ring-pink-500 outline-none`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Date</label>
                  <input type="date" min={localToday} value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Time</label>
                  <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Organizing College</label>
                  <input type="text" value={newEvent.college} onChange={(e) => setNewEvent({ ...newEvent, college: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Location (Optional)</label>
                  <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Category</label>
                  <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    {["Technology", "Sports", "Cultural", "Academic", "Business", "Workshop", "Music", "Arts"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Total Seats (Optional)</label>
                  <input type="number" value={newEvent.totalSeats} onChange={(e) => setNewEvent({ ...newEvent, totalSeats: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} min="1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Min Team Size (Optional)</label>
                  <input type="number" value={newEvent.teamSizeMin} onChange={(e) => setNewEvent({ ...newEvent, teamSizeMin: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Max Team Size (Optional)</label>
                  <input type="number" value={newEvent.teamSizeMax} onChange={(e) => setNewEvent({ ...newEvent, teamSizeMax: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} min="1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Registration Start</label>
                  <input type="date" min={localToday} max={newEvent.registrationEndDate || newEvent.date} value={newEvent.registrationStartDate?.split('T')[0] || ''} onChange={(e) => setNewEvent({ ...newEvent, registrationStartDate: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Registration End</label>
                  <input type="date" min={localToday} max={newEvent.date} value={newEvent.registrationEndDate?.split('T')[0] || ''} onChange={(e) => setNewEvent({ ...newEvent, registrationEndDate: e.target.value })} className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={4}
                  className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} focus:ring-2 focus:ring-pink-500 outline-none`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Event Banner</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${darkMode ? 'border-slate-700 hover:border-pink-500/50' : 'border-slate-300 hover:border-pink-500'}`}>
                  {newEvent.image || imagePreview ? (
                    <div className="relative group">
                      <img
                        src={newEvent.image || imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => { setNewEvent({ ...newEvent, image: "" }); setImagePreview(""); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className={`p-4 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <Plus size={24} className="opacity-50" />
                      </div>
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs opacity-50">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className={`flex-1 py-3 rounded-xl font-bold ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-lg hover:shadow-pink-500/25 hover:scale-[1.02] transition-transform">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}

    </div>
  );
}
