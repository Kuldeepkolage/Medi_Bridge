import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statusStyle = {
  pending:   { cls: "bg-amber-50 text-amber-600 border border-amber-100",  label: "Pending",   topBar: "bg-amber-400" },
  approved:  { cls: "bg-blue-50 text-blue-600 border border-blue-100",     label: "Approved",  topBar: "bg-blue-500" },
  rejected:  { cls: "bg-red-50 text-red-600 border border-red-100",        label: "Rejected",  topBar: "bg-red-500" },
  completed: { cls: "bg-green-50 text-green-600 border border-green-100",  label: "Completed", topBar: "bg-green-500" },
};

const updateStatus = (setFn, id, status) =>
  setFn((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));

const avatarBgs = ["#2563eb","#7c3aed","#059669","#dc2626","#d97706","#0891b2","#be185d","#16a34a"];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await adminAPI.getAllAppointments();
      if (res.data.success) setAppointments(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    setUpdating(id);
    try { const r = await adminAPI.approveAppointment(id); if (r.data.success) updateStatus(setAppointments, id, "approved"); }
    catch (e) { console.error(e); } finally { setUpdating(null); }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try { const r = await adminAPI.rejectAppointment(id); if (r.data.success) updateStatus(setAppointments, id, "rejected"); }
    catch (e) { console.error(e); } finally { setUpdating(null); }
  };

  const handleComplete = async (id) => {
    setUpdating(id);
    try { const r = await adminAPI.completeAppointment(id); if (r.data.success) updateStatus(setAppointments, id, "completed"); }
    catch (e) { console.error(e); } finally { setUpdating(null); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    approved: appointments.filter(a => a.status === "approved").length,
    completed: appointments.filter(a => a.status === "completed").length,
    rejected: appointments.filter(a => a.status === "rejected").length,
  };

  const active = appointments.filter((a) => a.status === "pending" || a.status === "approved");
  const done   = appointments.filter((a) => a.status === "completed" || a.status === "rejected");
  const ordered = [...active, ...done];
  const filtered = filter === "all" ? ordered : ordered.filter(a => a.status === filter);

  const FILTERS = [
    { key: "all",       label: "All",       color: "blue" },
    { key: "pending",   label: "Pending",   color: "amber" },
    { key: "approved",  label: "Approved",  color: "blue" },
    { key: "completed", label: "Completed", color: "green" },
    { key: "rejected",  label: "Rejected",  color: "red" },
  ];

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .appts-page { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay:.04s } .fade-up-2 { animation-delay:.10s }
        .fade-up-3 { animation-delay:.16s } .fade-up-4 { animation-delay:.22s }
        .row-hover { transition: background 0.14s ease; }
        .row-hover:hover { background: rgba(239,246,255,0.7); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        .pulse-dot { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .stat-number { font-family:'DM Serif Display',serif; font-size:1.75rem; line-height:1; }
        .btn-shine { position:relative; overflow:hidden; }
        .btn-shine::after { content:''; position:absolute; top:-50%; left:-75%; width:50%; height:200%; background:linear-gradient(to right,transparent,rgba(255,255,255,0.22),transparent); transform:skewX(-20deg); transition:left 0.55s ease; }
        .btn-shine:hover::after { left:125%; }

        /* ── Dark mode ── */
        .dark .appts-page .bg-white          { background: #1e2433 !important; }
        .dark .appts-page .border-gray-100   { border-color: #2d3748 !important; }
        .dark .appts-page .border-gray-200   { border-color: #2d3748 !important; }
        .dark .appts-page .border-b          { border-color: #2d3748 !important; }
        .dark .appts-page .text-gray-900     { color: #f0f4ff !important; }
        .dark .appts-page .text-gray-700     { color: #c5cfe8 !important; }
        .dark .appts-page .text-gray-600     { color: #a8b3cf !important; }
        .dark .appts-page .text-gray-500     { color: #8895b3 !important; }
        .dark .appts-page .text-gray-400     { color: #6b7a99 !important; }
        .dark .appts-page .text-gray-300     { color: #4a5568 !important; }
        .dark .appts-page .bg-gray-50        { background: #252d3d !important; }
        .dark .appts-page .bg-gray-100       { background: #2d3748 !important; }
        .dark .appts-page thead tr           { background: rgba(37,45,61,0.7) !important; }
        .dark .appts-page .divide-y > *      { border-color: #252d3d !important; }
        .dark .appts-page .divide-gray-50 > * { border-color: #252d3d !important; }
        .dark .appts-page .row-hover:hover   { background: rgba(30,58,95,0.25) !important; }
        .dark .appts-page .bg-amber-50       { background: #3d2c0a !important; }
        .dark .appts-page .border-amber-100  { border-color: #78350f !important; }
        .dark .appts-page .bg-red-50         { background: #3b1f1f !important; }
        .dark .appts-page .border-red-100    { border-color: #7f1d1d !important; }
        .dark .appts-page .bg-blue-50        { background: #1a3050 !important; }
        .dark .appts-page .border-blue-100   { border-color: #1e4080 !important; }
        .dark .appts-page .bg-blue-100       { background: #1e3a5f !important; }
        .dark .appts-page .bg-green-50       { background: #14291a !important; }
        .dark .appts-page .border-green-100  { border-color: #166534 !important; }
        .dark .appts-page .text-blue-900     { color: #bfdbfe !important; }
        .dark .appts-page .text-blue-700     { color: #93c5fd !important; }
        .dark .appts-page .shadow-sm         { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
        .dark .appts-page button.bg-white    { background: #1e2433 !important; border-color: #2d3748 !important; color: #a8b3cf !important; }
        .dark .appts-page button.bg-white:hover { border-color: #3b82f6 !important; color: #60a5fa !important; }
      `}</style>

      <div className="appts-page">

        {/* ── Page Header ── */}
        <div className="mb-8 fade-up fade-up-1">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot inline-block" />
                Live Data
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Appointments
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage all patient appointments</p>
            </div>
            <button onClick={fetchAppointments}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stat Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 fade-up fade-up-2">
          {[
            { label: "Total",     val: counts.all,       topBar: "bg-blue-600",  statColor: "text-blue-600",  iconBg: "bg-blue-50",  icon: "📋" },
            { label: "Pending",   val: counts.pending,   topBar: "bg-amber-400", statColor: "text-amber-500", iconBg: "bg-amber-50", icon: "⏳" },
            { label: "Approved",  val: counts.approved,  topBar: "bg-blue-500",  statColor: "text-blue-600",  iconBg: "bg-blue-50",  icon: "✅" },
            { label: "Completed", val: counts.completed, topBar: "bg-green-500", statColor: "text-green-600", iconBg: "bg-green-50", icon: "🏁" },
          ].map(({ label, val, topBar, statColor, iconBg, icon }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className={`h-1 w-full ${topBar}`} />
              <div className="p-4">
                <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center text-lg mb-3`}>{icon}</div>
                <p className={`stat-number font-bold ${statColor}`}>{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full spinner" />
            <p className="text-sm text-gray-400 font-medium">Loading appointments...</p>
          </div>
        ) : (
          <div className="fade-up fade-up-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {FILTERS.map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    filter === key
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600"
                  }`}>
                  {label}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {counts[key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Table Card */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-blue-600" />

              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Appointment Records</span>
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {filtered.length} records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {["Patient", "Date & Time", "Service", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((apt, i) => {
                      const initials = apt.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";
                      const isDone = apt.status === "completed" || apt.status === "rejected";
                      return (
                        <tr key={apt._id} className={`row-hover ${isDone ? "opacity-60 hover:opacity-100" : ""}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: avatarBgs[i % avatarBgs.length] }}>
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{apt.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{apt.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700 font-medium">{fmt(apt.date)}</p>
                            {apt.time && <p className="text-xs text-gray-400 mt-0.5">{apt.time}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-100 rounded-full text-xs font-semibold">
                              🦷 {apt.service || apt.doctor}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[apt.status]?.cls}`}>
                              {statusStyle[apt.status]?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {apt.status === "pending" && (
                                <>
                                  <button onClick={() => handleApprove(apt._id)} disabled={updating === apt._id}
                                    className="btn-shine px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm">
                                    {updating === apt._id ? "..." : "Approve"}
                                  </button>
                                  <button onClick={() => handleReject(apt._id)} disabled={updating === apt._id}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                                    Reject
                                  </button>
                                </>
                              )}
                              {apt.status === "approved" && (
                                <button onClick={() => handleComplete(apt._id)} disabled={updating === apt._id}
                                  className="btn-shine px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm">
                                  {updating === apt._id ? "..." : "Mark Done"}
                                </button>
                              )}
                              {apt.status === "completed" && (
                                <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  Done
                                </span>
                              )}
                              {apt.status === "rejected" && <span className="text-gray-300 text-xs font-medium">—</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <span className="text-4xl">📭</span>
                    <p className="text-sm text-gray-400 font-medium">No appointments found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4 fade-up fade-up-4">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-blue-900 text-sm">Patient Data — Secured</p>
            <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
              All appointment records are encrypted and accessible only to authorized MediBridge administrators.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}