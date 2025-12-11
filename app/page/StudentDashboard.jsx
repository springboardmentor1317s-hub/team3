import React, { useState } from "react";
import { 
  Calendar, Bell, Search, Filter, Star, User, LogOut, Settings, 
  Home, Ticket, Heart, CheckCircle, Clock, XCircle, MapPin, 
  Users, TrendingUp, Eye, Download, X, ChevronLeft, ChevronRight,
  Moon, Sun
} from "lucide-react";

export default function StudentDashboard() {
  const [user] = useState({ name: "Srushti Sharma", email: "srushti@college.com", college: "MIT College" });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("feed"); // feed, calendar, registered
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const categories = [
    { name: "all", icon: "🎯", label: "All Events" },
    { name: "cultural", icon: "🎭", label: "Cultural", color: "purple" },
    { name: "sports", icon: "🏆", label: "Sports", color: "blue" },
    { name: "hackathon", icon: "💻", label: "Hackathon", color: "cyan" },
    { name: "workshop", icon: "🎤", label: "Workshop", color: "green" },
    { name: "music", icon: "🎶", label: "Music", color: "pink" },
    { name: "arts", icon: "🎨", label: "Arts", color: "orange" }
  ];

  const events = [
    {
      id: 1,
      title: "Hackathon X 2025",
      college: "IIT Bombay",
      date: "Dec 15-16, 2025",
      time: "9:00 AM",
      location: "Main Auditorium",
      category: "hackathon",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      seats: "30/50",
      trending: true,
      description: "24-hour coding marathon with amazing prizes"
    },
    {
      id: 2,
      title: "Cultural Fest 2025",
      college: "Delhi University",
      date: "Dec 20-22, 2025",
      time: "10:00 AM",
      location: "Open Ground",
      category: "cultural",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
      seats: "200/300",
      recommended: true,
      description: "Three days of music, dance, and celebration"
    },
    {
      id: 3,
      title: "Sports Championship",
      college: "MIT College",
      date: "Dec 18, 2025",
      time: "7:00 AM",
      location: "Sports Complex",
      category: "sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      seats: "150/200",
      description: "Inter-college sports competition"
    },
    {
      id: 4,
      title: "AI & ML Workshop",
      college: "NIT Trichy",
      date: "Dec 25, 2025",
      time: "2:00 PM",
      location: "Tech Block",
      category: "workshop",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      seats: "45/60",
      trending: true,
      description: "Learn cutting-edge AI techniques"
    }
  ];

  const registeredEvents = [
    { ...events[0], status: "approved", registeredDate: "Dec 1, 2025" },
    { ...events[1], status: "pending", registeredDate: "Dec 5, 2025" },
    { ...events[2], status: "approved", registeredDate: "Nov 28, 2025" }
  ];

  const notifications = [
    { id: 1, type: "success", message: "Registration approved for Hackathon X", time: "2 hours ago" },
    { id: 2, type: "info", message: "New event published: Tech Summit 2025", time: "5 hours ago" },
    { id: 3, type: "warning", message: "Event reminder: Cultural Fest tomorrow", time: "1 day ago" },
    { id: 4, type: "error", message: "Registration rejected for Debate Competition", time: "2 days ago" }
  ];

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

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 ${cardBg} border-r p-6 z-40`}>
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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${textSecondary} hover:bg-white/10`}>
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

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
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
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${cardBg} border rounded-xl hover:bg-white/10 transition-all`}>
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-purple-600" />}
            </button>

            {/* Notifications */}
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

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${textPrimary}`}>{user.name}</p>
                <p className="text-xs text-gray-500">{user.college}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {currentView === "feed" && (
            <>
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-sm rounded-3xl p-8 border border-emerald-500/30 mb-8">
                <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                <p className={textSecondary}>Here are the latest events happening across colleges!</p>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className={`${cardBg} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Ticket size={24} className="text-emerald-400" />
                    </div>
                    <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimary}`}>8</h3>
                  <p className={textSecondary}>Events Registered</p>
                  <p className="text-sm text-green-400 mt-2">+2 this month</p>
                </div>

                <div className={`${cardBg} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                      <Calendar size={24} className="text-teal-400" />
                    </div>
                    <Clock size={20} className="text-yellow-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimary}`}>3</h3>
                  <p className={textSecondary}>Upcoming Events</p>
                  <p className="text-sm text-yellow-400 mt-2">Next: Tomorrow</p>
                </div>

                <div className={`${cardBg} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-cyan-400" />
                    </div>
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimary}`}>12</h3>
                  <p className={textSecondary}>Events Attended</p>
                  <p className="text-sm text-emerald-400 mt-2">450 XP Earned</p>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      selectedCategory === cat.name
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                        : `${cardBg} border ${textSecondary} hover:scale-105`
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Events Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.id} className={`${cardBg} border rounded-2xl overflow-hidden hover:scale-105 transition-all cursor-pointer group`} onClick={() => setSelectedEvent(event)}>
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
                      {event.recommended && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                          <Star size={12} /> Recommended
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

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Seats Filled</span>
                          <span>{event.seats}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600" style={{width: `${(parseInt(event.seats.split('/')[0]) / parseInt(event.seats.split('/')[1])) * 100}%`}}></div>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:scale-105 transition-all">
                        Register Now
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
                  <div key={event.id} className={`${cardBg} border rounded-2xl p-6 flex items-center gap-6`}>
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
        </main>
      </div>

      {/* Event Details Modal */}
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
                    <p className="font-semibold">{selectedEvent.seats}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`font-bold ${textPrimary} mb-2`}>Description</h3>
                <p className={textSecondary}>{selectedEvent.description}</p>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-emerald-500/50">
                Register Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}