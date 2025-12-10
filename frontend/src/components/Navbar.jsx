import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/original.css'; // navbar styles

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">CampusEventHub</div>
      <ul className="navbar-nav">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>
            Events
          </Link>
        </li>
        <li>
          <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>
            Register
          </Link>
        </li>
        <li>
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
