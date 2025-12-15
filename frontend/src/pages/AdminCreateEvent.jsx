import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser, protectPage } from "../utils/auth";
import "../styles/original.css";

export default function AdminCreateEvent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    college: "",
    category: "",
    genre: "",
    featured: false
  });

  useEffect(() => {
    const ok = protectPage();
    if (!ok) return;

    const cur = getCurrentUser();
    setUser(cur);

    if (cur && cur.userType !== "admin") {
      navigate("/student-dashboard");
    }
  }, [navigate]);

  if (!getCurrentUser()) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", formData);
    // API integration will be done next
  };

  return (
    <div className="admin-dashboard-page">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Navbar />

      <div className="admin-dashboard-wrapper">

        <div className="admin-header">
          <h1>Create New Event</h1>
          <p>Add and manage campus events</p>
        </div>

        <form className="admin-section" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Event Title</label>
            <input type="text" name="title" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" required onChange={handleChange}></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" required onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" required onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>College</label>
              <input type="text" name="college" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input type="text" name="genre" onChange={handleChange} />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="featured"
              onChange={handleChange}
            />
            <label>Mark as Featured Event</label>
          </div>

          <button className="primary-btn" type="submit">
            Create Event
          </button>

        </form>
      </div>
    </div>
  );
}
