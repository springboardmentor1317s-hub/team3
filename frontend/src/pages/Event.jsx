import React from "react";
import { Link } from "react-router-dom";
import "../styles/original.css";

export default function EventPage() {
  return (
    <div>
      {/* Animated Background */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navbar */}
      <nav>
        <div className="logo">CampusEventHub</div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <h1>Upcoming Events</h1>
        <p>Discover the best inter-college events happening around you. Sign up and make your mark.</p>
      </section>

      {/* Event Grid */}
      <div className="event-grid">

        <div className="event-card">
          <h3>Hackathon X</h3>
          <p>24-hour innovation marathon where brilliant minds collaborate to build cutting-edge solutions.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <h3>Sports Meet 2025</h3>
          <p>Cricket, football, badminton, and athletics. Showcase your athletic prowess and compete for glory.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <h3>National Cultural Fest</h3>
          <p>Dance, drama, music, and art performances. Celebrate diversity and express your creative spirit.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <h3>Debate Championship</h3>
          <p>Battle of ideas across varied topics. Showcase communication skills and critical thinking abilities.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <h3>AI &amp; ML Workshop</h3>
          <p>Hands-on sessions on Python, machine learning models, and real-world AI applications.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <h3>Startup Pitch Battle</h3>
          <p>Present your innovative business idea to mentors and investors. Win funding and recognition.</p>
          <Link to="/login">View Details</Link>
        </div>

      </div>
    </div>
  );
}