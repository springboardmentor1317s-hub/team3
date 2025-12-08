import React from "react";
import { Link } from "react-router-dom";
import "../styles/original.css";

export default function Home() {
  return (
    <div className="home">
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

      {/* Hero */}
      <section className="hero">
        <h1>Discover Amazing<br />Campus Events</h1>
        <p>Connect with peers, explore opportunities, and make unforgettable memories across your campus ecosystem.</p>
        <Link to="/events" className="btn">Browse Events</Link>
      </section>

      {/* Event Cards */}
      <div className="event-section">
        <div className="event-card">
          <h3>Hackathons</h3>
          <p>24-hour innovation marathons where brilliant minds code solutions to real-world problems.</p>
          <Link to="/events">Learn More</Link>
        </div>

        <div className="event-card">
          <h3>Sports Championships</h3>
          <p>High-energy competitions across cricket, football, and athletics. Showcase your talent.</p>
          <Link to="/events">Join Now</Link>
        </div>

        <div className="event-card">
          <h3>Cultural Festivals</h3>
          <p>Celebrate creativity through music, dance, art, and theater. Your stage awaits.</p>
          <Link to="/events">Explore</Link>
        </div>
      </div>
    </div>
  );
}