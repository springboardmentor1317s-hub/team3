import React, { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const events = [
    {
      title: "Tech Hackathon 2025",
      description: "Join the ultimate coding challenge and innovate solutions for tomorrow.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
      date: "Jan 15-16, 2025",
      category: "Technology"
    },
    {
      title: "Sports Championship",
      description: "Compete in various sports and showcase your athletic prowess.",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=600&fit=crop",
      date: "Feb 20-22, 2025",
      category: "Sports"
    },
    {
      title: "Cultural Festival",
      description: "Celebrate diversity through music, dance, and art performances.",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=600&fit=crop",
      date: "Mar 10-12, 2025",
      category: "Culture"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-teal-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className={`relative z-10 max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-6 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
            <span className="text-emerald-300 text-sm font-semibold">✨ Welcome to Campus Events</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover & Connect with<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Amazing Campus Events
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Your gateway to unforgettable experiences, networking, and growth. Find, register, and thrive with thousands of students.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Browse Events
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-gray-400">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">Colleges</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Events Slider */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Events</h2>
            <p className="text-gray-400 text-lg">Handpicked events happening this season</p>
          </div>

          <div className="relative">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {events.map((event, index) => (
                  <div key={index} className="min-w-full px-2">
                    <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden group">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <span className="inline-block px-4 py-1 bg-emerald-500/80 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-4">
                          {event.category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{event.title}</h3>
                        <p className="text-gray-200 text-lg mb-4 max-w-2xl">{event.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-emerald-300 font-semibold">📅 {event.date}</span>
                          <button className="px-6 py-3 bg-white text-emerald-900 rounded-full font-semibold hover:bg-emerald-100 transition-colors">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
            >
              ←
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
            >
              →
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/10 group-hover:to-teal-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-2xl font-bold text-white mb-3">Hackathons</h3>
                <p className="text-gray-300 mb-6">24-hour innovation marathons where brilliant minds code solutions to real-world problems.</p>
                <button className="inline-flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                  Learn More <span>→</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-teal-600/0 group-hover:from-cyan-600/10 group-hover:to-teal-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Sports Championships</h3>
                <p className="text-gray-300 mb-6">High-energy competitions across cricket, football, and athletics. Showcase your talent.</p>
                <button className="inline-flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-3 transition-all">
                  Join Now <span>→</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-teal-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/0 to-emerald-600/0 group-hover:from-teal-600/10 group-hover:to-emerald-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold text-white mb-3">Cultural Festivals</h3>
                <p className="text-gray-300 mb-6">Celebrate creativity through music, dance, art, and theater. Your stage awaits.</p>
                <button className="inline-flex items-center gap-2 text-teal-400 font-semibold group-hover:gap-3 transition-all">
                  Explore <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-sm rounded-3xl p-12 border border-emerald-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 text-lg mb-8">Join thousands of students discovering amazing events every day</p>
            <button className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
              Create Your Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}