'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Bell, Search, Filter, Star, User, LogOut, Settings,
  Home, Ticket, Heart, CheckCircle, Clock, XCircle, MapPin,
  Users, TrendingUp, Eye, Download, X, ChevronLeft, ChevronRight,
  Moon, Sun, Menu, Briefcase, Printer
} from "lucide-react";
import Logo from "@/components/Logo";
import Toast from "@/components/Toast";
import { QRCodeSVG } from "qrcode.react";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("feed");
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [registrationEvent, setRegistrationEvent] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Team Registration State
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberInput, setMemberInput] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null); // For QR modal
  const [favorites, setFavorites] = useState([]); // Local state for favorites
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [tempInterests, setTempInterests] = useState([]); // Temporary state for modal selections
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "info" });
  };

  // Initial Auth Check and Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token) {
          router.replace("/login");
          return;
        }

        setLoading(true);

        const userRes = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!userRes.ok) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user);
        setFavorites(userData.user.favorites || []);

        const eventsRes = await fetch("/api/events");
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }

        const regsRes = await fetch(`/api/users/${userData.user._id}/registrations`);
        if (regsRes.ok) {
          const data = await regsRes.json();
          setMyRegistrations(data.registrations || []);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Handle mobile sidebar on resize.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRegisterClick = (event) => {
    if (!user) return showToast("Please login first", "error");
    if (event.registeredUsers?.includes(user._id)) return showToast("Already registered!", "info");

    setRegistrationEvent(event);
    setTeamName(""); // Reset
    setTeamMembers([]); // Reset
    setMemberInput(""); // Reset
    setShowRegisterModal(true);
  };

  const handleToggleFavorite = async (e, eventId) => {
    e.stopPropagation();
    if (!user) return;

    const isFav = favorites.includes(eventId);
    const method = isFav ? "DELETE" : "POST";

    // Optimistic update
    setFavorites(prev => isFav ? prev.filter(id => id !== eventId) : [...prev, eventId]);

    try {
      await fetch(`/api/users/${user._id}/favorites`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
      });
    } catch (error) {
      // Revert on error
      console.error("Failed to toggle favorite", error);
      setFavorites(prev => isFav ? [...prev, eventId] : prev.filter(id => id !== eventId));
    }
  };

  const addTeamMember = () => {
    if (!memberInput.trim()) return;
    if (teamMembers.includes(memberInput.trim())) return showToast("Member already added", "error");
    setTeamMembers([...teamMembers, memberInput.trim()]);
    setMemberInput("");
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleConfirmRegistration = async () => {
    if (!registrationEvent || !user) return;

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: registrationEvent._id,
          userId: user._id,
          teamName: teamName,
          teamMembers: teamMembers
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Optimistic UI update
        const updatedEvents = events.map(e => e._id === registrationEvent._id ?
          { ...e, registeredUsers: [...(e.registeredUsers || []), user._id], registeredCount: (e.registeredCount || 0) + 1 } : e
        );
        setEvents(updatedEvents);

        if (selectedEvent && selectedEvent._id === registrationEvent._id) {
          setSelectedEvent(prev => ({ ...prev, registeredUsers: [...(prev.registeredUsers || []), user._id] }));
        }

        // Add to myRegistrations
        setMyRegistrations(prev => [{
          ...data.registration,
          event: registrationEvent // Keep full event object for display
        }, ...prev]);

        showToast("Registration submitted! Waiting for admin approval.", "success");
        setShowRegisterModal(false);
        setRegistrationEvent(null);
      } else {
        const data = await res.json();
        showToast(data.error || "Registration failed", "error");
      }
    } catch (e) {
      console.error("Registration failed", e);
      showToast("Registration failed", "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      fullName: formData.get("fullName"),
      college: formData.get("college"),
    };
    const password = formData.get("password");
    if (password) updates.password = password;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, ...data.user });
        showToast("Profile updated successfully!", "success");
        e.target.reset();
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Update failed", error);
      showToast("Failed to update profile", "error");
    }
  };

  const handleCancelRegistration = async (registration) => {
    if (!registration || !registration.event) {
      return showToast("Cannot cancel: Event details not found.", "error");
    }
    const eventDate = new Date(registration.event.date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      return showToast("Cannot cancel registration within 2 days of the event.", "error");
    }

    if (!confirm("Are you sure you want to cancel your registration?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/registrations/${registration._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (res.ok) {
        setMyRegistrations(myRegistrations.map(r =>
          r._id === registration._id ? { ...r, status: 'cancelled' } : r
        ));
        // Remove from local events view if needed or just update status
        setEvents(events.map(ev =>
          ev._id === registration.event._id ?
            { ...ev, registeredCount: Math.max(0, (ev.registeredCount || 1) - 1), registeredUsers: ev.registeredUsers?.filter(id => id !== user._id) }
            : ev
        ));

        showToast("Registration cancelled successfully.", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to cancel registration", "error");
      }
    } catch (error) {
      console.error("Cancellation failed", error);
      showToast("Failed to cancel registration", "error");
    }
  };



  const categories = [
    { name: "all", icon: "🎯", label: "All Events" },
    { name: "Cultural", icon: "🎭", label: "Cultural" },
    { name: "Sports", icon: "🏆", label: "Sports" },
    { name: "Hackathon", icon: "💻", label: "Hackathon" },
    { name: "Workshop", icon: "🎤", label: "Workshop" },
    { name: "Music", icon: "🎶", label: "Music" },
    { name: "Arts", icon: "🎨", label: "Arts" },
    { name: "Technology", icon: "💻", label: "Technology" },
    { name: "Academic", icon: "📚", label: "Academic" },
    { name: "Business", icon: "💼", label: "Business" }
  ];

  // Derived stats
  // Derived stats
  const registeredEvents = myRegistrations.filter(reg => reg.status === 'approved').map(reg => ({
    ...reg.event,
    registeredDate: new Date(reg.createdAt).toLocaleDateString(),
    status: reg.status
  })).filter(ev => ev && ev._id);

  const upcomingEventsCount = registeredEvents.filter(ev => new Date(ev.date) > new Date()).length;
  const pastEventsCount = registeredEvents.filter(ev => new Date(ev.date) < new Date()).length;

  const notifications = [
    // Registration notifications
    ...myRegistrations.map((reg, i) => ({
      id: `reg-${i}`,
      type: reg.status === 'approved' ? 'success' : reg.status === 'rejected' ? 'error' : 'warning',
      message: reg.status === 'approved' ? `Registration approved for ${reg.event?.title}` :
        reg.status === 'rejected' ? `Registration rejected for ${reg.event?.title}` :
          `Registration pending for ${reg.event?.title}`,
      time: new Date(reg.createdAt), // Store as Date object for sorting
      displayTime: new Date(reg.createdAt).toLocaleDateString()
    })),
    // New Event notifications (last 3 days)
    ...events.filter(ev => {
      const createdDate = new Date(ev.createdAt || ev.date); // Fallback to event date if createdAt missing
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return createdDate > threeDaysAgo;
    }).map((ev, i) => ({
      id: `new-ev-${i}`,
      type: 'info',
      message: `🆕 New Event: ${ev.title} is now open for registration!`,
      time: new Date(ev.createdAt || ev.date),
      displayTime: new Date(ev.createdAt || ev.date).toLocaleDateString()
    }))
  ].sort((a, b) => b.time - a.time).slice(0, 5); // Sort by newest first and take top 5

  const getCategoryColor = (category) => {
    const colors = {
      Hackathon: "#3B82F6",
      Cultural: "#8B5CF6",
      Sports: "#EC4899",
      Workshop: "#10B981",
      Music: "#F59E0B",
      Arts: "#EF4444",
      Technology: "#6366F1",
      Academic: "#F59E0B",
      Business: "#643F7F"
    };
    return colors[category] || "#6B7280";
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesDate = !filterDate || event.date === filterDate;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.college.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch && matchesDate;
  });

  const getRegistrationStatus = (eventId) => {
    const reg = myRegistrations.find(r => r.event?._id === eventId || r.event === eventId);
    return reg ? reg.status : null;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const bgClass = darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50";
  const cardBg = darkMode ? "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-pink-500/10" : "bg-white border-gray-300 shadow-xl shadow-pink-200/30";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-700";
  const hoverBg = darkMode ? "hover:bg-white/5" : "hover:bg-pink-100/50";

  const handleUpdateInterests = async (selectedInterests) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ interests: selectedInterests })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setShowInterestModal(false);
        showToast("Interests updated successfully!", "success");
      } else {
        showToast("Failed to update interests", "error");
      }
    } catch (error) {
      showToast("Error updating interests", "error");
    }
  };

  // Initialize temp interests when modal opens
  const openInterestModal = () => {
    setTempInterests(user?.interests || []);
    setShowInterestModal(true);
  };

  const getSmartMatches = () => {
    if (!user?.interests || user.interests.length === 0) return [];

    // Normalize user interests to lowercase for comparison, safely
    const userInterestsLower = user.interests
      .filter(i => typeof i === 'string')
      .map(i => i.toLowerCase());

    return events.filter(event => {
      if (!event) return false;

      // Logic: If event matches any of the user's interests via tags or category
      const eventTags = (event.tags || [])
        .filter(t => typeof t === 'string')
        .map(t => t.toLowerCase());

      const eventCategory = typeof event.category === 'string' ? event.category.toLowerCase() : '';

      const hasTagMatch = eventTags.some(tag => userInterestsLower.includes(tag));
      const hasCategoryMatch = eventCategory && userInterestsLower.includes(eventCategory);

      // Filter out completed and cancelled, allow active and pending (if pending shows in feed)
      const validStatus = event.status !== 'completed' && event.status !== 'cancelled';

      return (hasTagMatch || hasCategoryMatch) && validStatus;
    }).map(event => {
      // Calculate match score
      let score = 0;
      const eventCategory = typeof event.category === 'string' ? event.category.toLowerCase() : '';
      const eventTags = (event.tags || [])
        .filter(t => typeof t === 'string')
        .map(t => t.toLowerCase());

      if (eventCategory && userInterestsLower.includes(eventCategory)) score += 5;

      eventTags.forEach(tag => {
        if (userInterestsLower.includes(tag)) score += 3;
      });
      return { ...event, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  if (loading) return <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>Loading CampusEventHub...</div>;
  if (!user) return <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>Please log in to continue.</div>;

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
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-700'}`}
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="group-hover:scale-110 transition-transform">
                <Logo size={32} className={darkMode ? "bg-white/10" : "bg-white"} />
              </div>
              <h1 className={`font-bold text-xl tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>CampusEventHub</h1>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-purple-600'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2.5 rounded-xl border transition-all relative ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                <Bell size={20} />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-4 w-80 md:w-96 rounded-2xl shadow-2xl border overflow-hidden z-50 ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif.id} className={`p-4 border-b last:border-0 hover:bg-white/5 transition-colors flex gap-3 ${darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                            <div>
                              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{notif.message}</p>
                              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{notif.displayTime}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center opacity-50">
                          <Bell size={32} className="mx-auto mb-2" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>            </div>

            <button onClick={handleLogout} className={`px-4 py-2.5 rounded-xl font-medium transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <aside className={`fixed left-0 top-0 h-full z-40 pt-24 transition-transform duration-300 ease-in-out 
        ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} 
        md:translate-x-0 ${sidebarCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-72 md:opacity-100'}
        w-64 shadow-2xl md:shadow-none
        ${darkMode ? "bg-slate-950/95 backdrop-blur-xl border-r border-white/10" : "bg-white/95 backdrop-blur-xl border-r border-white/40"}`}>
        <div className="px-6 py-6 space-y-2">
          {[
            { id: 'feed', icon: Home, label: 'Dashboard' },
            { id: 'smart-match', icon: Star, label: 'For You' }, // NEW TAB
            { id: 'registered', icon: Ticket, label: 'My Events' },
            { id: 'calendar', icon: Calendar, label: 'Calendar' },
            { id: 'achievements', icon: Briefcase, label: 'Achievements' },
            { id: 'favorites', icon: Heart, label: 'Favorites' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-lg font-medium group ${currentView === item.id
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
        </div>
      </aside>

      <div className={`transition-all duration-300 relative z-10 min-h-screen pt-24 px-4 md:px-8 pb-12 ${sidebarCollapsed ? 'ml-0' : 'ml-0 md:ml-72'}`}>
        <main className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {currentView === "feed" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-3xl p-10 border shadow-2xl ${darkMode ? 'bg-white/5 border-white/10 shadow-black/20' : 'bg-white/60 border-white/40 shadow-slate-200/50'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${darkMode ? 'from-pink-600/20 via-purple-600/20 to-orange-600/20' : 'from-pink-400/30 via-purple-400/30 to-orange-400/30'} blur-3xl opacity-50`}></div>
                <div className="relative z-10">
                  <h1 className={`text-3xl md:text-5xl font-bold bg-gradient-to-r ${darkMode ? 'from-white via-pink-200 to-orange-200' : 'from-slate-900 via-purple-800 to-slate-900'} bg-clip-text text-transparent mb-4 tracking-tight`}>
                    Welcome back, {user.fullName?.split(' ')[0]}! 👋
                  </h1>
                  <p className={`text-lg md:text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Here's what's happening on campus today.</p>
                </div>
              </motion.div>

              {/* Stat Cards - Glassmorphism */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Using motion divs for interactions */}
                {[
                  { title: "Registered", count: registeredEvents.length, icon: Ticket, color: "pink", sub: "Active Events" },
                  { title: "Upcoming", count: upcomingEventsCount, icon: Calendar, color: "orange", sub: "Don't miss out" },
                  { title: "Completed", count: pastEventsCount, icon: CheckCircle, color: "purple", sub: "Keep it up" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`relative overflow-hidden rounded-3xl p-6 border transition-all cursor-pointer group ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/70 border-white/50 hover:bg-white/90 shadow-lg shadow-slate-200/50'}`}
                    onClick={() => setCurrentView(stat.title === "Upcoming" ? "calendar" : "registered")}
                  >
                    <div className={`absolute top-0 right-0 p-32 bg-${stat.color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${stat.color}-500/20`}></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <p className={`font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.title}</p>
                        <h3 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.count}</h3>
                        <p className={`text-sm mt-3 font-semibold text-${stat.color}-500`}>{stat.sub}</p>
                      </div>
                      <div className={`p-4 rounded-2xl bg-${stat.color}-500/20 text-${stat.color}-500 shadow-lg shadow-${stat.color}-500/10`}>
                        <stat.icon size={28} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Filter Section */}
              <div className={`p-6 rounded-3xl border backdrop-blur-xl mb-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/40 shadow-xl'}`}>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
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
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
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

                    {(selectedCategory !== 'all' || filterStatus !== 'all' || filterDate || searchQuery) && (
                      <button
                        onClick={() => { setSelectedCategory('all'); setFilterStatus('all'); setFilterDate(''); setSearchQuery(''); }}
                        className={`p-3 rounded-xl border hover:bg-red-500/10 hover:text-red-500 transition-colors ${darkMode ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                        title="Clear Filters"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, i) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`group rounded-3xl overflow-hidden border backdrop-blur-sm transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10 hover:shadow-2xl hover:shadow-purple-900/20' : 'bg-white border-slate-100 hover:shadow-2xl hover:shadow-slate-200'}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 shadow-lg">
                          {event.category}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(e, event._id)}
                        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${favorites.includes(event._id) ? "bg-white text-pink-500 shadow-lg scale-110" : "bg-black/30 text-white hover:bg-black/50"}`}
                      >
                        <Heart size={20} fill={favorites.includes(event._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-xl font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h3>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar size={16} className="text-pink-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin size={16} className="text-orange-500" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <button className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg ${getRegistrationStatus(event._id) === 'approved'
                        ? "bg-green-500/20 text-green-500 shadow-green-500/10 cursor-default"
                        : getRegistrationStatus(event._id) === 'pending'
                          ? "bg-orange-500/20 text-orange-500 shadow-orange-500/10 cursor-default"
                          : getRegistrationStatus(event._id) === 'rejected'
                            ? "bg-red-500/20 text-red-500 shadow-red-500/10 cursor-default"
                            : "bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02]"
                        }`}>
                        {getRegistrationStatus(event._id) === 'approved' ? "Registered" :
                          getRegistrationStatus(event._id) === 'pending' ? "Pending" :
                            getRegistrationStatus(event._id) === 'rejected' ? "Registration Rejected" :
                              "View Details"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Other views (Registered, Calendar, etc.) would follow similar styling patterns */}
          {currentView === "registered" && (
            <div className={`p-8 rounded-3xl border backdrop-blur-xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/40'}`}>
              <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>My Registered Events</h2>
              {myRegistrations.length > 0 ? (
                <div className="grid gap-4">
                  {myRegistrations.map(reg => (
                    <div key={reg._id} className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <img src={reg.event?.image} className="w-16 h-16 md:w-24 md:h-24 rounded-xl object-cover shadow-md" />
                        <div>
                          <h3 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reg.event?.title}</h3>
                          <div className="flex items-center gap-3 mt-1 md:mt-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${reg.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                              reg.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                              }`}>
                              {reg.status}
                            </span>
                          </div>
                        </div>
                      </div>


                      {reg.status !== 'cancelled' && reg.status !== 'rejected' && (
                        <div className="w-full md:w-auto md:ml-auto flex gap-2">
                          {reg.status === 'approved' && (
                            <button
                              onClick={() => setSelectedTicket(reg)}
                              className={`px-4 py-2 rounded-xl font-bold text-sm ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                            >
                              View Ticket
                            </button>
                          )}

                          <button
                            onClick={() => handleCancelRegistration(reg)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-sm`}
                            title="Cancel Registration (Allowed until 2 days before event)"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  <Ticket size={48} className="mx-auto mb-4" />
                  <p>No registrations yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Minimal Placeholder for other views to keep code short for now */}
          {currentView === "calendar" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-3xl border backdrop-blur-xl p-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/40 shadow-xl'}`}
            >
              {/* Header with improved controls */}
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${darkMode ? 'from-white via-pink-200 to-orange-200' : 'from-slate-900 via-purple-800 to-slate-900'} bg-clip-text text-transparent`}>
                  My Event Calendar
                </h2>
                <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1 border border-white/10">
                  <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-700'}`}>
                    <ChevronLeft size={20} />
                  </button>
                  <span className={`px-4 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-700'}`}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={`font-bold text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{day}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-28 rounded-2xl opacity-20"></div>
                ))}

                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const year = calendarDate.getFullYear();
                  const month = calendarDate.getMonth(); // 0-indexed
                  // Construct fixed YYYY-MM-DD string using local time values
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                  const dayEvents = myRegistrations.filter(r => r.event && r.event.date && r.event.date.startsWith(dateStr) && r.status === 'approved');
                  const hasEvent = dayEvents.length > 0;

                  // Check isToday using local time
                  const now = new Date();
                  const isToday = now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`h-28 rounded-2xl p-3 relative group transition-all border ${hasEvent
                        ? 'bg-gradient-to-br from-pink-500/10 to-orange-500/10 border-pink-500/30 shadow-lg shadow-pink-500/10'
                        : isToday
                          ? 'bg-white/10 border-white/20'
                          : darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`flex justify-between items-start`}>
                        <span className={`font-bold ${isToday
                          ? 'bg-pink-500 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg'
                          : hasEvent ? 'text-pink-400' : darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>{day}</span>
                      </div>

                      {hasEvent && (
                        <div className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100%-30px)] custom-scrollbar">
                          {dayEvents.map((reg, idx) => (
                            <div key={idx} className="text-[10px] px-2 py-1 bg-gradient-to-r from-pink-600 to-orange-600 rounded-lg text-white truncate shadow-sm" title={reg.event.title}>
                              {reg.event.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentView === "achievements" && (
            <div className={`p-8 rounded-3xl border backdrop-blur-xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/40 shadow-xl'}`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${darkMode ? 'from-white via-pink-200 to-orange-200' : 'from-slate-900 via-purple-800 to-slate-900'} bg-clip-text text-transparent`}>
                    My Extra-Curricular Achievements
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Official record of your event participation and achievements.</p>
                </div>
              </div>

              {/* Portfolio Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Events</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{myRegistrations.filter(r => r.status === 'approved').length}</p>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Categories</p>
                  <p className={`text-3xl font-bold text-pink-500`}>
                    {[...new Set(myRegistrations.filter(r => r.status === 'approved' && r.event).map(r => r.event.category))].length}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>First Event</p>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>
                    {myRegistrations.filter(r => r.status === 'approved').length > 0
                      ? new Date(Math.min(...myRegistrations.filter(r => r.status === 'approved').map(r => new Date(r.event?.date)))).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</p>
                  <p className="text-lg font-bold text-green-500 flex items-center gap-2"><CheckCircle size={18} /> Active Student</p>
                </div>
              </div>

              {/* Timeline / List */}
              <div className="space-y-6">
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Activity Timeline</h3>
                {myRegistrations.filter(r => r.status === 'approved' && r.event?.date && !isNaN(new Date(r.event.date).getTime())).length > 0 ? (
                  myRegistrations
                    .filter(r => r.status === 'approved' && r.event?.date && !isNaN(new Date(r.event.date).getTime()))
                    .sort((a, b) => new Date(b.event?.date) - new Date(a.event?.date))
                    .map((reg, index) => (
                      <div key={index} className={`relative flex gap-6 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                        {/* Timeline Connector */}
                        {index !== myRegistrations.filter(r => r.status === 'approved').length - 1 && (
                          <div className={`absolute left-[43px] top-20 bottom-[-24px] w-0.5 ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                        )}

                        <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${darkMode ? 'bg-gradient-to-br from-gray-800 to-black border border-white/10' : 'bg-white border border-slate-100 shadow-slate-200'}`}>
                          {reg.event?.category === "Technology" ? "💻" :
                            reg.event?.category === "Sports" ? "🏆" :
                              reg.event?.category === "Cultural" ? "🎭" : "🎯"}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reg.event?.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${darkMode ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                              {new Date(reg.event?.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Participated in {reg.event?.category} event at <span className="font-semibold">{reg.event?.college}</span>.
                          </p>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
                              ✅ Participation Verified
                            </span>
                            {reg.teamMembers?.length > 0 && (
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${darkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                                👥 Team Leader
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-20 opacity-50">
                    <Briefcase size={48} className="mx-auto mb-4" />
                    <p>No approved activities yet. Register for events to build your portfolio!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "smart-match" && (
            <div className="space-y-8">
              <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${darkMode ? 'from-white via-purple-200 to-blue-200' : 'from-slate-900 via-purple-800 to-slate-900'} bg-clip-text text-transparent`}>
                      Smart Event Matching
                    </h2>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Events curated just for you based on your interests.
                    </p>
                  </div>
                  <button
                    onClick={openInterestModal}
                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    <Settings size={18} className="inline mr-2" />
                    Customize Interests
                  </button>
                </div>

                {(!user?.interests || user.interests.length === 0) ? (
                  <div className="text-center py-12">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <Star size={32} className="text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No interests selected yet</h3>
                    <p className="mb-6 opacity-60">Tell us what you like to get personalized event recommendations.</p>
                    <button
                      onClick={openInterestModal}
                      className="px-8 py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-pink-700"
                    >
                      Select Interests
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="text-sm font-medium opacity-60 flex items-center mr-2">Your Interests:</span>
                      {user.interests.map(interest => (
                        <span key={interest} className={`px-3 py-1 rounded-full text-xs font-bold border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                          {interest}
                        </span>
                      ))}
                    </div>

                    {getSmartMatches().length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getSmartMatches().map((event, i) => (
                          <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative group rounded-3xl overflow-hidden border backdrop-blur-sm transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10 hover:shadow-2xl hover:shadow-purple-900/20' : 'bg-white border-slate-100 hover:shadow-2xl hover:shadow-slate-200'}`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg flex items-center gap-1">
                              <Star size={12} fill="currentColor" /> {Math.round(event.matchScore / 8 * 100)}% Match
                            </div>

                            <div className="relative h-48 overflow-hidden">
                              <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 shadow-lg">
                                  {event.category}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(event.tags || []).slice(0, 3).map(tag => (
                                  <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-md ${user.interests.includes(tag) ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-slate-500/10 text-slate-500'}`}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center justify-between text-sm opacity-70">
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                <button className={`font-bold hover:underline ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>View Details</button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 opacity-50 border-t border-dashed border-gray-700">
                        <p>No events match your current interests perfectly right now. Try adding more interests!</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {currentView === "favorites" && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${textPrimary} mb-6`}>My Favorites</h2>
              {events.filter(ev => user.favorites?.includes(ev._id)).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter(ev => user.favorites?.includes(ev._id)).map(event => (
                    <div key={event._id} onClick={() => setSelectedEvent(event)} className={`group relative rounded-2xl overflow-hidden cursor-pointer border ${cardBg} hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/5`}>
                      {/* Reuse event card layout or create simplified one */}
                      <div className="h-48 relative overflow-hidden">
                        <img src={event.image || `https://source.unsplash.com/random/800x600?${event.category}`} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getCategoryColor(event.category)} backdrop-blur-md shadow-lg`}>
                          {event.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{event.title}</h3>
                        <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>{event.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className={`flex items-center gap-2 ${textSecondary}`}>
                            <Calendar size={16} className="text-pink-500" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className={`font-bold ${textPrimary}`}>{event.price ? `₹${event.price}` : 'Free'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${cardBg} border rounded-2xl p-12 text-center`}>
                  <Heart size={48} className="mx-auto text-pink-500 mb-4" />
                  <h3 className={`text-2xl font-bold ${textPrimary}`}>No Favorites Yet</h3>
                  <p className={textSecondary}>Mark events as favorites to see them here.</p>
                </div>
              )}
            </div>
          )}

          {currentView === "settings" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl"
            >
              <div className={`p-8 rounded-3xl border backdrop-blur-xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/40 shadow-xl'}`}>
                <h2 className={`text-3xl font-bold mb-8 bg-gradient-to-r ${darkMode ? 'from-white via-pink-200 to-orange-200' : 'from-slate-900 via-purple-800 to-slate-900'} bg-clip-text text-transparent`}>
                  Profile Settings
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>Full Name</label>
                      <input
                        name="fullName"
                        defaultValue={user.fullName}
                        className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${darkMode ? 'bg-slate-900/50 border-white/10 text-white focus:bg-slate-900' : 'bg-white border-slate-200 text-slate-900 focus:bg-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>College</label>
                      <input
                        name="college"
                        defaultValue={user.college}
                        className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${darkMode ? 'bg-slate-900/50 border-white/10 text-white focus:bg-slate-900' : 'bg-white border-slate-200 text-slate-900 focus:bg-white'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>New Password</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Leave blank to keep current password"
                      className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${darkMode ? 'bg-slate-900/50 border-white/10 text-white focus:bg-slate-900' : 'bg-white border-slate-200 text-slate-900 focus:bg-white'}`}
                    />
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] transition-all flex items-center gap-2">
                      <CheckCircle size={20} /> Update Profile
                    </button>
                  </div>
                </form>

                {/* Role Switcher */}
                <div className={`mt-10 pt-8 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Dashboard Access</h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Switch between Admin and Student views</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-bold border ${darkMode ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                      Current Role: <span className="uppercase text-pink-500">{user.role}</span>
                    </div>
                  </div>

                  {user.availableRoles && user.availableRoles.length > 1 ? (
                    <button
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between group transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                      onClick={() => {
                        if (user.role === 'admin') {
                          router.push('/student-dashboard');
                        } else {
                          router.push('/admin-dashboard');
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 text-pink-500">
                          <LogOut size={24} />
                        </div>
                        <div className="text-left">
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Switch to {user.role === 'admin' ? 'Student' : 'Admin'} Dashboard</p>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>You have access to both dashboards</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} group-hover:translate-x-1 transition-transform`} />
                    </button>
                  ) : (
                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} italic flex items-center gap-2`}>
                        Single role account. Contact administrator for additional access.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div >

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className={`${cardBg} border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="relative h-64">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-4 py-1.5 ${getCategoryColor(selectedEvent.category)} rounded-full text-white text-sm font-semibold capitalize`}>
                  {selectedEvent.category}
                </span>
                <span className={`px-4 py-1.5 border ${selectedEvent.trending ? 'border-red-500/50 text-red-400' : 'border-gray-500/50 text-gray-400'} rounded-full text-sm font-semibold flex items-center gap-2`}>
                  {selectedEvent.trending ? <><TrendingUp size={14} /> Trending</> : 'Standard Event'}
                </span>
              </div>

              <h2 className={`text-3xl font-bold ${textPrimary} mb-2`}>{selectedEvent.title}</h2>
              <div className="flex items-center justify-between mb-6">
                <p className={`text-lg ${textSecondary}`}>{selectedEvent.college}</p>
                <button onClick={(e) => handleToggleFavorite(selectedEvent._id, e)} className={`p-2 rounded-full border ${user.favorites?.includes(selectedEvent._id) ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'border-gray-500/30 text-gray-400'} transition-all`}>
                  <Heart size={24} fill={user.favorites?.includes(selectedEvent._id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2 text-pink-400">
                    <Calendar size={20} />
                    <span className="font-semibold">Date & Time</span>
                  </div>
                  <p className={textPrimary}>{new Date(selectedEvent.date).toLocaleDateString()}</p>
                  <p className={`text-sm ${textSecondary}`}>{selectedEvent.time || "10:00 AM"}</p>
                </div>
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2 text-blue-400">
                    <MapPin size={20} />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className={textPrimary}>{selectedEvent.location}</p>
                  <p className={`text-sm ${textSecondary}`}>{selectedEvent.college}</p>
                </div>
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2 text-purple-400">
                    <Users size={20} />
                    <span className="font-semibold">Capacity</span>
                  </div>
                  <p className={textPrimary}>{selectedEvent.totalSeats} Seats</p>
                  <p className={`text-sm ${textSecondary}`}>{selectedEvent.totalSeats - (selectedEvent.registeredCount || 0)} Available</p>
                </div>
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2 text-orange-400">
                    <Clock size={20} />
                    <span className="font-semibold">Reg. Deadline</span>
                  </div>
                  <p className={textPrimary}>{selectedEvent.registrationEndDate ? new Date(selectedEvent.registrationEndDate).toLocaleDateString() : 'Until Full'}</p>
                  <p className={`text-sm ${textSecondary}`}>Hurry up!</p>
                </div>
              </div>

              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <h4 className="text-yellow-500 font-bold mb-1">Event Organizer</h4>
                <p className={textPrimary}>{selectedEvent.createdBy?.fullName || 'Campus Administration'}</p>
                <p className={`text-sm ${textSecondary}`}>{selectedEvent.createdBy?.email}</p>
              </div>

              <div className="mb-8">
                <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>About Event</h3>
                <p className={`${textSecondary} leading-relaxed whitespace-pre-wrap`}>
                  {selectedEvent.description || "Join us for an amazing event filled with learning, networking, and fun. This event brings together students from various colleges to compete and showcase their talents."}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="flex-1">
                  <p className={`text-sm ${textSecondary} mb-1`}>Registration Fee</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{selectedEvent.price ? `₹${selectedEvent.price}` : 'Free'}</p>
                </div>
                <button
                  onClick={() => { if (!getRegistrationStatus(selectedEvent._id)) handleRegisterClick(selectedEvent); }}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${getRegistrationStatus(selectedEvent._id) === 'approved' ? 'bg-green-500/20 text-green-500 cursor-default' :
                    getRegistrationStatus(selectedEvent._id) === 'rejected' ? 'bg-red-500/20 text-red-500 cursor-default' :
                      getRegistrationStatus(selectedEvent._id) === 'pending' ? 'bg-yellow-500/20 text-yellow-500 cursor-default' :
                        'bg-gradient-to-r from-pink-600 to-orange-600 text-white hover:scale-105 shadow-lg shadow-pink-500/20'
                    }`}
                >
                  {getRegistrationStatus(selectedEvent._id) === 'approved' ? 'Registration Approved' :
                    getRegistrationStatus(selectedEvent._id) === 'rejected' ? 'Registration Rejected' :
                      getRegistrationStatus(selectedEvent._id) === 'pending' ? 'Approval Pending' :
                        'Register Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
      }


      {
        showRegisterModal && registrationEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-md ${cardBg} p-8 rounded-2xl border border-white/10 shadow-2xl transform transition-all`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>Confirm Registration</h2>
              <p className={`mb-6 ${textSecondary}`}>
                You are about to register for <strong>{registrationEvent.title}</strong>.
              </p>

              <div className="space-y-4 mb-8">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Event Date</p>
                  <p className={`font-semibold ${textPrimary}`}>{new Date(registrationEvent.date).toLocaleDateString()}</p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Venue</p>
                  <p className={`font-semibold ${textPrimary}`}>{registrationEvent.location}</p>
                </div>
              </div>

              {registrationEvent.teamSizeMax > 1 && (
                <div className="mb-6">
                  <h3 className={`font-bold ${textPrimary} mb-2`}>Team Details</h3>
                  <p className={`text-sm ${textSecondary} mb-4`}>This event allows teams of {registrationEvent.teamSizeMin} to {registrationEvent.teamSizeMax} members (including you).</p>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Team Name</label>
                      <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                        className={`w-full p-3 rounded-xl border ${cardBg} ${textPrimary}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Add Team Members (Email or Name)</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          value={memberInput}
                          onChange={(e) => setMemberInput(e.target.value)}
                          placeholder="Member name or email"
                          className={`flex-1 p-3 rounded-xl border ${cardBg} ${textPrimary}`}
                        />
                        <button onClick={addTeamMember} type="button" className="px-4 py-2 bg-pink-600 text-white rounded-xl">Add</button>
                      </div>

                      <div className="space-y-2">
                        <div className={`flex justify-between items-center p-2 rounded-lg border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                          <span className={textPrimary}>{user.fullName} (You) - Leader</span>
                        </div>
                        {teamMembers.map((m, i) => (
                          <div key={i} className={`flex justify-between items-center p-2 rounded-lg border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <span className={textPrimary}>{m}</span>
                            <button onClick={() => removeTeamMember(i)} className="text-red-400 hover:text-red-500"><XCircle size={18} /></button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Current Total: {teamMembers.length + 1} / {registrationEvent.teamSizeMax}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setShowRegisterModal(false)} className={`flex-1 py-3 rounded-xl font-semibold border ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'} ${textPrimary}`}>
                  Cancel
                </button>
                <button onClick={handleConfirmRegistration} className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg hover:shadow-pink-500/25">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Ticket Modal */}
      {
        selectedTicket && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl relative"
            >
              <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full z-10 transition-colors">
                <X size={20} className="text-black" />
              </button>
              <div className="h-40 bg-gradient-to-br from-pink-600 to-orange-600 relative p-6 flex flex-col justify-end">
                <h3 className="text-white font-bold text-2xl leading-none">{selectedTicket.event?.title || "Event Details Unavailable"}</h3>
                <p className="text-white/80 text-sm mt-1">
                  {selectedTicket.event?.date ? new Date(selectedTicket.event.date).toLocaleDateString() : "Date N/A"} • {selectedTicket.event?.time || "Time N/A"}
                </p>
                <div className="absolute -bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Logo size={24} />
                </div>
              </div>
              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                  {selectedTicket.event ? (
                    <QRCodeSVG value={JSON.stringify({
                      id: selectedTicket._id,
                      event: selectedTicket.event.title,
                      user: user.fullName,
                      date: selectedTicket.event.date
                    })} size={160} />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center text-slate-400">
                      QR Unavailable
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">{user.fullName}</h4>
                <p className="text-slate-500 text-sm mb-4">{user.college}</p>
                <div className="w-full py-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-500 break-all">
                  ID: {selectedTicket._id}
                </div>
                <p className="text-xs text-slate-400 mt-6">Show this QR code at the event entrance.</p>
              </div>
              <div className="h-4 bg-gradient-to-r from-pink-500 to-orange-500"></div>
            </motion.div>
          </div>
        )
      }

      {/* Interest Profiler Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl ${darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white text-slate-900'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customize Your Interests</h2>
              <button onClick={() => setShowInterestModal(false)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                <X size={24} />
              </button>
            </div>

            <p className="mb-6 opacity-70">Select topics you are passionate about to get personalized event recommendations.</p>

            <div className="flex flex-wrap gap-3 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
              {[
                "Technology", "Coding", "Design", "Business", "Marketing", "Finance",
                "Public Speaking", "Leadership", "Music", "Dance", "Art", "Photography",
                "Sports", "Fitness", "Yoga", "Gaming", "Hackathon", "Robotics", "AI",
                "Science", "Literature", "Debate", "Social Service", "Environment"
              ].map(interest => (
                <button
                  key={interest}
                  onClick={() => {
                    const current = tempInterests;
                    if (current.includes(interest)) {
                      setTempInterests(current.filter(i => i !== interest));
                    } else {
                      setTempInterests([...current, interest]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${tempInterests.includes(interest)
                    ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-white border-transparent shadow-lg transform scale-105'
                    : darkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {interest}
                  {tempInterests.includes(interest) && <CheckCircle size={14} className="inline ml-2" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleUpdateInterests(tempInterests)}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-orange-600 text-white hover:shadow-lg rounded-xl font-bold transition-all"
            >
              Save Interests
            </button>
          </motion.div>
        </div>
      )}
    </div >
  );
}