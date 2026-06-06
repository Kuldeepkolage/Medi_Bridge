import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const avatarBgs = ["#2563eb","#7c3aed","#059669","#dc2626","#d97706","#0891b2","#be185d","#16a34a"];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res = await adminAPI.getAllPatients();
      if (res.data.success) setPatients(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const filtered = patients.filter(p =>
    !search ||
    p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .patients-page { font-family: 'DM Sans', sans-serif; }
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
        .search-input:focus { outline:none; border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.15); }

        /* ── Dark mode ── */
        .dark .patients-page .bg-white        { background: #1e2433 !important; }
        .dark .patients-page .border-gray-100  { border-color: #2d3748 !important; }
        .dark .patients-page .border-gray-200  { border-color: #2d3748 !important; }
        .dark .patients-page .border-b         { border-color: #2d3748 !important; }
        .dark .patients-page .text-gray-900    { color: #f0f4ff !important; }
        .dark .patients-page .text-gray-600    { color: #a8b3cf !important; }
        .dark .patients-page .text-gray-500    { color: #8895b3 !important; }
        .dark .patients-page .text-gray-400    { color: #6b7a99 !important; }
        .dark .patients-page .bg-gray-50       { background: #252d3d !important; }
        .dark .patients-page .bg-gray-100      { background: #2d3748 !important; }
        .dark .patients-page thead tr          { background: rgba(37,45,61,0.7) !important; }
        .dark .patients-page .divide-y > *     { border-color: #252d3d !important; }
        .dark .patients-page .divide-gray-50 > * { border-color: #252d3d !important; }
        .dark .patients-page .row-hover:hover  { background: rgba(30,58,95,0.25) !important; }
        .dark .patients-page .bg-blue-50       { background: #1a3050 !important; }
        .dark .patients-page .border-blue-100  { border-color: #1e4080 !important; }
        .dark .patients-page .bg-blue-100      { background: #1e3a5f !important; }
        .dark .patients-page .text-blue-900    { color: #bfdbfe !important; }
        .dark .patients-page .text-blue-700    { color: #93c5fd !important; }
        .dark .patients-page .text-blue-600    { color: #60a5fa !important; }
        .dark .patients-page .bg-green-50      { background: #14291a !important; }
        .dark .patients-page .border-green-100 { border-color: #166534 !important; }
        .dark .patients-page .text-green-700   { color: #86efac !important; }
        .dark .patients-page .bg-purple-50     { background: #2d1f4a !important; }
        .dark .patients-page .border-purple-100 { border-color: #4c1d95 !important; }
        .dark .patients-page .text-purple-600  { color: #c084fc !important; }
        .dark .patients-page .shadow-sm        { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
        .dark .patients-page .search-input     { background: #252d3d !important; border-color: #2d3748 !important; color: #f0f4ff !important; }
        .dark .patients-page .search-input::placeholder { color: #6b7a99 !important; }
        .dark .patients-page .search-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.2) !important; }
        .dark .patients-page button.bg-white   { background: #1e2433 !important; border-color: #2d3748 !important; color: #a8b3cf !important; }
        .dark .patients-page button.bg-white:hover { border-color: #3b82f6 !important; color: #60a5fa !important; }
      `}</style>

      <div className="patients-page">

        {/* ── Page Header ── */}
        <div className="mb-8 fade-up fade-up-1">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot inline-block" />
                Patient Records
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Patients
              </h1>
              <p className="text-gray-400 text-sm mt-1">View all registered patients</p>
            </div>
            <button onClick={fetchPatients}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 fade-up fade-up-2">
          {[
            { label: "Total Patients",  val: patients.length, topBar: "bg-blue-600",  statColor: "text-blue-600",  iconBg: "bg-blue-50",  icon: "👥" },
            { label: "New This Month",  val: patients.filter(p => { const d = new Date(p.createdAt); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length, topBar: "bg-green-500", statColor: "text-green-600", iconBg: "bg-green-50", icon: "🌱" },
            { label: "Repeat Visitors", val: patients.filter(p => (p.totalVisits || 0) > 1).length, topBar: "bg-purple-500", statColor: "text-purple-600", iconBg: "bg-purple-50", icon: "⭐" },
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
            <p className="text-sm text-gray-400 font-medium">Loading patients...</p>
          </div>
        ) : (
          <div className="fade-up fade-up-3">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-blue-600" />

              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Patient Directory</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search patients..."
                      className="search-input pl-8 pr-4 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-900 rounded-xl w-52 placeholder:text-gray-400 transition-all"
                    />
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {filtered.length} patients
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {["Patient", "Email", "Registered On", "Total Visits"].map((h) => (
                        <th key={h} className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((p, i) => {
                      const initials = p.fullName?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";
                      const visits = p.totalVisits || 0;
                      return (
                        <tr key={p._id} className="row-hover">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: avatarBgs[i % avatarBgs.length] }}>
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{p.fullName}</p>
                                {visits > 1 && (
                                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-full">
                                    Returning
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-500 text-sm">{p.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-gray-600 text-sm">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {fmt(p.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                              visits >= 5
                                ? "bg-green-50 text-green-700 border-green-100"
                                : visits >= 2
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-gray-50 text-gray-600 border-gray-100"
                            }`}>
                              {visits >= 5 ? "⭐" : visits >= 2 ? "🔵" : "🆕"} {visits} {visits === 1 ? "visit" : "visits"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <span className="text-4xl">{search ? "🔍" : "👥"}</span>
                    <p className="text-sm text-gray-400 font-medium">
                      {search ? `No patients matching "${search}"` : "No patients found"}
                    </p>
                    {search && (
                      <button onClick={() => setSearch("")} className="text-xs text-blue-600 hover:underline">
                        Clear search
                      </button>
                    )}
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
              All patient records are encrypted and accessible only to authorized MediBridge administrators.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}