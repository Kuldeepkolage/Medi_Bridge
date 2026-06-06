import React, { useState, useEffect, useRef } from "react";
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  const isAuth = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Public nav links — center section
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/appointment", label: "Appointment" },
    { to: "/awareness", label: "Awareness" },
    { to: "/ratings", label: "Reviews" },
    { to: "/contact", label: "Contact" },
  ];

  const activeLinkCls =
    "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400";
  const inactiveLinkCls =
    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800";

  const linkCls = (to) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
      location.pathname === to ? activeLinkCls : inactiveLinkCls
    }`;

  // User avatar initials
  const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  const SunIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  const MoonIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white dark:bg-gray-900 ${
        scrolled ? "shadow-sm border-b border-gray-100 dark:border-gray-800" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center h-[64px] gap-8">

          {/* ── LEFT: Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg style={{ width: 17, height: 17 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-[15px] text-gray-900 dark:text-white whitespace-nowrap tracking-tight">
              MediBridge <span className="text-blue-600">Dental</span>
            </span>
          </Link>

          {/* ── CENTER: Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={linkCls(to)}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── RIGHT: Controls ── */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0 ml-auto">

            {/* Language Switcher */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-[11px] font-bold">
              {["en", "hi", "mr"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-2.5 py-1.5 transition-colors ${
                    language === lang
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {lang === "en" ? "EN" : lang === "hi" ? "हि" : "म"}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Emergency Button */}
            <EmergencyButton />

            {/* Book Now */}
            <Link
              to="/appointment"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              Book Now
            </Link>

            {/* Profile Avatar / Login */}
            {isAuth ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className={`w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center ring-2 transition-all duration-150 ${
                    profileOpen
                      ? "ring-blue-400 ring-offset-1"
                      : "ring-transparent hover:ring-blue-300 hover:ring-offset-1"
                  }`}
                  aria-label="Open profile menu"
                >
                  {avatarLetter}
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-60 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                    style={{ animation: "dropdownIn 0.15s ease-out both" }}>
                    <style>{`
                      @keyframes dropdownIn {
                        from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                      }
                    `}</style>

                    {/* User Info Header */}
                    <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {avatarLetter}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/my-appointments"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        My Appointments
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 pt-3 pb-4 space-y-0.5 bg-white dark:bg-gray-900">

            {/* Public Links */}
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to ? activeLinkCls : inactiveLinkCls
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Divider + Account Section */}
            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">

              {isAuth ? (
                <>
                  {/* User info pill */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {avatarLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/my-appointments"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === "/my-appointments" ? activeLinkCls : inactiveLinkCls
                    }`}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Appointments
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith("/admin") ? activeLinkCls : inactiveLinkCls
                      }`}
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${inactiveLinkCls}`}
                >
                  Login
                </Link>
              )}

              {/* Controls row */}
              <div className="flex items-center gap-2 px-1 pt-2">
                {/* Language */}
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-[11px] font-bold flex-1">
                  {["en", "hi", "mr"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`flex-1 py-2 transition-colors ${
                        language === lang
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {lang === "en" ? "EN" : lang === "hi" ? "हि" : "म"}
                    </button>
                  ))}
                </div>

                {/* Theme */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>

              {/* Emergency */}
              <EmergencyButton className="w-full justify-center" />

              {/* Book Now */}
              <Link
                to="/appointment"
                className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center text-sm transition-colors shadow-sm"
              >
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
              <p>kolagekuldeep09@gmail.com</p>
              <p>Maulana Azad Road, Vasai West, Maharashtra 401201</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2025 MediBridge Dental Clinic. All rights reserved. <br />
        <span className="text-gray-400 text-sm">
         Developed by Kuldeep Kolage
        </span>
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
      {!splashDone && (
        <SplashScreen
          onDone={() => {
            localStorage.setItem("splashSeen", "true");
            setSplashDone(true);
          }}
        />
      )}
      <div style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.3s ease" }}>
        <Router>
          <Routes>
            {/* Auth — bare pages */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin — PrivateRoute only */}
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