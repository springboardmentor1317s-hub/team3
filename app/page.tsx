"use client"
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-950">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-orange-600/20 backdrop-blur-2xl border-b border-white/10 shadow-lg">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF006E" />
                    <stop offset="50%" stopColor="#FF8500" />
                    <stop offset="100%" stopColor="#FFD60A" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
                <path d="M50 20 L65 40 L90 45 L70 65 L75 90 L50 75 L25 90 L30 65 L10 45 L35 40 Z" fill="white" opacity="0.9" />
                <circle cx="50" cy="52" r="12" fill="url(#logoGradient)" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-xl">CampusEventHub</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-white font-medium hover:text-pink-400 transition-colors">Home</button>
            <Link href="/event" className="text-gray-300 hover:text-white transition-colors">Events</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-5 py-2 text-white font-medium hover:bg-white/10 rounded-lg transition-all">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
        {/* Animated Background - Aurora Effect */}
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              borderRadius: ["20%", "50%", "20%"]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 blur-[100px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-pink-600/20 blur-[100px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-600/20 blur-[100px] rounded-full mix-blend-screen"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-gray-300 text-sm font-medium tracking-wide">Welcome to CampusEventHub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
          >
            Where Students<br />
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 opacity-20 blur-xl rounded-full"></span>
              <span className="relative bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent">
                Create Memories
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your gateway to unforgettable experiences. Find your tribe, register for events, and thrive with thousands of students across the campus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/event" className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden inline-block">
              <span className="relative z-10 flex items-center gap-2">
                Browse Events
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </span>
            </Link>
            <a href="#how-it-works" className="px-8 py-4 bg-white/5 text-white rounded-full font-bold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm cursor-pointer block">
              How it Works
            </a>
          </motion.div>


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
                        <span className="inline-block px-4 py-1 bg-pink-500/80 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-4">
                          {event.category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{event.title}</h3>
                        <p className="text-gray-200 text-lg mb-4 max-w-2xl">{event.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-pink-300 font-semibold">📅 {event.date}</span>
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
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-pink-500' : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950/50"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Your journey to amazing campus experiences starts here</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-pink-500/20">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Create Account</h3>
              <p className="text-gray-400 leading-relaxed">
                Sign up with your college credentials to unlock exclusive access to campus events. Set up your profile and let the networking begin.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-purple-500/20">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Discover Events</h3>
              <p className="text-gray-400 leading-relaxed">
                Browse through a curated list of hackathons, sports championships, and cultural fests. Filter by category to find your passion.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-orange-500/20">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Register & Participate</h3>
              <p className="text-gray-400 leading-relaxed">
                One-click registration for your favorite events. Form teams, track your schedule, and participate to win exciting prizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative bg-gradient-to-br from-pink-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-orange-600/0 group-hover:from-pink-600/10 group-hover:to-orange-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-2xl font-bold text-white mb-3">Hackathons</h3>
                <p className="text-gray-300 mb-6">24-hour innovation marathons where brilliant minds code solutions to real-world problems.</p>
                <button className="inline-flex items-center gap-2 text-pink-400 font-semibold group-hover:gap-3 transition-all">
                  Learn More <span>→</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-600/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-yellow-600/0 group-hover:from-orange-600/10 group-hover:to-yellow-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Sports Championships</h3>
                <p className="text-gray-300 mb-6">High-energy competitions across cricket, football, and athletics. Showcase your talent.</p>
                <button className="inline-flex items-center gap-2 text-orange-400 font-semibold group-hover:gap-3 transition-all">
                  Join Now <span>→</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold text-white mb-3">Cultural Festivals</h3>
                <p className="text-gray-300 mb-6">Celebrate creativity through music, dance, art, and theater. Your stage awaits.</p>
                <button className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-3 transition-all">
                  Explore <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="bg-gradient-to-r from-pink-600/30 to-orange-600/30 backdrop-blur-sm rounded-3xl p-12 border border-pink-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 text-lg mb-8">Join thousands of students discovering amazing events every day</p>
            <Link href="/register">
              <button className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300">
                Create Your Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}