import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statCards = [
  { key: "totalPatients", label: "Total Patients", icon: "👥", color: "#3b82f6" },
  { key: "totalAppointments", label: "Total Appointments", icon: "📅", color: "#8b5cf6" },
  { key: "pendingAppointments", label: "Pending", icon: "⏳", color: "#f59e0b" },
  { key: "completedAppointments", label: "Completed", icon: "✅", color: "#10b981" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
          <p>Welcome to MediBridge Admin Panel</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : stats ? (
          <div className="stats-grid">
            {statCards.map((card) => (
              <div key={card.key} className="stat-card" style={{ borderTopColor: card.color }}>
                <div className="stat-icon" style={{ background: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <h3>{stats[card.key] || 0}</h3>
                  <p>{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
        )}

        <div className="dashboard-section">
          <h2>Quick Overview</h2>
          <div className="overview-cards">
            <div className="overview-card">
              <h3>Today's Schedule</h3>
              <p className="overview-number">{stats?.approvedAppointments || 0}</p>
              <p>Approved appointments ready for today</p>
            </div>
            <div className="overview-card">
              <h3>Need Attention</h3>
              <p className="overview-number" style={{ color: "#f59e0b" }}>
                {stats?.pendingAppointments || 0}
              </p>
              <p>Pending appointments awaiting review</p>
            </div>
            <div className="overview-card">
              <h3>Completed This Month</h3>
              <p className="overview-number" style={{ color: "#10b981" }}>
                {stats?.completedAppointments || 0}
              </p>
              <p>Successfully completed treatments</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

