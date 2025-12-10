import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/original.css";
import Navbar from "../components/Navbar";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const events = [
    {
      title: "Tech Hackathon 2025",
      description: "Join the ultimate coding challenge and innovate solutions for tomorrow.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      date: "Jan 15-16, 2025"
    },
    {
      title: "Sports Championship",
      description: "Compete in various sports and showcase your athletic prowess.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
      date: "Feb 20-22, 2025"
    },
    {
      title: "Cultural Festival",
      description: "Celebrate diversity through music, dance, and art performances.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
      date: "Mar 10-12, 2025"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <div className="home">
      
      <Navbar />
      {/* Hero */}
      <section className="hero">
        <h1>Discover Amazing<br />Campus Events</h1>
        <p>Connect with peers, explore opportunities, and make unforgettable memories across your campus ecosystem.</p>
        <Link to="/events" className="btn">Browse Events</Link>
      </section>

      {/* Event Slider */}
      <section className="event-slider">
        <h2>Featured Events</h2>
        <div className="slider-container">
          <button className="slider-btn prev" onClick={prevSlide}>&lt;</button>
          <div className="slider">
            <div className="slide" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {events.map((event, index) => (
                <div key={index} className="slide-item">
                  <img src={event.image} alt={event.title} />
                  <div className="slide-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <span className="event-date">{event.date}</span>
                    <Link to="/events" className="btn">Learn More</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="slider-btn next" onClick={nextSlide}>&gt;</button>
        </div>
        <div className="slider-dots">
          {events.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Event Cards */}
      <div className="event-section">
        <div className="event-card">
          <img className="event-card-img" src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop" alt="Hackathons" />
          <h3>Hackathons</h3>
          <p>24-hour innovation marathons where brilliant minds code solutions to real-world problems.</p>
          <Link to="/events">Learn More</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop" alt="Sports" />
          <h3>Sports Championships</h3>
          <p>High-energy competitions across cricket, football, and athletics. Showcase your talent.</p>
          <Link to="/events">Join Now</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop" alt="Cultural Festival" />
          <h3>Cultural Festivals</h3>
          <p>Celebrate creativity through music, dance, art, and theater. Your stage awaits.</p>
          <Link to="/events">Explore</Link>
        </div>
      </div>
    </div>
  );
}