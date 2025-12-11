import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, ArrowRight, Filter, Search } from "lucide-react";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const eventsList = [
    {
      id: 1,
      title: "Hackathon X",
      description: "24-hour innovation marathon where brilliant minds collaborate to build cutting-edge solutions.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
      date: "Jan 15-16, 2025",
      location: "Tech Hub, Mumbai",
      category: "Technology",
      participants: "500+",
      color: "purple"
    },
    {
      id: 2,
      title: "Sports Meet 2025",
      description: "Cricket, football, badminton, and athletics. Showcase your athletic prowess and compete for glory.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
      date: "Feb 20-22, 2025",
      location: "Sports Complex, Delhi",
      category: "Sports",
      participants: "1000+",
      color: "blue"
    },
    {
      id: 3,
      title: "National Cultural Fest",
      description: "Dance, drama, music, and art performances. Celebrate diversity and express your creative spirit.",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop",
      date: "Mar 10-12, 2025",
      location: "Cultural Center, Bangalore",
      category: "Culture",
      participants: "750+",
      color: "pink"
    },
    {
      id: 4,
      title: "Debate Championship",
      description: "Battle of ideas across varied topics. Showcase communication skills and critical thinking abilities.",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
      date: "Mar 25, 2025",
      location: "Convention Hall, Pune",
      category: "Academic",
      participants: "200+",
      color: "indigo"
    },
    {
      id: 5,
      title: "AI & ML Workshop",
      description: "Hands-on sessions on Python, machine learning models, and real-world AI applications.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      date: "Apr 5-6, 2025",
      location: "Innovation Lab, Hyderabad",
      category: "Technology",
      participants: "300+",
      color: "purple"
    },
    {
      id: 6,
      title: "Startup Pitch Battle",
      description: "Present your innovative business idea to mentors and investors. Win funding and recognition.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
      date: "Apr 18, 2025",
      location: "Startup Hub, Bangalore",
      category: "Business",
      participants: "150+",
      color: "orange"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(eventsList);
      setIsLoading(false);
    }, 800);
  }, []);

  const categories = ["all", "Technology", "Sports", "Culture", "Academic", "Business"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getColorClasses = (color) => {
    const colors = {
      purple: "from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:border-purple-500/60",
      blue: "from-blue-600/20 to-cyan-600/20 border-blue-500/30 hover:border-blue-500/60",
      pink: "from-pink-600/20 to-rose-600/20 border-pink-500/30 hover:border-pink-500/60",
      indigo: "from-indigo-600/20 to-purple-600/20 border-indigo-500/30 hover:border-indigo-500/60",
      orange: "from-orange-600/20 to-amber-600/20 border-orange-500/30 hover:border-orange-500/60"
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎓</span>
                Campus Events
              </div>
              <div className="hidden md:flex gap-4">
                <a href="/" className="text-gray-300 hover:text-white transition-colors px-3 py-2">
                  Home
                </a>
                <a href="/events" className="text-white font-semibold px-3 py-2 bg-white/10 rounded-lg">
                  All Events
                </a>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors px-3 py-2">
                  Dashboard
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all">
                Login
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:scale-105 transition-all">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl top-0 right-0 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
            <span className="text-emerald-300 text-sm font-semibold">🎉 Discover Amazing Events</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Upcoming Events
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the best inter-college events happening around you. Sign up and make your mark.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`group relative bg-gradient-to-br ${getColorClasses(event.color)} backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 overflow-hidden`}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
                      {event.category}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Meta */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Users size={16} />
                        <span>{event.participants} Participants</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      View Details
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}