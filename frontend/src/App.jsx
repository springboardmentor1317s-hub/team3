import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// other pages to add: Event, Login, Register, StudentDashboard, AdminDashboard

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={/* Event page component (to add) */} />
      {/* add other routes when converted */}
    </Routes>
  );
}
