import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statCards = [
  {
    key: "totalPatients",
    label: "Total Patients",
    topBar: "bg-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    statColor: "text-blue-600",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    badgeLabel: "All time",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "totalAppointments",
    label: "Total Appointments",
    topBar: "bg-purple-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    statColor: "text-purple-600",
    badge: "bg-purple-50 text-purple-600 border-purple-100",
    badgeLabel: "All time",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "pendingAppointments",
    label: "Pending",
    topBar: "bg-amber-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    statColor: "text-amber-500",
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    badgeLabel: "Needs review",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "completedAppointments",
    label: "Completed",
    topBar: "bg-green-500",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    statColor: "text-green-600",
    badge: "bg-green-50 text-green-600 border-green-100",
    badgeLabel: "This month",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const overviewCards = [
  {
    key: "approvedAppointments",
    label: "Today's Schedule",
    sub: "Approved appointments ready for today",
    topBar: "bg-blue-600",
    statColor: "text-gray-900",
    icon: "📅",
  },
  {
    key: "pendingAppointments",
    label: "Need Attention",
    sub: "Pending appointments awaiting review",
    topBar: "bg-amber-400",
    statColor: "text-amber-500",
    icon: "⚠️",
  },
  {
    key: "completedAppointments",
    label: "Completed This Month",
    sub: "Successfully completed treatments",
    topBar: "bg-green-500",
    statColor: "text-green-600",
    icon: "✅",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .admin-dash { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay:.04s }
        .fade-up-2 { animation-delay:.10s }
        .fade-up-3 { animation-delay:.16s }
        .fade-up-4 { animation-delay:.22s }
        .fade-up-5 { animation-delay:.28s }
        .fade-up-6 { animation-delay:.34s }
        .fade-up-7 { animation-delay:.40s }

        .stat-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.09);
        }

        .stat-number {
          font-family: 'DM Serif Display', serif;
          font-size: 2.25rem;
          line-height: 1;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }

        .pulse-dot { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        /* ── Dark mode ── */
        .dark .admin-dash .bg-white          { background: #1e2433 !important; }
        .dark .admin-dash .border-gray-100   { border-color: #2d3748 !important; }
        .dark .admin-dash .border-gray-200   { border-color: #2d3748 !important; }
        .dark .admin-dash .text-gray-900     { color: #f0f4ff !important; }
        .dark .admin-dash .text-gray-600     { color: #a8b3cf !important; }
        .dark .admin-dash .text-gray-500     { color: #8895b3 !important; }
        .dark .admin-dash .text-gray-400     { color: #6b7a99 !important; }
        .dark .admin-dash .bg-gray-50        { background: #252d3d !important; }
        .dark .admin-dash .bg-gray-100       { background: #2d3748 !important; }
        .dark .admin-dash .bg-blue-50        { background: #1a3050 !important; }
        .dark .admin-dash .border-blue-100   { border-color: #1e4080 !important; }
        .dark .admin-dash .bg-blue-100       { background: #1e3a5f !important; }
        .dark .admin-dash .text-blue-900     { color: #bfdbfe !important; }
        .dark .admin-dash .text-blue-700     { color: #93c5fd !important; }
        .dark .admin-dash .text-blue-600     { color: #60a5fa !important; }
        .dark .admin-dash .bg-purple-50      { background: #2d1f4a !important; }
        .dark .admin-dash .bg-amber-50       { background: #3d2c0a !important; }
        .dark .admin-dash .bg-green-50       { background: #14291a !important; }
        .dark .admin-dash .shadow-sm         { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
        .dark .admin-dash .shadow-xl         { box-shadow: 0 20px 48px rgba(0,0,0,0.4) !important; }
        .dark .admin-dash .stat-card:hover   { box-shadow: 0 12px 32px rgba(0,0,0,0.5) !important; }
        .dark .admin-dash .h-px.bg-gray-100  { background: #2d3748 !important; }
        .dark .admin-dash button.bg-white    { background: #1e2433 !important; border-color: #2d3748 !important; color: #a8b3cf !important; }
        .dark .admin-dash button.bg-white:hover { border-color: #3b82f6 !important; color: #60a5fa !important; }
      `}</style>

      <div className="admin-dash">

        {/* ── Page Header ── */}
        <div className="mb-8 fade-up fade-up-1">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot inline-block" />
                Live Dashboard
              </div>
              <h1
                className="text-3xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">{dateStr}</p>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full spinner" />
            <p className="text-sm text-gray-400 font-medium">Loading dashboard data...</p>
          </div>
        ) : stats ? (
          <>
            {/* ── Blue Trust Banner ── */}
            <div className="fade-up fade-up-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-200 mb-8">
              <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
              <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-1">Welcome Back</p>
                  <h3 className="text-xl font-bold mb-1">Admin </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    You have{" "}
                    <span className="font-bold text-white">{stats?.pendingAppointments ?? 0} pending</span>{" "}
                    appointments waiting for your review.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-white/15 rounded-2xl flex flex-col items-center justify-center text-center border border-white/20">
                    <span className="text-2xl">🦷</span>
                    <span className="text-[10px] font-semibold mt-1 text-blue-100">MediBridge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => (
                <div
                  key={card.key}
                  className={`stat-card fade-up fade-up-${i + 3} bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm`}
                >
                  <div className={`h-1 w-full ${card.topBar}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 ${card.iconBg} ${card.iconColor} rounded-xl flex items-center justify-center`}>
                        {card.icon}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badge}`}>
                        {card.badgeLabel}
                      </span>
                    </div>
                    <p className={`stat-number font-bold ${card.statColor}`}>
                      {stats[card.key] ?? 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Quick Overview ── */}
            <div className="fade-up fade-up-7">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Quick Overview
                </h2>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {overviewCards.map((card) => (
                  <div
                    key={card.key}
                    className="stat-card bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm"
                  >
                    <div className={`h-1 w-full ${card.topBar}`} />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{card.icon}</span>
                        <p className="text-sm font-semibold text-gray-600">{card.label}</p>
                      </div>
                      <p className={`stat-number font-bold ${card.statColor} mb-1`}>
                        {stats[card.key] ?? 0}
                      </p>
                      <p className="text-xs text-gray-400 leading-snug">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Privacy note ── */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-blue-900 text-sm">Admin Access — Secured</p>
                <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
                  All patient records and appointment data are encrypted. This panel is accessible only to authorized MediBridge administrators.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-4xl">⚠️</span>
            <p className="text-gray-500 font-medium">No data available</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}