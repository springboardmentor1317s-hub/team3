'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Bell, Search, Filter, Star, User, LogOut, Settings,
  Home, Ticket, Heart, CheckCircle, Clock, XCircle, MapPin,
  Users, TrendingUp, Eye, Download, X, ChevronLeft, ChevronRight,
  Moon, Sun
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("feed");
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [registrationEvent, setRegistrationEvent] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Team Registration State
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberInput, setMemberInput] = useState("");

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

        const eventsRes = await fetch("/api/admin/events");
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

  const handleRegisterClick = (event) => {
    if (!user) return alert("Please login first");
    if (event.registeredUsers?.includes(user._id)) return alert("Already registered!");

    setRegistrationEvent(event);
    setTeamName(""); // Reset
    setTeamMembers([]); // Reset
    setMemberInput(""); // Reset
    setShowRegisterModal(true);
  };

  const addTeamMember = () => {
    if (!memberInput.trim()) return;
    if (teamMembers.includes(memberInput.trim())) return alert("Member already added");
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
        // Optimistic UI update
        const updatedEvents = events.map(e => e._id === registrationEvent._id ?
          { ...e, registeredUsers: [...(e.registeredUsers || []), user._id], registeredCount: (e.registeredCount || 0) + 1 } : e
        );
        setEvents(updatedEvents);

        if (selectedEvent && selectedEvent._id === registrationEvent._id) {
          setSelectedEvent(prev => ({ ...prev, registeredUsers: [...(prev.registeredUsers || []), user._id] }));
        }

        alert("Registered successfully!");
        setShowRegisterModal(false);
        setRegistrationEvent(null);
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
      }
    } catch (e) {
      console.error("Registration failed", e);
      alert("Registration failed");
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
        alert("Profile updated successfully!");
        e.target.reset();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleToggleFavorite = async (eventId, e) => {
    e?.stopPropagation(); // Prevent opening modal if clicking heart
    if (!user || !user._id) return;

    // Optimistic UI Update
    const isFav = user.favorites?.includes(eventId);
    let newFavorites = user.favorites || [];
    if (isFav) {
      newFavorites = newFavorites.filter(id => id !== eventId);
    } else {
      newFavorites = [...newFavorites, eventId];
    }
    setUser({ ...user, favorites: newFavorites });

    try {
      const res = await fetch(`/api/users/${user._id}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, favorites: data.favorites });
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      // Revert on error could go here
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
  const registeredEvents = events.filter(ev => ev.registeredUsers?.includes(user?._id)).map(ev => ({
    ...ev,
    registeredDate: "Recently",
    status: 'approved'
  }));

  const upcomingEventsCount = registeredEvents.filter(ev => new Date(ev.date) > new Date()).length;
  const pastEventsCount = registeredEvents.filter(ev => new Date(ev.date) < new Date()).length;

  const notifications = registeredEvents.slice(0, 5).map((ev, i) => ({
    id: i,
    type: 'success',
    message: `Successfully registered for ${ev.title}`,
    time: 'Recently'
  }));

  const getCategoryColor = (category) => {
    const colors = {
      Hackathon: "bg-cyan-500",
      Cultural: "bg-purple-500",
      Sports: "bg-blue-500",
      Workshop: "bg-green-500",
      Music: "bg-pink-500",
      Arts: "bg-orange-500",
      Technology: "bg-indigo-500",
      Academic: "bg-yellow-500",
      Business: "bg-slate-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.college.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
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

  const bgClass = darkMode ? "bg-slate-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-white/10 backdrop-blur-xl border-white/20" : "bg-white border-gray-200";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const hoverBg = darkMode ? "hover:bg-white/10" : "hover:bg-gray-200";

  if (loading) return <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>Loading Campus Events...</div>;
  if (!user) return <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>Please log in to continue.</div>;

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className={`font-bold text-xl ${textPrimary}`}>Campus Events</h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className={`${textSecondary} hover:${textPrimary} transition-colors`}>Home</a>
            <a href="/event" className={`${textSecondary} hover:${textPrimary} transition-colors`}>Events</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className={`px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all hidden md:block`}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <aside className={`fixed left-0 top-0 h-full w-64 ${cardBg} border-r p-6 z-40 pt-20`}>
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${textPrimary}`}>CampusEventHub</h2>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setCurrentView("feed")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "feed" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} ${hoverBg}`}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setCurrentView("registered")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "registered" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} ${hoverBg}`}`}>
            <Ticket size={20} />
            <span>My Events</span>
          </button>
          <button onClick={() => setCurrentView("calendar")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "calendar" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} ${hoverBg}`}`}>
            <Calendar size={20} />
            <span>Calendar</span>
          </button>
          <button onClick={() => setCurrentView("favorites")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "favorites" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} ${hoverBg}`}`}>
            <Heart size={20} />
            <span>Favorites</span>
          </button>
          <button onClick={() => setCurrentView("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "settings" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} ${hoverBg}`}`}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${textSecondary} ${hoverBg}`}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="ml-64 min-h-screen pt-20">
        <header className={`sticky top-0 ${cardBg} border-b px-8 py-4 z-30 flex items-center justify-between`}>
          <div className="flex-1 max-w-2xl flex gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} size={20} />
              <input
                type="text"
                placeholder="Search events, colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 ${cardBg} border rounded-xl ${textPrimary} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div className="relative flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer font-bold shadow-sm ${darkMode ? 'bg-slate-800 border-slate-500 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
              >
                <option value="all">📊 All Status</option>
                <option value="active">🟢 Active</option>
                <option value="pending">⏳ Pending</option>
                <option value="completed">🏁 Completed</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10 cursor-pointer font-bold shadow-sm ${darkMode ? 'bg-slate-800 border-slate-500 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
              >
                <option value="all">📂 All Categories</option>
                {categories.filter(c => c.name !== 'all').map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.label}</option>
                ))}
              </select>
              <Filter className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} size={20} />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-6">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${cardBg} border rounded-xl hover:bg-white/10 transition-all`}>
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-purple-600" />}
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 ${cardBg} border rounded-xl hover:bg-white/10 transition-all relative`}>
                <Bell size={20} className={textPrimary} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${cardBg} border rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${textPrimary}`}>Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X size={18} className={textSecondary} />
                    </button>
                  </div>
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-3 rounded-xl ${cardBg} border mb-2`}>
                      <p className={`text-sm ${textPrimary}`}>{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${textPrimary}`}>{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.college}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {currentView === "feed" && (
            <>
              <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-sm rounded-3xl p-8 border border-emerald-500/30 mb-8">
                <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Welcome back, {user.fullName?.split(' ')[0]}! 👋</h1>
                <p className={textSecondary}>Here are the latest events happening across colleges!</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div
                  className={`${cardBg} border rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setCurrentView("registered")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Ticket size={24} className="text-emerald-400" />
                    </div>
                    <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimary}`}>{registeredEvents.length}</h3>
                  <p className={textSecondary}>Events Registered</p>
                  <p className="text-sm text-green-400 mt-2">Active participation</p>
                </div>

                <div
                  className={`${cardBg} border rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setCurrentView("calendar")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                      <Calendar size={24} className="text-teal-400" />
                    </div>
                    <Clock size={20} className="text-yellow-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimary}`}>{upcomingEventsCount}</h3>
                  <p className={textSecondary}>Upcoming Events</p>
                  <p className="text-sm text-yellow-400 mt-2">Don't miss out!</p>
                </div>

                <div
                  className={`${cardBg} border rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setCurrentView("registered")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-cyan-400" />
                    </div>
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimary}`}>{pastEventsCount}</h3>
                  <p className={textSecondary}>Events Attended</p>
                  <p className="text-sm text-emerald-400 mt-2">Keep learning</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <div key={event._id} className={`${cardBg} border rounded-2xl overflow-hidden hover:scale-105 transition-all cursor-pointer group`} onClick={() => setSelectedEvent(event)}>
                    <div className="relative h-48">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className={`absolute top-3 left-3 px-3 py-1 ${getCategoryColor(event.category)} rounded-full text-white text-xs font-semibold`}>
                        {event.category}
                      </div>
                      {event.trending && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                          <TrendingUp size={12} /> Trending
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>{event.title}</h3>
                      <p className={`text-sm ${textSecondary} mb-3`}>{event.college}</p>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                          <Calendar size={16} />
                          <span>{event.date}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Seats Filled</span>
                          <span>{event.registeredCount || 0}/{event.totalSeats}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600" style={{ width: `${((event.registeredCount || 0) / (event.totalSeats || 1)) * 100}%` }}></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }} className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!getRegistrationStatus(event._id)) handleRegisterClick(event);
                          }}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${getRegistrationStatus(event._id) === 'approved' ? 'bg-green-500/20 text-green-500 cursor-default' :
                            getRegistrationStatus(event._id) === 'rejected' ? 'bg-red-500/20 text-red-500 cursor-default' :
                              getRegistrationStatus(event._id) === 'pending' ? 'bg-yellow-500/20 text-yellow-500 cursor-default' :
                                'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 shadow-lg shadow-emerald-500/20'
                            }`}
                        >
                          {getRegistrationStatus(event._id) === 'approved' ? 'Approved' :
                            getRegistrationStatus(event._id) === 'rejected' ? 'Rejected' :
                              getRegistrationStatus(event._id) === 'pending' ? 'Pending' :
                                'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentView === "registered" && (
            <div>
              <h2 className={`text-2xl font-bold ${textPrimary} mb-6`}>My Registered Events</h2>
              <div className="space-y-4">
                {myRegistrations.map(reg => (
                  <div key={reg._id} className={`${cardBg} border rounded-2xl p-4 flex gap-4 items-center`}>
                    <img src={reg.event?.image} alt={reg.event?.title} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${textPrimary}`}>{reg.event?.title}</h3>
                      <p className={textSecondary}>{reg.event?.college}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${reg.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          reg.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                          {reg.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {myRegistrations.length === 0 && <p className={textSecondary}>You haven't registered for any events yet.</p>}
              </div>
            </div>
          )}

          {currentView === "calendar" && (
            <div className={`${cardBg} border rounded-2xl p-8`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-2xl font-bold ${textPrimary}`}>My Event Calendar</h2>
                <div className="flex items-center gap-4">
                  <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className={`p-2 rounded-xl border ${cardBg} hover:bg-white/10`}>
                    <ChevronLeft size={20} className={textSecondary} />
                  </button>
                  <span className={`text-lg font-bold ${textPrimary}`}>
                    {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className={`p-2 rounded-xl border ${cardBg} hover:bg-white/10`}>
                    <ChevronRight size={20} className={textSecondary} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={`font-bold ${textSecondary}`}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-24 opacity-50"></div>
                ))}

                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toISOString().split('T')[0];
                  // Find all events for this day
                  const dayEvents = myRegistrations.filter(r => r.event.date && r.event.date.startsWith(dateStr));
                  const hasEvent = dayEvents.length > 0;

                  return (
                    <div key={day} className={`h-24 border ${cardBg} rounded-xl p-2 relative group transition-all hover:scale-105 ${hasEvent ? 'border-emerald-500/50 bg-emerald-500/5 cursor-pointer' : ''}`}>
                      <div className={`font-bold ${hasEvent ? 'text-emerald-400' : textSecondary}`}>{day}</div>
                      {hasEvent && (
                        <div className="mt-2 space-y-1">
                          {dayEvents.map((reg, idx) => (
                            <div key={idx} className="text-xs px-2 py-1 bg-emerald-500 rounded text-white truncate" title={reg.event.title}>
                              {reg.event.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                            <Calendar size={16} className="text-emerald-500" />
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
            <div className="max-w-2xl">
              <h2 className={`text-2xl font-bold ${textPrimary} mb-6`}>Profile Settings</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Full Name</label>
                  <input name="fullName" defaultValue={user.fullName} className={`w-full p-3 rounded-xl border ${cardBg} ${textPrimary}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>College</label>
                  <input name="college" defaultValue={user.college} className={`w-full p-3 rounded-xl border ${cardBg} ${textPrimary}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>New Password</label>
                  <input name="password" type="password" placeholder="Leave blank to keep current" className={`w-full p-3 rounded-xl border ${cardBg} ${textPrimary}`} />
                </div>
                <button type="submit" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold">Update Profile</button>
              </form>

              {/* Role Switcher */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>Dashboard Access</h3>
                <p className={`${textSecondary} text-sm mb-4`}>Switch between Admin and Student dashboards</p>
                {user.availableRoles && user.availableRoles.length > 1 ? (
                  <button
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    onClick={() => {
                      if (user.role === 'admin') {
                        router.push('/student-dashboard');
                      } else {
                        router.push('/admin-dashboard');
                      }
                    }}
                  >
                    {user.role === 'admin' ? 'Switch to Student Dashboard' : 'Switch to Admin Dashboard'}
                  </button>
                ) : (
                  <p className={`${textSecondary} text-sm`}>
                    You only have access to the {user.role} dashboard. Contact an administrator to request additional access.
                  </p>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

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
                  <div className="flex items-center gap-3 mb-2 text-emerald-400">
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
                        'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 shadow-lg shadow-emerald-500/20'
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
      )}


      {showRegisterModal && registrationEvent && (
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
                      <button onClick={addTeamMember} type="button" className="px-4 py-2 bg-emerald-600 text-white rounded-xl">Add</button>
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
              <button onClick={handleConfirmRegistration} className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-emerald-500/25">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}