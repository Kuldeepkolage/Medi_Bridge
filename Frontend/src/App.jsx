import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AppointmentBooking from "./pages/AppointmentBooking";
import ContactPage from "./pages/ContactPage";
import AwarenessGuide from "./pages/AwarenessGuide";
import RatingFeedback from "./pages/RatingFeedback";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminPatients from "./pages/admin/Patients";
import AdminReviews from "./pages/admin/Reviews";
import AdminEmergencies from "./pages/admin/Emergencies";
import MyAppointments from "./pages/MyAppointments";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
}

// Any logged-in user
function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" replace />;
}

// ✅ Only admin role
function AdminRoute({ children }) {
  const isAuth = !!localStorage.getItem("token");
  const user = getUser();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/not-authorized" replace />;
  return children;
}

// ── Not Authorized Page ───────────────────────────────────────────────────────
function NotAuthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-6">You don't have permission to view this page.</p>
        <Link to="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}

// ── Emergency Modal ───────────────────────────────────────────────────────────
function EmergencyModal({ onClose }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: form.name,
          phone: form.phone,
          description: "INSTANT EMERGENCY — Patient needs immediate attention.",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setTimeout(onClose, 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
        <div className="bg-red-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h2 className="text-white font-bold text-base">Emergency Request</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <a href="tel:+919511936441"
          className="flex items-center justify-between px-5 py-2.5 bg-red-50 border-b border-red-100 hover:bg-red-100 transition-colors">
          <span className="text-red-700 text-xs font-medium">Or call directly</span>
          <span className="text-red-700 font-bold text-sm">+91 9511936441</span>
        </a>
        <div className="px-5 py-5">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-700 font-semibold text-sm">Request sent! We'll contact you immediately.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-gray-500 text-xs">Our team will prioritize your request and contact you right away.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                <input name="name" value={form.name} required
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                <input name="phone" type="tel" value={form.phone} required
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
              {status === "error" && (
                <p className="text-red-600 text-xs">Failed to submit. Please call us directly.</p>
              )}
              <button type="submit" disabled={status === "loading"}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-sm rounded-lg transition-colors">
                {status === "loading" ? "Sending..." : "Request Emergency Help"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const location = useLocation();

  const isAuth = !!localStorage.getItem("token");
  const user = getUser();
  const isAdmin = user.role === "admin"; // ✅ only show Admin link for admins

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/appointment", label: "Appointment" },
    { to: "/contact", label: "Contact" },
    { to: "/awareness", label: "Awareness" },
    { to: "/ratings", label: "Reviews" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-gray-900">
                MediBridge <span className="text-blue-600">Dental</span>
              </span>
            </Link>

<div className="hidden lg:flex items-center gap-1">
  {navLinks.map(({ to, label }) => (
    <Link key={to} to={to}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        location.pathname === to
          ? "text-blue-600 bg-blue-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}>
      {label}
    </Link>
  ))}

  {/* ✅ Show "My Appointments" for any logged-in user */}
{isAuth && !isAdmin && (
  <Link to="/my-appointments"
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      location.pathname === "/my-appointments"
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`}>
    My Appointments
  </Link>
)}

  {/* ✅ Only show Admin link if role is admin */}
  {isAdmin && (
    <Link to="/admin/dashboard"
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        location.pathname.startsWith("/admin")
          ? "text-blue-600 bg-blue-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}>
      Admin
    </Link>
  )}
</div>

            <div className="hidden lg:flex items-center gap-2">
              {isAuth ? (
                <button onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
                  Logout
                </button>
              ) : (
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Login
                </Link>
              )}
              <button onClick={() => setShowEmergency(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Emergency
              </button>
              <Link to="/appointment"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap">
                Book Now
              </Link>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          

{isMenuOpen && (
  <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
    {navLinks.map(({ to, label }) => (
      <Link key={to} to={to} onClick={() => setIsMenuOpen(false)}
        className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
          location.pathname === to ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
        }`}>
        {label}
      </Link>
    ))}

    {/* ✅ Add this */}
{isAuth && !isAdmin && (
  <Link to="/my-appointments" onClick={() => setIsMenuOpen(false)}
    className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      location.pathname === "/my-appointments"
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:bg-gray-50"
    }`}>
    My Appointments
  </Link>
)}

    {isAdmin && (
      <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}
        className="block px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
        Admin
      </Link>
    )}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                {isAuth ? (
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Login
                  </Link>
                )}
                <button onClick={() => { setShowEmergency(true); setIsMenuOpen(false); }}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-center text-sm transition-colors duration-200">
                  Emergency
                </button>
                <Link to="/appointment" onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center text-sm transition-colors duration-200">
                  Book Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </>
  );
}

// Add this new route guard near your other guards at the top of App.jsx:
function UserOnlyRoute({ children }) {
  const isAuth = !!localStorage.getItem("token");
  const user = getUser();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
}



// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<AppointmentBooking />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/awareness" element={<AwarenessGuide />} />
          <Route path="/ratings" element={<RatingFeedback />} />
          <Route path="/my-appointments" element={<UserOnlyRoute><MyAppointments /></UserOnlyRoute>} />
          {/* ✅ All admin routes now use AdminRoute — blocks non-admins */}
          <Route path="/admin/dashboard"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
          <Route path="/admin/patients"     element={<AdminRoute><AdminPatients /></AdminRoute>} />
          <Route path="/admin/reviews"      element={<AdminRoute><AdminReviews /></AdminRoute>} />
          <Route path="/admin/emergencies"  element={<AdminRoute><AdminEmergencies /></AdminRoute>} />
        </Routes>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">MediBridge Dental</span>
              </Link>
              <p className="text-gray-400 text-sm mb-4 max-w-xs leading-relaxed">
                Premium dental care with advanced technology and expert professionals.
              </p>
              <a href="https://wa.me/919511936441"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                WhatsApp Us
              </a>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
                <li><Link to="/appointment" className="text-gray-400 hover:text-white text-sm transition-colors">Book Appointment</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link></li>
                <li><Link to="/awareness" className="text-gray-400 hover:text-white text-sm transition-colors">Awareness</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>General Checkup</li>
                <li>Implants</li>
                <li>Braces</li>
                <li>Whitening</li>
                <li>Root Canal</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4 text-white">Contact Info</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <p>+91 95119 36441</p>
                <p>info@medibridge.com</p>
                <p>Maulana Azad Road, Vasai West</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
            © 2024 MediBridge Dental Clinic. All rights reserved.
          </div>
        </div>
      </footer>
    </Router>
  );
}