import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/original.css";

export default function AdminCreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    college: "",
    location: "",
    date: "",
    time: "",
    mode: "",
    deadline: "",
    minTeamSize: "",
    maxTeamSize: "",
    maxParticipants: "",
    contactEmail: "",
    banner: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", formData);
    alert("Event created (UI only)");
    navigate("/admin-dashboard");
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
          <h1>Create Event</h1>
          <p>Fields marked * are mandatory</p>
        </div>

        <div className="admin-section">
          <form className="admin-event-form" onSubmit={handleSubmit}>

            {/* Basic Info */}
            <div className="form-group">
              <label>Event Title <span className="required">*</span></label>
              <input name="title" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select name="category" required onChange={handleChange}>
                <option value="">Select</option>
                <option>Tech</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Academic</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description <span className="required">*</span></label>
              <textarea name="description" required onChange={handleChange} />
            </div>

            {/* Event Details */}
            <div className="form-group">
              <label>Event Mode <span className="required">*</span></label>
              <select name="mode" required onChange={handleChange}>
                <option value="">Select</option>
                <option>Offline</option>
                <option>Online</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label>College</label>
              <input name="college" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Location <span className="required">*</span></label>
              <input name="location" required onChange={handleChange} />
            </div>

            {/* Date & Time */}
            <div className="date-time-group full-width">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input type="date" name="date" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Time <span className="required">*</span></label>
                <input type="time" name="time" required onChange={handleChange} />
              </div>
            </div>

            {/* Team Size */}
            <div className="form-group">
              <label>Min Team Size</label>
              <input
                type="number"
                name="minTeamSize"
                min="1"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Max Team Size</label>
              <input
                type="number"
                name="maxTeamSize"
                min="1"
                onChange={handleChange}
              />
            </div>

            {/* Max Participants */}
            <div className="form-group">
              <label>Max Participants <span className="required">*</span></label>
              <input
                type="number"
                name="maxParticipants"
                min="1"
                required
                onChange={handleChange}
              />
            </div>

            {/* Registration */}
            <div className="form-group">
              <label>Registration Deadline <span className="required">*</span></label>
              <input
                type="date"
                name="deadline"
                required
                onChange={handleChange}
              />
            </div>

            {/* Contact */}
            <div className="form-group full-width">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" onChange={handleChange} />
            </div>

            {/* Banner */}
            <div className="form-group full-width">
              <label>Event Banner Image</label>
              <input
                type="file"
                accept="image/*"
                name="banner"
                onChange={handleChange}
              />
              <small className="hint-text">
                Optional (JPG / PNG)
              </small>
            </div>

            <button className="form-button full-width">
              Create Event
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
