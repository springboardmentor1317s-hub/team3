import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css'; // navbar styles

const Navbar = () => {
  return (
    <nav>
      <div className="logo">CampusEventHub</div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/event">Events</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
