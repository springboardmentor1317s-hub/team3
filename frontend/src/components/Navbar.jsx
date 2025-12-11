import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSearch = (e) => {
    e.preventDefault();
    // Add your search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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
        {user ? (
          <>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
            <li>
              <div className="user-info-navbar">
                <Link to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}>
                  <div className="user-avatar-navbar">{user?.fullName?.charAt(0).toUpperCase() || 'U'}</div>
                  <span>{user?.fullName || 'User'}</span>
                </Link>
              </div>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;