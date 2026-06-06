import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// ── Theme Context ─────────────────────────────────────────────────────────────
const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

const menuItems = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: "/admin/appointments",
    label: "Appointments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: "/admin/patients",
    label: "Patients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    path: "/admin/reviews",
    label: "Reviews",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    path: "/admin/emergencies",
    label: "Emergencies",
    badge: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

// ── Sun / Moon icons ──────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

// ── Theme Toggle Button ───────────────────────────────────────────────────────
function ThemeToggle({ dark, toggle, compact = false }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`
        relative flex items-center gap-2 rounded-xl border font-semibold text-xs
        transition-all duration-200 select-none
        ${compact
          ? "px-2.5 py-2"
          : "px-3 py-2 w-full"
        }
        ${dark
          ? "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
          : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
        }
      `}
    >
      {/* Track */}
      <div className={`
        relative w-8 h-4 rounded-full transition-colors duration-300 flex-shrink-0
        ${dark ? "bg-blue-600" : "bg-gray-300"}
      `}>
        <div className={`
          absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-300
          ${dark ? "translate-x-4" : "translate-x-0.5"}
        `} />
      </div>
      {!compact && (
        <span className="flex items-center gap-1.5">
          {dark ? <MoonIcon /> : <SunIcon />}
          {dark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mb-theme") === "dark" ||
        (!localStorage.getItem("mb-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  // Apply / remove .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("mb-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("mb-theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => setDark(d => !d);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ── Sidebar inner ─────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className={`
      flex flex-col h-full
      transition-colors duration-300
      ${dark
        ? "bg-[#0f1623] border-r border-white/5"
        : "bg-white border-r border-gray-100"
      }
    `}>

      {/* ── Brand ── */}
      <div className={`px-5 py-5 ${dark ? "border-b border-white/5" : "border-b border-gray-100"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.45)" }}>
            <svg style={{ width: 20, height: 20 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className={`font-bold text-sm leading-tight ${dark ? "text-white" : "text-gray-900"}`}>MediBridge</p>
            <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className={`px-3 mb-3 text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-gray-400"}`}>
          Menu
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? "bg-blue-600 text-white"
                  : dark
                    ? "text-slate-400 hover:text-white hover:bg-white/8"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
              style={isActive ? { boxShadow: "0 4px 14px rgba(37,99,235,0.35)" } : {}}
            >
              <span className={`flex-shrink-0 transition-colors ${
                isActive ? "text-white"
                : dark ? "text-slate-500 group-hover:text-slate-300"
                : "text-gray-400 group-hover:text-gray-600"
              }`}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className={`px-3 py-4 space-y-0.5 ${dark ? "border-t border-white/5" : "border-t border-gray-100"}`}>
        {/* Theme toggle */}
        <div className="px-0 pb-2">
          <ThemeToggle dark={dark} toggle={toggleTheme} />
        </div>

        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
            ${dark ? "text-slate-400 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <svg className={`w-5 h-5 flex-shrink-0 ${dark ? "text-slate-500" : "text-gray-400"}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
            ${dark ? "text-red-400 hover:text-white hover:bg-red-600" : "text-red-500 hover:text-white hover:bg-red-500"}`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <ThemeContext.Provider value={{ dark, toggle: toggleTheme }}>
      {/* Global styles injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* Scrollbar – sidebar */
        nav::-webkit-scrollbar { width: 4px; }
        nav::-webkit-scrollbar-track { background: transparent; }
        nav::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 9999px; }

        /* Main content scrollbar */
        .admin-main::-webkit-scrollbar { width: 6px; }
        .admin-main::-webkit-scrollbar-track { background: transparent; }
        .admin-main::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.3); border-radius: 9999px; }
        .admin-main::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.5); }

        /* hover:bg-white/8 isn't a native Tailwind class – define it */
        .hover\\:bg-white\\/8:hover { background: rgba(255,255,255,0.08); }

        /* Dark mode: main bg */
        html.dark .admin-main-bg { background: #111827; }
        html:not(.dark) .admin-main-bg { background: #f3f4f6; }

        /* Dark mode: mobile topbar */
        html.dark .mobile-topbar {
          background: #0f1623;
          border-color: rgba(255,255,255,0.05);
        }
        html:not(.dark) .mobile-topbar {
          background: #ffffff;
          border-color: #e5e7eb;
        }
        html.dark .mobile-topbar-text { color: #f0f4ff; }
        html:not(.dark) .mobile-topbar-text { color: #111827; }

        /* Sidebar width */
        .sidebar-width { width: 240px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col sidebar-width flex-shrink-0"
          style={{ boxShadow: dark ? "none" : "2px 0 12px rgba(0,0,0,0.04)" }}>
          <SidebarContent />
        </aside>

        {/* ── Mobile Sidebar Overlay ── */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="sidebar-width flex flex-col" style={{
              boxShadow: "4px 0 24px rgba(0,0,0,0.25)",
              animation: "slideInLeft 0.22s cubic-bezier(.22,1,.36,1)",
            }}>
              <SidebarContent />
            </div>
            <div
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              style={{ animation: "fadeIn 0.2s ease" }}
            />
          </div>
        )}

        {/* ── Main content area ── */}
        <div className="flex-1 flex flex-col overflow-hidden admin-main-bg">

          {/* Mobile topbar */}
          <div className="lg:hidden mobile-topbar flex items-center justify-between px-4 py-3 border-b shadow-sm">
            <button
              onClick={() => setMobileOpen(true)}
              className={`p-2 rounded-lg transition-colors
                ${dark ? "text-slate-300 hover:bg-white/8" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center"
                style={{ boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}>
                <svg style={{ width: 14, height: 14 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="mobile-topbar-text font-semibold text-sm">Admin Panel</span>
            </div>

            {/* Mobile theme toggle */}
            <ThemeToggle dark={dark} toggle={toggleTheme} compact />
          </div>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto p-5 lg:p-8 admin-main admin-main-bg">
            {children}
          </main>
        </div>
      </div>

      {/* Slide-in animation for mobile sidebar */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </ThemeContext.Provider>
  );
}