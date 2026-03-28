import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statCards = [
  {
    key: "totalPatients",
    label: "Total Patients",
    color: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-100",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    numColor: "text-blue-700",
  },
  {
    key: "totalAppointments",
    label: "Total Appointments",
    color: "bg-purple-50 text-purple-600",
    iconBg: "bg-purple-100",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    numColor: "text-purple-700",
  },
  {
    key: "pendingAppointments",
    label: "Pending",
    color: "bg-yellow-50 text-yellow-600",
    iconBg: "bg-yellow-100",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    numColor: "text-yellow-700",
  },
  {
    key: "completedAppointments",
    label: "Completed",
    color: "bg-green-50 text-green-600",
    iconBg: "bg-green-100",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    numColor: "text-green-700",
  },
];

// ── Logic unchanged ───────────────────────────────────────────────────────────
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to MediBridge Admin Panel</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : stats ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div key={card.key} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className={`w-10 h-10 ${card.iconBg} ${card.color.split(" ")[1]} rounded-lg flex items-center justify-center mb-3`}>
                  {card.icon}
                </div>
                <p className={`text-2xl font-bold ${card.numColor}`}>{stats[card.key] ?? 0}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Overview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Today's Schedule</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.approvedAppointments ?? 0}</p>
                <p className="text-sm text-gray-400 mt-1">Approved appointments ready for today</p>
              </div>
              <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Need Attention</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.pendingAppointments ?? 0}</p>
                <p className="text-sm text-gray-400 mt-1">Pending appointments awaiting review</p>
              </div>
              <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Completed This Month</p>
                <p className="text-3xl font-bold text-green-600">{stats?.completedAppointments ?? 0}</p>
                <p className="text-sm text-gray-400 mt-1">Successfully completed treatments</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </AdminLayout>
  );
}