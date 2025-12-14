
import React, { useState } from "react";
import "../styles//RegistrationEvent.css";

function RegistrationEvent() {
  const [formData, setFormData] = useState({
    college_id: "",
    title: "",
    description: "",
    category: "",
    location: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      ...formData,
      created_at: new Date(),
    };

    console.log(eventData);
    alert("Event created successfully!");
  };

  return (
    <div className="page">
      <div className="form-card">
        <h2 className="form-heading">Create Event</h2>

        <form onSubmit={handleSubmit}>
          <label>College ID</label>
          <input
            type="text"
            name="college_id"
            placeholder="Enter college ID"
            onChange={handleChange}
          />

          <label>Event Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter event description"
            onChange={handleChange}
          />

          <label>Category</label>
          <select name="category" onChange={handleChange}>
            <option value="">Select category</option>
            <option>Sports</option>
            <option>Hackathon</option>
            <option>Cultural</option>
            <option>Workshop</option>
          </select>

          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            onChange={handleChange}
          />

          <label>Start Date</label>
          <input type="date" name="start_date" onChange={handleChange} />

          <label>End Date</label>
          <input type="date" name="end_date" onChange={handleChange} />

          <button type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationEvent;
