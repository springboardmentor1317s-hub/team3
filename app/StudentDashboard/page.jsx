'use client';

import React, { useState } from "react";
import {
  Calendar, Bell, Search, Filter, Star, User, LogOut, Settings,
  Home, Ticket, Heart, CheckCircle, Clock, XCircle, MapPin,
  Users, TrendingUp, Eye, Download, X, ChevronLeft, ChevronRight,
  Moon, Sun
} from "lucide-react";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("feed");
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, eventsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/events')
        ]);

        if (usersRes.ok) {
          const data = await usersRes.json();
          // Simulate login with first user, or specific one
          const foundUser = data.users?.[0] || { name: "Guest Student", email: "guest@college.com", college: "Guest College", _id: "guest" };
          setUser(foundUser);
        }

        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (eventId) => {
    if (!user || !user._id) return alert("Please login first");

    // Optimistic update
    const updatedEvents = events.map(e => {
      if (e._id === eventId) {
        // Check if already registered
        if (e.registeredUsers && e.registeredUsers.includes(user._id)) {
          return e;
        }
        return { ...e, registeredUsers: [...(e.registeredUsers || []), user._id], registeredCount: (e.registeredCount || 0) + 1 };
      }
      return e;
    });
    setEvents(updatedEvents);
    if (selectedEvent && selectedEvent._id === eventId) {
      setSelectedEvent(prev => ({ ...prev, registeredUsers: [...(prev.registeredUsers || []), user._id], registeredCount: (prev.registeredCount || 0) + 1 }));
    }

    try {
      // In a real app we'd have a specific register endpoint. 
      // Reuse edit endpoint to add user to array (requires backend to handle $addToSet or we send whole array)
      // For this demo, we'll try to just update the count/local state logic mostly, 
      // but to persist we need to send the new registeredUsers array.

      const eventToUpdate = events.find(e => e._id === eventId);
      const newRegisteredUsers = [...(eventToUpdate.registeredUsers || []), user._id];
      // dedupe
      const uniqueUsers = [...new Set(newRegisteredUsers)];

      await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registeredUsers: uniqueUsers,
          registeredCount: uniqueUsers.length
        })
      });
      alert("Registered successfully!");
    } catch (e) {
      console.error("Registration failed", e);
      // Revert if needed
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


  const categories = [
    { name: "all", icon: "🎯", label: "All Events" },
    { name: "cultural", icon: "🎭", label: "Cultural", color: "purple" },
    { name: "sports", icon: "🏆", label: "Sports", color: "blue" },
    { name: "hackathon", icon: "💻", label: "Hackathon", color: "cyan" },
    { name: "workshop", icon: "🎤", label: "Workshop", color: "green" },
    { name: "music", icon: "🎶", label: "Music", color: "pink" },
    { name: "arts", icon: "🎨", label: "Arts", color: "orange" }
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
      hackathon: "bg-cyan-500",
      cultural: "bg-purple-500",
      sports: "bg-blue-500",
      workshop: "bg-green-500",
      music: "bg-pink-500",
      arts: "bg-orange-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-green-500/20 text-green-300 border-green-500/50",
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      rejected: "bg-red-500/20 text-red-300 border-red-500/50"
    };
    return colors[status] || "";
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.college.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bgClass = darkMode ? "bg-slate-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-white/10 backdrop-blur-xl border-white/20" : "bg-white border-gray-200";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";

  if (loading) return <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>Loading Campus Events...</div>;
  if (!user) return <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>Please log in to continue.</div>;

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className={`font-bold text-xl ${textPrimary}`}>Campus Events</h1>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/Event" className="text-gray-300 hover:text-white transition-colors">Events</a>
            <a href="/Home" className="text-gray-300 hover:text-white transition-colors">Explore</a>
            <a href="/StudentDashboard" className="text-white font-semibold">Dashboard</a>
            <a href="/AdminDashboard" className="text-gray-300 hover:text-white transition-colors">Admin</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/Login" className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <aside className={`fixed left-0 top-0 h-full w-64 ${cardBg} border-r p-6 z-40 pt-20`}>
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${textPrimary}`}>CampusEventHub</h2>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setCurrentView("feed")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "feed" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} hover:bg-white/10`}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setCurrentView("registered")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "registered" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} hover:bg-white/10`}`}>
            <Ticket size={20} />
            <span>My Events</span>
          </button>
          <button onClick={() => setCurrentView("calendar")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "calendar" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} hover:bg-white/10`}`}>
            <Calendar size={20} />
            <span>Calendar</span>
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${textSecondary} hover:bg-white/10`}>
            <Heart size={20} />
            <span>Favorites</span>
          </button>
          <button onClick={() => setCurrentView("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "settings" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : `${textSecondary} hover:bg-white/10`}`}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${textSecondary} hover:bg-white/10`}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="ml-64 min-h-screen">
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
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 ${cardBg} border rounded-xl ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10 cursor-pointer`}
              >
                <option value="all">All Categories</option>
                <option value="cultural">🎭 Cultural</option>
                <option value="sports">🏆 Sports</option>
                <option value="hackathon">💻 Hackathon</option>
                <option value="workshop">🎤 Workshop</option>
                <option value="music">🎶 Music</option>
                <option value="arts">🎨 Arts</option>
              </select>
              <Filter className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSecondary} pointer-events-none`} size={20} />
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
                <div className={`${cardBg} border rounded-2xl p-6`}>
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

                <div className={`${cardBg} border rounded-2xl p-6`}>
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

                <div className={`${cardBg} border rounded-2xl p-6`}>
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

                      <button onClick={(e) => { e.stopPropagation(); handleRegister(event._id); }} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:scale-105 transition-all">
                        {event.registeredUsers?.includes(user._id) ? "Registered" : "Register Now"}
                      </button>
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
                {registeredEvents.map(event => (
                  <div key={event._id} className={`${cardBg} border rounded-2xl p-6 flex items-center gap-6`}>
                    <img src={event.image} alt={event.title} className="w-32 h-32 object-cover rounded-xl" />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`text-xl font-bold ${textPrimary}`}>{event.title}</h3>
                          <p className={`text-sm ${textSecondary}`}>{event.college}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>

                      <div className={`grid grid-cols-2 gap-4 text-sm ${textSecondary} mb-4`}>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Event: {event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>Registered: {event.registeredDate}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {event.status === "approved" && (
                          <button className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg font-semibold hover:bg-green-500/30 transition-all flex items-center gap-2">
                            <Download size={16} />
                            Download Ticket
                          </button>
                        )}
                        <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2">
                          <XCircle size={16} />
                          Cancel Registration
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === "calendar" && (
            <div>
              <div className={`${cardBg} border rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${textPrimary}`}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className={`p-2 ${cardBg} border rounded-lg hover:bg-white/10`}>
                      <ChevronLeft size={20} className={textPrimary} />
                    </button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className={`p-2 ${cardBg} border rounded-lg hover:bg-white/10`}>
                      <ChevronRight size={20} className={textPrimary} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={`text-center font-semibold ${textSecondary} p-3`}>
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className={`aspect-square ${cardBg} border rounded-lg p-2 hover:bg-white/10 cursor-pointer transition-all ${i % 7 === 15 || i % 7 === 20 ? 'ring-2 ring-purple-500' : ''}`}>
                      <div className={`text-sm ${textPrimary}`}>{(i % 28) + 1}</div>
                      {(i % 7 === 15 || i % 7 === 20) && (
                        <div className="mt-1">
                          <div className="w-full h-1 bg-purple-500 rounded-full mb-1"></div>
                          <div className="text-xs text-emerald-400">2 events</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === "settings" && (
            <div className="max-w-2xl mx-auto">
              <h2 className={`text-2xl font-bold ${textPrimary} mb-6`}>Account Settings</h2>
              <div className={`${cardBg} border rounded-2xl p-8`}>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Full Name</label>
                    <input name="fullName" defaultValue={user.fullName} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-emerald-500 outline-none`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>College</label>
                    <input name="college" defaultValue={user.college} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-emerald-500 outline-none`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>New Password</label>
                    <input name="password" type="password" placeholder="Leave blank to keep current" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-emerald-500 outline-none`} />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className={`${cardBg} border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                <X size={20} className="text-white" />
              </button>
              <div className={`absolute bottom-4 left-4 px-3 py-1 ${getCategoryColor(selectedEvent.category)} rounded-full text-white text-sm font-semibold`}>
                {selectedEvent.category}
              </div>
            </div>

            <div className="p-6">
              <h2 className={`text-3xl font-bold ${textPrimary} mb-2`}>{selectedEvent.title}</h2>
              <p className={`text-lg ${textSecondary} mb-6`}>{selectedEvent.college}</p>

              <div className={`grid grid-cols-2 gap-4 mb-6 ${textSecondary}`}>
                <div className="flex items-center gap-3">
                  <Calendar size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold">{selectedEvent.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-semibold">{selectedEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold">{selectedEvent.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Seats</p>
                    <p className="font-semibold">{selectedEvent.registeredCount || 0}/{selectedEvent.totalSeats}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`font-bold ${textPrimary} mb-2`}>Description</h3>
                <p className={textSecondary}>{selectedEvent.description}</p>
              </div>

              <button onClick={() => handleRegister(selectedEvent._id)} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-emerald-500/50">
                {selectedEvent.registeredUsers?.includes(user._id) ? "Already Registered" : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
