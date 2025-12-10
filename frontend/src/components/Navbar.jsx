import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Add your search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img 
          src="/Logo.png" 
          alt="Campus Event Hub Logo" 
          className="navbar-logo-img"
        />
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-box"
          />
        </form>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;