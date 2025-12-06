import React from "react";
import "../styles/original.css"; // create this file by copying the <style> block from your index.html

export default function Home() {
  return (
    <div>
      {/* Animated Background */}
      <div className="bg-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>

      {/* Navbar */}
      <nav>
        <div className="logo">CampusEventHub</div>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="event.html" style={{ color: "#a855f7" }}>Events</a></li>
          <li><a href="register.html">Register</a></li>
          <li><a href="login.html">Login</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1>Discover Amazing<br />Campus Events</h1>
        <p>Connect with peers, explore opportunities, and make unforgettable memories across your campus ecosystem.</p>
        <a href="event.html" className="btn">Browse Events</a>
      </section>

      {/* Event Cards */}
      <div className="event-section">
        <div className="event-card">
          <h3>Hackathons</h3>
          <p>24-hour innovation marathons where brilliant minds code solutions to real-world problems.</p>
          <a href="#">Learn More</a>
        </div>

        <div className="event-card">
          <h3>Sports Championships</h3>
          <p>High-energy competitions across cricket, football, and athletics. Showcase your talent.</p>
          <a href="#">Join Now</a>
        </div>

        <div className="event-card">
          <h3>Cultural Festivals</h3>
          <p>Celebrate creativity through music, dance, art, and theater. Your stage awaits.</p>
          <a href="#">Explore</a>
        </div>
      </div>
    </div>
  );
}
