import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/admin/appointments", label: "Appointments", icon: "📅" },
  { path: "/admin/patients", label: "Patients", icon: "👥" },
  { path: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { path: "/admin/emergencies", label: "Emergencies", icon: "🚨" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>MediBridge</h2>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Back to Website</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

