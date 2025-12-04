import React from "react";
import { Link } from "react-router-dom";
import '../styles/register.css'
const Register = () => {
  return (
    <div className="page-content">
    <div className="overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full px-20 py-5 flex justify-between items-center backdrop-blur-xl bg-[#0f0720b3] border-b border-indigo-400/30 z-50">
        <h1 className="text-2xl font-bold font-[Syne] bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          CampusEventHub
        </h1>

        <ul className="flex gap-12">
          <li>
            <Link to="/" className="hover:text-white text-gray-300 text-sm font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" className="hover:text-white text-gray-300 text-sm font-medium">
              Events
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-purple-400 font-medium text-sm">
              Register
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-white text-gray-300 text-sm font-medium">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      {/* REGISTER CARD */}
      <div className="flex justify-center items-center min-h-screen px-4 pt-28">
        <div className="form-card">
          <h2 className="form-title">Join Us</h2>

          <form className="flex flex-col">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Your name" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@email.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>

            <button type="submit" className="form-button">
              Create Account
            </button>

            <p className="form-link">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-purple-400 font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
