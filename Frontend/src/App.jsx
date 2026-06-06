import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import AppointmentBooking from "./pages/AppointmentBooking";
import ContactPage from "./pages/ContactPage";
import AwarenessGuide from "./pages/AwarenessGuide";
import RatingFeedback from "./pages/RatingFeedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAppointments from "./pages/MyAppointments";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminPatients from "./pages/admin/Patients";
import AdminReviews from "./pages/admin/Reviews";
import AdminEmergencies from "./pages/admin/Emergencies";

import EmergencyButton from "./components/EmergencyButton";
import { useTheme } from "./context/ThemeContext";
import { useLanguage } from "./context/LanguageContext";

// ─── Route guard ──────────────────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" replace />;
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2200);
    const t2 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes splashPop {
          0%   { opacity:0; transform: scale(0.4) translateY(24px); }
          65%  { transform: scale(1.08) translateY(-6px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes splashFadeUp {
          from { opacity:0; transform: translateY(18px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .splash-icon  { animation: splashPop    0.65s cubic-bezier(.22,1,.36,1) both; }
        .splash-brand { animation: splashFadeUp 0.5s ease-out 0.5s both; }
        .splash-dots  { animation: splashFadeUp 0.5s ease-out 0.8s both; }
      `}</style>
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950"
        style={{ transition: "opacity 0.45s ease", opacity: fadeOut ? 0 : 1, pointerEvents: fadeOut ? "none" : "all" }}
      >
        <div className="relative splash-icon mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 20px 60px rgba(37,99,235,0.45)" }}>
            <svg style={{ width: 52, height: 52 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-blue-400 opacity-20 animate-ping" style={{ animationDuration: "1.4s" }} />
        </div>
        <div className="splash-brand text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">MediBridge <span className="text-blue-600">Dental</span></h1>
          <p className="text-gray-400 text-sm mt-2 font-medium tracking-widest uppercase">Your Smile, Our Priority</p>
        </div>
        <div className="splash-dots flex items-center gap-1.5 mt-8">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAuth = !!localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  // Read role — Admin link only shown to admin role
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const isAdmin = storedUser?.role === "admin";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/appointment", label: "Appointment" },
    { to: "/contact", label: "Contact" },
    { to: "/awareness", label: "Awareness" },
    { to: "/ratings", label: "Reviews" },
  ];

  const linkCls = (to) =>
    `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
      location.pathname === to
        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const SunIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  const MoonIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white dark:bg-gray-900 ${scrolled ? "shadow-sm border-b border-gray-100 dark:border-gray-800" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center h-16 gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg style={{ width: 18, height: 18 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-base text-gray-900 dark:text-white whitespace-nowrap">
              MediBridge <span className="text-blue-600">Dental</span>
            </span>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className={linkCls(to)}>{label}</Link>
            ))}
            {isAuth && (
              <Link to="/my-appointments" className={linkCls("/my-appointments")}>
                My Appointments
              </Link>
            )}
            {isAuth && isAdmin && (
              <Link to="/admin/dashboard" className={linkCls("/admin/dashboard")}>
                Admin
              </Link>
            )}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0 ml-auto">

            {/* Language */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-xs font-semibold">
              {["en","hi","mr"].map((lang) => (
                <button key={lang} onClick={() => changeLanguage(lang)}
                  className={`px-2 py-1.5 transition-colors ${
                    language === lang
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>
                  {lang === "en" ? "EN" : lang === "hi" ? "हि" : "म"}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Login / Logout */}
            {isAuth ? (
              <button onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors whitespace-nowrap">
                Logout
              </button>
            ) : (
              <Link to="/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 transition-colors whitespace-nowrap">
                Login
              </Link>
            )}

            {/* Emergency */}
            <EmergencyButton />

            {/* Book Now */}
            <Link to="/appointment"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen((p) => !p)}
            className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 py-3 space-y-0.5 bg-white dark:bg-gray-900">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className={`block ${linkCls(to)}`}>{label}</Link>
            ))}
            {isAuth && (
              <Link to="/my-appointments" className={`block ${linkCls("/my-appointments")}`}>
                My Appointments
              </Link>
            )}
            {isAuth && isAdmin && (
              <Link to="/admin/dashboard" className={`block ${linkCls("/admin/dashboard")}`}>
                Admin
              </Link>
            )}
            <div className="pt-2 mt-1 border-t border-gray-100 dark:border-gray-800 space-y-2 px-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-xs font-semibold flex-1">
                  {["en","hi","mr"].map((lang) => (
                    <button key={lang} onClick={() => changeLanguage(lang)}
                      className={`flex-1 py-2 transition-colors ${
                        language === lang
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}>
                      {lang === "en" ? "EN" : lang === "hi" ? "हि" : "म"}
                    </button>
                  ))}
                </div>
                <button onClick={toggleTheme}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>
              {isAuth ? (
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Login
                </Link>
              )}
              <EmergencyButton className="w-full justify-center" />
              <Link to="/appointment"
                className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center text-sm transition-colors">
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg style={{ width: 20, height: 20 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-xl">MediBridge Dental</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Premium dental care with advanced technology and expert professionals.</p>
            <a href="https://wa.me/919511936441"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
              WhatsApp Us
            </a>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[["Home","/"],["Book Appointment","/appointment"],["Contact","/contact"],["Awareness","/awareness"],["Reviews","/ratings"]].map(([l,t]) => (
                <li key={t}><Link to={t} className="text-gray-400 hover:text-white text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {["General Checkup","Dental Implants","Braces & Aligners","Teeth Whitening","Root Canal","Emergency Care"].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p>+91 95119 36441</p>
              <p>info@medibridge.com</p>
              <p>Maulana Azad Road, Vasai West, Maharashtra 401201</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          © 2024 MediBridge Dental Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Public layout wrapper ────────────────────────────────────────────────────
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [splashDone, setSplashDone] = useState(
  localStorage.getItem("splashSeen") === "true"
);

  return (
    <>
      {!splashDone && <SplashScreen
  onDone={() => {
    localStorage.setItem("splashSeen", "true");
    setSplashDone(true);
  }}
/>}
      <div style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.3s ease" }}>
        <Router>
          <Routes>
            {/* Auth — bare pages */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin — PrivateRoute only (no role check needed for now) */}
            <Route path="/admin/dashboard"    element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/appointments" element={<PrivateRoute><AdminAppointments /></PrivateRoute>} />
            <Route path="/admin/patients"     element={<PrivateRoute><AdminPatients /></PrivateRoute>} />
            <Route path="/admin/reviews"      element={<PrivateRoute><AdminReviews /></PrivateRoute>} />
            <Route path="/admin/emergencies"  element={<PrivateRoute><AdminEmergencies /></PrivateRoute>} />

            {/* Public pages with Navbar + Footer */}
            <Route path="/"               element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/appointment"    element={<PublicLayout><AppointmentBooking /></PublicLayout>} />
            <Route path="/contact"        element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/awareness"      element={<PublicLayout><AwarenessGuide /></PublicLayout>} />
            <Route path="/ratings"        element={<PublicLayout><RatingFeedback /></PublicLayout>} />
            <Route path="/my-appointments" element={<PrivateRoute><PublicLayout><MyAppointments /></PublicLayout></PrivateRoute>} />
          </Routes>
        </Router>
      </div>
    </>
  );
}