import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import EmergencyButton from "./EmergencyButton";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Profile Avatar ───────────────────────────────────────────────────────────
function Avatar({ user }) {
  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-blue-100 dark:ring-blue-900 select-none">
      {initial}
    </div>
  );
}

// ─── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown({ user, isAdmin, onLogout, onClose }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in">
      {/* User info header */}
      <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        <Link
          to="/my-appointments"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="text-gray-400 dark:text-gray-500"><CalendarIcon /></span>
          My Appointments
        </Link>

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-gray-400 dark:text-gray-500"><GridIcon /></span>
            Admin Dashboard
            <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md">
              Admin
            </span>
          </Link>
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Language Switcher ────────────────────────────────────────────────────────
function LanguageSwitcher({ language, changeLanguage }) {
  const langs = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हि" },
    { code: "mr", label: "म" },
  ];
  return (
    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-xs font-semibold">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`px-2.5 py-1.5 transition-colors ${
            language === code
              ? "bg-blue-600 text-white"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef                    = useRef(null);
  const location                      = useLocation();

  // ── All original logic preserved exactly as-is ──
  const isAuth  = !!localStorage.getItem("token");
  const user    = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  const { theme, toggleTheme }         = useTheme();
  const { language, changeLanguage }   = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Public nav links — centred on desktop
  const navLinks = [
    { to: "/",            label: "Home" },
    { to: "/appointment", label: "Appointment" },
    { to: "/awareness",   label: "Awareness" },
    { to: "/ratings",     label: "Reviews" },
    { to: "/contact",     label: "Contact" },
  ];

  const linkCls = (to, exact = true) => {
    const active = exact
      ? location.pathname === to
      : location.pathname.startsWith(to);
    return `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      active
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    }`;
  };

  return (
    <>
      {/* Subtle fade-in animation style */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .animate-in { animation: dropIn 0.18s ease-out both; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200
          bg-white dark:bg-gray-950
          ${scrolled ? "shadow-sm border-b border-gray-100 dark:border-gray-800" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* ── Logo (far left) ── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <ShieldIcon />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                MediBridge <span className="text-blue-600">Dental</span>
              </span>
            </Link>

            {/* ── Desktop Center Nav ── */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={linkCls(to)}>
                  {label}
                  {/* Active underline dot */}
                  {location.pathname === to && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop Right Side ── */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0 ml-auto">

              {/* Language Switcher */}
              <LanguageSwitcher language={language} changeLanguage={changeLanguage} />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

              {/* Emergency Button */}
              <EmergencyButton />

              {/* Book Now */}
              <Link
                to="/appointment"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shadow-sm"
              >
                Book Now
              </Link>

              {/* Profile / Login */}
              {isAuth ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className={`flex items-center gap-1.5 p-1 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      profileOpen ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                    aria-label="Account menu"
                  >
                    <Avatar user={user} />
                    <span className="text-gray-400 dark:text-gray-500">
                      <ChevronDown />
                    </span>
                  </button>

                  {profileOpen && (
                    <ProfileDropdown
                      user={user}
                      isAdmin={isAdmin}
                      onLogout={handleLogout}
                      onClose={() => setProfileOpen(false)}
                    />
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 animate-in">

            {/* Public nav links */}
            <div className="px-3 pt-3 pb-2 space-y-0.5">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Account section */}
            <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-0.5">

              {isAuth ? (
                <>
                  {/* User info strip */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Avatar user={user} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/my-appointments"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-gray-400"><CalendarIcon /></span>
                    My Appointments
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-gray-400"><GridIcon /></span>
                      Admin Dashboard
                      <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md">
                        Admin
                      </span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogoutIcon />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Bottom actions */}
            <div className="px-3 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              {/* Language + Theme row */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <LanguageSwitcher language={language} changeLanguage={changeLanguage} />
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>

              {/* Emergency + Book Now */}
              <EmergencyButton className="w-full justify-center" />
              <Link
                to="/appointment"
                onClick={() => setMenuOpen(false)}
                className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center text-sm transition-colors shadow-sm"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;