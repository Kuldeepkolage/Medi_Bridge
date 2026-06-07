import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";
const API_URL = import.meta.env.VITE_API_URL;

const API_URL = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL";

const statusConfig = {
  pending:   { cls: "bg-red-50 text-red-600 border border-red-100",     label: "Pending",   topBar: "bg-red-500"   },
  contacted: { cls: "bg-blue-50 text-blue-600 border border-blue-100",  label: "Contacted", topBar: "bg-blue-500"  },
  resolved:  { cls: "bg-green-50 text-green-600 border border-green-100", label: "Resolved", topBar: "bg-green-500" },
};

const updateStatus = (setFn, id, status) =>
  setFn(prev => prev.map(e => e._id === id ? { ...e, status } : e));

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newAlert, setNewAlert]       = useState(false);
  const [updating, setUpdating]       = useState(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    fetchEmergencies(true);
    const interval = setInterval(() => fetchEmergencies(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async (initial = false) => {
    try {
      const res = await adminAPI.getEmergencyRequests();
      if (res.data.success) {
        const data = res.data.data;
        if (!initial && data.length > prevCountRef.current) {
          setNewAlert(true);
          setTimeout(() => setNewAlert(false), 6000);
        }
        prevCountRef.current = data.length;
        setEmergencies(data);
        setLastUpdated(new Date());
      }
    } catch (err) { console.error("Error fetching emergencies:", err); }
    finally { if (initial) setLoading(false); }
  };

  const handleContacted = async (e) => {
    setUpdating(e._id);
    try {
      const res = await fetch(`${API_URL}/api/emergencies/${e._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted" }),
      });
      const data = await res.json();
      if (data.success) updateStatus(setEmergencies, e._id, "contacted");
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const handleResolve = async (e) => {
    setUpdating(e._id);
    try {
      const statusRes = await fetch(`${API_URL}/api/emergencies/${e._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      const statusData = await statusRes.json();
      if (statusData.success) {
        await fetch(`${API_URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: e.patientName || e.name || "Emergency Patient",
            phone: e.phone,
            email: e.email || "",
            service: "Emergency",
            date: new Date().toISOString(),
            time: "ASAP",
            doctor: "Dr. Samruddhi",
            status: "approved",
          }),
        });
        updateStatus(setEmergencies, e._id, "resolved");
      }
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const fmt     = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const pendingCount   = emergencies.filter(e => (e.status || "pending") === "pending").length;
  const contactedCount = emergencies.filter(e => e.status === "contacted").length;
  const resolvedCount  = emergencies.filter(e => e.status === "resolved").length;

  const active  = emergencies.filter(e => (e.status || "pending") !== "resolved");
  const resolved = emergencies.filter(e => e.status === "resolved");
  const ordered  = [...active, ...resolved];

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .emerg-page { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay:.04s } .fade-up-2 { animation-delay:.10s }
        .fade-up-3 { animation-delay:.16s } .fade-up-4 { animation-delay:.22s }
        .row-hover { transition: background 0.14s ease; }
        .row-hover:hover { background: rgba(239,246,255,0.7); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        .pulse-dot { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
        .ping-red  { animation: ping 1s cubic-bezier(0,0,0.2,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes ping  { 75%,100%{transform:scale(2);opacity:0} }
        .stat-number { font-family:'DM Serif Display',serif; font-size:1.75rem; line-height:1; }
        .btn-shine { position:relative; overflow:hidden; }
        .btn-shine::after { content:''; position:absolute; top:-50%; left:-75%; width:50%; height:200%;
          background:linear-gradient(to right,transparent,rgba(255,255,255,0.22),transparent);
          transform:skewX(-20deg); transition:left 0.55s ease; }
        .btn-shine:hover::after { left:125%; }
        .alert-bar {
          animation: fadeUp 0.35s cubic-bezier(.22,1,.36,1) both;
        }

        /* ── Dark mode ── */
        .dark .emerg-page .bg-white         { background: #1e2433 !important; }
        .dark .emerg-page .border-gray-100  { border-color: #2d3748 !important; }
        .dark .emerg-page .border-gray-200  { border-color: #2d3748 !important; }
        .dark .emerg-page .text-gray-900    { color: #f0f4ff !important; }
        .dark .emerg-page .text-gray-600    { color: #a8b3cf !important; }
        .dark .emerg-page .text-gray-500    { color: #8895b3 !important; }
        .dark .emerg-page .text-gray-400    { color: #6b7a99 !important; }
        .dark .emerg-page .bg-gray-50       { background: #252d3d !important; }
        .dark .emerg-page .bg-gray-50\\/60  { background: rgba(37,45,61,0.6) !important; }
        .dark .emerg-page .divide-gray-50 > * { border-color: #2d3748 !important; }
        .dark .emerg-page .bg-gray-100      { background: #2d3748 !important; }
        .dark .emerg-page .bg-blue-50       { background: #1e3a5f !important; }
        .dark .emerg-page .border-blue-100  { border-color: #1e4080 !important; }
        .dark .emerg-page .text-blue-600    { color: #60a5fa !important; }
        .dark .emerg-page .text-blue-900    { color: #bfdbfe !important; }
        .dark .emerg-page .text-blue-700    { color: #93c5fd !important; }
        .dark .emerg-page .bg-blue-100      { background: #1e3a5f !important; }
        .dark .emerg-page .shadow-sm        { box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important; }
        .dark .emerg-page .row-hover:hover  { background: rgba(30,58,95,0.4) !important; }
        .dark .emerg-page .bg-red-50        { background: #3b1f1f !important; }
        .dark .emerg-page .border-red-200   { border-color: #7f1d1d !important; }
        .dark .emerg-page .text-red-700     { color: #fca5a5 !important; }
      `}</style>

      <div className="emerg-page">

        {/* ── Page Header ── */}
        <div className="mb-8 fade-up fade-up-1">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="ping-red absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                </span>
                Live Emergency Feed
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Emergency Requests
                </h1>
                {pendingCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                    <span className="relative flex h-2 w-2">
                      <span className="ping-red absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                    </span>
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Handle urgent patient requests
                {lastUpdated && (
                  <span className="text-gray-300 ml-2">· Updated {fmtTime(lastUpdated)}</span>
                )}
              </p>
            </div>
            <button onClick={() => fetchEmergencies(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ── New Emergency Alert ── */}
        {newAlert && (
          <div className="mb-4 alert-bar flex items-center gap-3 px-5 py-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="ping-red absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            🚨 New emergency request received!
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 fade-up fade-up-2">
          {[
            { label: "Total Requests", val: emergencies.length, topBar: "bg-blue-600",  statColor: "text-blue-600",  iconBg: "bg-blue-50",  icon: "🚑" },
            { label: "Pending",        val: pendingCount,        topBar: "bg-red-500",   statColor: "text-red-600",   iconBg: "bg-red-50",   icon: "🔴" },
            { label: "Resolved",       val: resolvedCount,       topBar: "bg-green-500", statColor: "text-green-600", iconBg: "bg-green-50", icon: "✅" },
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
            <div className="w-10 h-10 border-4 border-red-100 border-t-red-500 rounded-full spinner" />
            <p className="text-sm text-gray-400 font-medium">Loading emergency requests...</p>
          </div>
        ) : (
          <div className="fade-up fade-up-3">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-red-500" />

              {/* Table header bar */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Emergency Records</span>
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {ordered.length} records · auto-refreshes every 30s
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {["Patient", "Phone", "Description", "Date & Time", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ordered.map((e, i) => {
                      const status      = e.status || "pending";
                      const isPending   = status === "pending";
                      const isContacted = status === "contacted";
                      const isResolved  = status === "resolved";
                      const isUpdating  = updating === e._id;
                      const initials    = (e.patientName || e.name || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
                      const avatarBgs   = ["#dc2626","#2563eb","#7c3aed","#059669","#d97706","#0891b2","#be185d","#16a34a"];

                      return (
                        <tr key={e._id}
                          className={`row-hover transition-opacity ${isResolved ? "opacity-60 hover:opacity-100" : ""}`}>

                          {/* Patient */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  style={{ background: avatarBgs[i % avatarBgs.length] }}>
                                  {initials}
                                </div>
                                {isPending && (
                                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white">
                                    <span className="ping-red absolute inset-0 rounded-full bg-red-400 opacity-75" />
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-gray-900">{e.patientName || e.name}</p>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-6 py-4 text-gray-500">{e.phone}</td>

                          {/* Description */}
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-gray-500 truncate">{e.description || e.service || "—"}</p>
                          </td>

                          {/* Date & Time */}
                          <td className="px-6 py-4">
                            <p className="text-gray-700 font-medium">{fmt(e.createdAt)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{fmtTime(e.createdAt)}</p>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[status]?.cls || "bg-yellow-50 text-yellow-600 border border-yellow-100"}`}>
                              {statusConfig[status]?.label || status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 flex-wrap">

                              {/* Call — non-resolved */}
                              {!isResolved && (
                                <a href={`tel:${e.phone}`}
                                  className="btn-shine inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  Call
                                </a>
                              )}

                              {/* Pending → Contacted */}
                              {isPending && (
                                <button onClick={() => handleContacted(e)} disabled={isUpdating}
                                  className="btn-shine px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm">
                                  {isUpdating ? "..." : "Mark Contacted"}
                                </button>
                              )}

                              {/* Contacted → Resolve */}
                              {isContacted && (
                                <button onClick={() => handleResolve(e)} disabled={isUpdating}
                                  className="btn-shine px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm">
                                  {isUpdating ? "..." : "Resolve & Move"}
                                </button>
                              )}

                              {/* Resolved */}
                              {isResolved && (
                                <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  Resolved · In Appointments
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {emergencies.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <span className="text-5xl">🚑</span>
                    <p className="text-gray-400 text-sm font-medium">No emergency requests</p>
                    <p className="text-gray-300 text-xs">Auto-refreshes every 30 seconds</p>
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
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-blue-900 text-sm">Patient Data — Secured</p>
            <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
              All emergency records are encrypted and accessible only to authorized MediBridge administrators.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}