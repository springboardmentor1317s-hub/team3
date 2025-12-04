import React from "react";
import { Link } from "react-router-dom";
import '../styles/event.css'
const Events = () => {
  return (
    <div className="page-content">
    <div className="overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full px-20 py-5 flex justify-between items-center backdrop-blur-xl bg-[#0f0720b3] border-b border-indigo-400/30 z-50">
        <h1 className="text-2xl font-bold font-[Syne] bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          CampusEventHub
        </h1>

        <ul className="flex gap-12">
          <li><Link to="/" className="hover:text-white text-gray-300 text-sm font-medium">Home</Link></li>
          <li><Link to="/events" className="text-purple-400 font-medium text-sm">Events</Link></li>
          <li><Link to="/register" className="hover:text-white text-gray-300 text-sm font-medium">Register</Link></li>
          <li><Link to="/login" className="hover:text-white text-gray-300 text-sm font-medium">Login</Link></li>
        </ul>
      </nav>

      {/* Events Section */}
      <section className="pt-32 pb-20 px-8 md:px-28">
        <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-[Syne]">
          Upcoming Events
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
          
          {/* Card 1 */}
          <div className="event-card">
            <div className="event-img bg-[url('/images/techfest.jpg')]"></div>
            <div className="event-content">
              <h3 className="event-title">Tech Fest 2025</h3>
              <p className="event-desc">
                A platform for innovators and tech enthusiasts to showcase futuristic ideas.
              </p>
              <button className="event-btn">Register Now</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="event-card">
            <div className="event-img bg-[url('/images/music-night.jpg')]"></div>
            <div className="event-content">
              <h3 className="event-title">Musical Night</h3>
              <p className="event-desc">
                A chill night filled with soulful performances from talented artists.
              </p>
              <button className="event-btn">Join Event</button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="event-card">
            <div className="event-img bg-[url('/images/workshop.jpg')]"></div>
            <div className="event-content">
              <h3 className="event-title">AI Workshop</h3>
              <p className="event-desc">
                Hands-on AI learning session with real-world project building.
              </p>
              <button className="event-btn">Enroll</button>
            </div>
          </div>

        </div>
      </section>
    </div>
    </div>
  );
};

export default Events;
