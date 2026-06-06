import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const starColors = ["", "text-red-400", "text-orange-400", "text-amber-400", "text-yellow-400", "text-yellow-400"];

const ratingBadge = {
  1: "bg-red-50 text-red-600 border-red-100",
  2: "bg-orange-50 text-orange-600 border-orange-100",
  3: "bg-amber-50 text-amber-600 border-amber-100",
  4: "bg-yellow-50 text-yellow-700 border-yellow-100",
  5: "bg-green-50 text-green-700 border-green-100",
};

function StarRow({ stars, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${size} ${i < stars ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter]     = useState("all");

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllReviews();
      if (res.data.success) setReviews(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    setDeleting(id);
    try {
      const res = await adminAPI.deleteReview(id);
      if (res.data.success) setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Stats
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length).toFixed(1)
    : "—";
  const fiveStars = reviews.filter(r => r.stars === 5).length;

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.stars === Number(filter));

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "5",   label: "⭐⭐⭐⭐⭐" },
    { key: "4",   label: "⭐⭐⭐⭐" },
    { key: "3",   label: "⭐⭐⭐" },
    { key: "2",   label: "⭐⭐" },
    { key: "1",   label: "⭐" },
  ];

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .reviews-page { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay:.04s } .fade-up-2 { animation-delay:.10s }
        .fade-up-3 { animation-delay:.16s } .fade-up-4 { animation-delay:.22s }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        .pulse-dot { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .stat-number { font-family:'DM Serif Display',serif; font-size:1.75rem; line-height:1; }
        .review-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .delete-btn { transition: background 0.14s, color 0.14s; }
        .delete-btn:hover { background: #fef2f2; color: #ef4444; }

        /* ── Dark mode ── */
        .dark .reviews-page .bg-white        { background: #1e2433 !important; }
        .dark .reviews-page .border-gray-100 { border-color: #2d3748 !important; }
        .dark .reviews-page .border-gray-200 { border-color: #2d3748 !important; }
        .dark .reviews-page .text-gray-900   { color: #f0f4ff !important; }
        .dark .reviews-page .text-gray-600   { color: #a8b3cf !important; }
        .dark .reviews-page .text-gray-500   { color: #8895b3 !important; }
        .dark .reviews-page .text-gray-400   { color: #6b7a99 !important; }
        .dark .reviews-page .bg-gray-50      { background: #252d3d !important; }
        .dark .reviews-page .bg-gray-100     { background: #2d3748 !important; }
        .dark .reviews-page .text-gray-200   { color: #374151 !important; }
        .dark .reviews-page .bg-blue-50      { background: #1e3a5f !important; }
        .dark .reviews-page .border-blue-100 { border-color: #1e4080 !important; }
        .dark .reviews-page .text-blue-600   { color: #60a5fa !important; }
        .dark .reviews-page .text-blue-900   { color: #bfdbfe !important; }
        .dark .reviews-page .text-blue-700   { color: #93c5fd !important; }
        .dark .reviews-page .bg-blue-100     { background: #1e3a5f !important; }
        .dark .reviews-page .shadow-sm       { box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important; }
        .dark .reviews-page .review-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important; }
        .dark .reviews-page .delete-btn:hover  { background: #3b1f1f !important; color: #f87171 !important; }
      `}</style>

      <div className="reviews-page">

        {/* ── Page Header ── */}
        <div className="mb-8 fade-up fade-up-1">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot inline-block" />
                Patient Feedback
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}>
                Reviews
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage all patient reviews &amp; ratings</p>
            </div>
            <button onClick={fetchReviews}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 fade-up fade-up-2">
          {[
            { label: "Total Reviews",  val: reviews.length, topBar: "bg-blue-600",  statColor: "text-blue-600",  iconBg: "bg-blue-50",  icon: "💬" },
            { label: "Average Rating", val: avg,            topBar: "bg-yellow-400", statColor: "text-yellow-600", iconBg: "bg-yellow-50", icon: "⭐" },
            { label: "5-Star Reviews", val: fiveStars,      topBar: "bg-green-500", statColor: "text-green-600", iconBg: "bg-green-50", icon: "🏆" },
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
            <p className="text-sm text-gray-400 font-medium">Loading reviews...</p>
          </div>
        ) : (
          <div className="fade-up fade-up-3">

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {FILTERS.map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    filter === key
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600"
                  }`}>
                  {label}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {key === "all" ? reviews.length : reviews.filter(r => r.stars === Number(key)).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Reviews grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="text-5xl">💬</span>
                <p className="text-gray-400 text-sm font-medium">No reviews found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((r, i) => {
                  const stars = r.stars || 0;
                  return (
                    <div key={r._id}
                      className="review-card bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                      {/* Colored top bar by rating */}
                      <div className={`h-1 w-full ${
                        stars === 5 ? "bg-green-500"
                        : stars === 4 ? "bg-yellow-400"
                        : stars === 3 ? "bg-amber-400"
                        : stars === 2 ? "bg-orange-400"
                        : "bg-red-400"
                      }`} />

                      <div className="p-5 flex flex-col flex-1">
                        {/* Stars + badge row */}
                        <div className="flex items-center justify-between mb-3">
                          <StarRow stars={stars} />
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ratingBadge[stars] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                            {starLabels[stars] || "—"}
                          </span>
                        </div>

                        {/* Quote */}
                        <div className="flex-1">
                          <svg className="w-6 h-6 text-gray-100 mb-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                          </svg>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {r.comment || "No comment provided."}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {fmt(r.createdAt)}
                          </span>

                          <button onClick={() => handleDelete(r._id)} disabled={deleting === r._id}
                            className="delete-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 text-gray-400 text-xs font-semibold rounded-lg disabled:opacity-50 transition-all">
                            {deleting === r._id
                              ? <svg className="w-3.5 h-3.5 spinner" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            }
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
            <p className="font-semibold text-blue-900 text-sm">Review Data — Secured</p>
            <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
              All patient reviews are stored securely and are accessible only to authorized MediBridge administrators.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}