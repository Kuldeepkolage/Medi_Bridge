import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AppointmentBooking from "./pages/AppointmentBooking";
import ContactPage from "./pages/ContactPage";
import AwarenessGuide from "./pages/AwarenessGuide";
import RatingFeedback from "./pages/RatingFeedback";
import Login from "./pages/Login";
import Register from "./pages/Register";

const isAuth = !!localStorage.getItem("token");

function PrivateRoute({ children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <header className="clinic-navbar">
        <div className="clinic-logo">
          <img src="https://img.icons8.com/doodle/60/tooth--v1.png" alt="tooth" />
          <span>MediBridge Dental Clinic</span>
        </div>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/appointment" className="nav-link">Appointment</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/awareness" className="nav-link">Awareness</Link>
          <Link to="/ratings" className="nav-link">Reviews</Link>
          <a href="tel:+919511936441" className="nav-link" style={{background:"#e53935"}}><span role="img" aria-label="Emergency"></span> Emergency</a>
          {isAuth ? (
            <button
              onClick={() => { localStorage.removeItem("token"); window.location = "/login"; }}
              className="nav-link"
              style={{background:"#e53935"}}
            >Logout</button>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/appointment" element={<PrivateRoute><AppointmentBooking /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
        <Route path="/awareness" element={<PrivateRoute><AwarenessGuide /></PrivateRoute>} />
        <Route path="/ratings" element={<PrivateRoute><RatingFeedback /></PrivateRoute>} />
      </Routes>
      <footer className="clinic-footer">
        &copy; {new Date().getFullYear()} MediBridge Dental Clinic
      </footer>
    </Router>
  );
}
