'use client';

import { useState } from 'react';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import Event from './Event';

export default function PageRouter() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'admin':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'event':
        return <Event />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}
