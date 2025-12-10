import { Link } from "react-router-dom";
import { retrieveEvents } from "../utils/auth";
import "../styles/original.css";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function EventPage() {
  const [events,setEvents]=useState([]);
  const [msg,setMsg]=useState("");
  async function getEvents(){
   const res= await retrieveEvents();
      if (res.success) {
      setMsg({ type: "success", text: res.message || "" });
      return;
    }
}
 useEffect(() => {
    getEvents();
  }, []);

  return (
    <div>
      <Navbar />
      {/* Page Header */}
      <section className="page-header">
        <h1>Upcoming Events</h1>
        <p>Discover the best inter-college events happening around you. Sign up and make your mark.</p>
      </section>

      {/* Event Grid */}
      <div className="event-grid">

        <div className="event-card">
          <img className="event-card-img" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop" alt="Hackathon X" />
          <h3>Hackathon X</h3>
          <p>24-hour innovation marathon where brilliant minds collaborate to build cutting-edge solutions.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=400&fit=crop" alt="Sports Meet 2025" />
          <h3>Sports Meet 2025</h3>
          <p>Cricket, football, badminton, and athletics. Showcase your athletic prowess and compete for glory.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://picsum.photos/id/10/800/400" alt="National Cultural Fest" />
          <h3>National Cultural Fest</h3>
          <p>Dance, drama, music, and art performances. Celebrate diversity and express your creative spirit.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://picsum.photos/id/20/800/400" alt="Debate Championship" />
          <h3>Debate Championship</h3>
          <p>Battle of ideas across varied topics. Showcase communication skills and critical thinking abilities.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://picsum.photos/id/30/800/400" alt="AI & ML Workshop" />
          <h3>AI &amp; ML Workshop</h3>
          <p>Hands-on sessions on Python, machine learning models, and real-world AI applications.</p>
          <Link to="/login">View Details</Link>
        </div>

        <div className="event-card">
          <img className="event-card-img" src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=400&fit=crop" alt="Startup Pitch Battle" />
          <h3>Startup Pitch Battle</h3>
          <p>Present your innovative business idea to mentors and investors. Win funding and recognition.</p>
          <Link to="/login">View Details</Link>
        </div>

      </div>
    </div>
  );
}