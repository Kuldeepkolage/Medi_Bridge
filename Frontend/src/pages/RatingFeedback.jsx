import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function RatingFeedback() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ stars: 0, comment: "" });
  const [msg, setMsg] = useState("");
  const [ratings, setRatings] = useState([]);
  const [hovered, setHovered] = useState(0);
  const [filter, setFilter] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/ratings`)
      .then(res => res.json())
      .then(data => setRatings(data.data));
  }, [msg]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.stars) return;
    setMsg("Submitting...");
    try {
      const res = await fetch(`${API_URL}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg(t("thanksFeedback") || "Thanks for your feedback!");
      else setMsg(t("feedbackFailed") || "Failed. Try again.");
      setForm({ stars: 0, comment: "" });
    } catch {
      setMsg(t("serverError") || "Server error. Try later.");
    }
  }

  const starLabels = { 5: t("excellent") || "Excellent", 4: t("good") || "Good", 3: t("average") || "Average", 2: t("belowAverage") || "Below Average", 1: t("poor") || "Poor" };
  const starColors  = { 5:"#22c55e", 4:"#3b82f6", 3:"#f59e0b", 2:"#f97316", 1:"#ef4444" };
  const starBg      = { 5:"rgba(34,197,94,0.1)", 4:"rgba(59,130,246,0.1)", 3:"rgba(245,158,11,0.1)", 2:"rgba(249,115,22,0.1)", 1:"rgba(239,68,68,0.1)" };
  const badgeColors = { 5:"bg-green-500", 4:"bg-blue-500", 3:"bg-amber-500", 2:"bg-orange-500", 1:"bg-red-500" };

  const avg = ratings?.length ? (ratings.reduce((s,r) => s + Number(r.stars), 0) / ratings.length).toFixed(1) : null;
  const dist = [5,4,3,2,1].map(s => ({ star:s, count: ratings?.filter(r=>Number(r.stars)===s).length||0, pct: ratings?.length ? Math.round((ratings.filter(r=>Number(r.stars)===s).length/ratings.length)*100) : 0 }));
  const filtered = filter ? ratings?.filter(r=>Number(r.stars)===filter) : ratings;
  const positive = ratings?.filter(r=>Number(r.stars)>=4).length||0;
  const isSuccess = msg && (msg.includes("Thanks")||msg.includes("धन्यवाद")||msg.includes("आभार"));
  const avatarBgs = ["#2563eb","#7c3aed","#059669","#dc2626","#d97706","#0891b2","#be185d","#16a34a"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

        .ratings-page { font-family: 'DM Sans', 'Noto Sans Devanagari', sans-serif; }

        .ratings-hero-bg {
          background:
            radial-gradient(ellipse 80% 55% at 50% -5%, rgba(37,99,235,0.10) 0%, transparent 68%),
            radial-gradient(ellipse 40% 30% at 88% 20%, rgba(250,184,117,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 30% 40% at 8%  80%, rgba(59,130,246,0.06) 0%, transparent 55%);
        }
        .dark .ratings-hero-bg {
          background:
            radial-gradient(ellipse 80% 55% at 50% -5%, rgba(37,99,235,0.18) 0%, transparent 68%),
            radial-gradient(ellipse 40% 30% at 88% 20%, rgba(180,100,20,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 30% 40% at 8%  80%, rgba(37,99,235,0.08) 0%, transparent 55%);
        }

        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(4deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-3deg)} }
        .deco-a { animation: floatA 7s ease-in-out infinite; }
        .deco-b { animation: floatB 9s ease-in-out 1.5s infinite; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay:.05s } .fade-up-2 { animation-delay:.12s }
        .fade-up-3 { animation-delay:.19s } .fade-up-4 { animation-delay:.26s }
        .fade-up-5 { animation-delay:.33s } .fade-up-6 { animation-delay:.40s }

        @keyframes successPop { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
        .success-pop { animation: successPop 0.45s cubic-bezier(.22,1,.36,1) both; }

        .review-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .review-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.07); }
        .dark .review-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.30); }

        .dist-btn { transition: all 0.15s ease; }
        .dist-btn:hover { background: rgba(59,130,246,0.06); }

        .appt-input { transition: all 0.15s ease; }
        .appt-input:focus { outline:none; border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.15); }

        .btn-shine { position:relative; overflow:hidden; }
        .btn-shine::after { content:''; position:absolute; top:-50%; left:-75%; width:50%; height:200%; background:linear-gradient(to right,transparent,rgba(255,255,255,0.22),transparent); transform:skewX(-20deg); transition:left 0.55s ease; }
        .btn-shine:hover::after { left:125%; }

        .star-btn { background:none; border:none; cursor:pointer; padding:2px; transition:transform 0.12s ease; line-height:1; }
        .star-btn:hover { transform:scale(1.2); }

        .stat-number { font-family:'DM Serif Display',serif; font-size:1.75rem; line-height:1; }
      `}</style>

      <div className="ratings-page min-h-screen bg-gray-50 dark:bg-gray-950 ratings-hero-bg">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-12 px-4 overflow-hidden">
          <div className="absolute top-20 right-[6%] w-72 h-72 rounded-full bg-yellow-100 dark:bg-yellow-900/20 opacity-30 blur-3xl deco-a pointer-events-none" />
          <div className="absolute top-36 left-[4%] w-48 h-48 rounded-full bg-blue-200 dark:bg-blue-900/20 opacity-25 blur-2xl deco-b pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              {t("PATIENT STORIES") || "PATIENT STORIES"}
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
              style={{ fontFamily:"'DM Serif Display', serif" }}>
              <h1
  className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
  style={{ fontFamily: "'DM Serif Display', serif" }}
>
  Ratings &amp;<br />
  <span className="text-blue-600">Feedback</span>
</h1>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
              {t("ratingDesc") || "Share your experience and help thousands of patients choose the right dental care."}
            </p>

            {/* Stats row — mirrors awareness page */}
            {avg && (
              <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
                {[
                  { val: avg + "★", label: t("Avg Rating") || "Avg Rating" },
                  { val: ratings.length + "+", label: t("Total Reviews") || "Reviews" },
                  { val: ratings.length ? Math.round((positive/ratings.length)*100)+"%" : "—", label: t("Recommended") || "Recommend Us" },
                ].map(({ val, label }) => (
                  <div key={label} className="text-center">
                    <p className="stat-number font-bold text-gray-900 dark:text-white">{val}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── TRUST BANNER — mirrors awareness blue banner ──────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-7 text-white relative overflow-hidden shadow-xl shadow-blue-200 dark:shadow-blue-950">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 pointer-events-none" />
            <div className="relative z-10 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-1">
                  {t("trustNote") || "Transparency Promise"}
                </p>
                <h3 className="text-xl font-bold mb-2">
                  {t("Trust Title") || "Every review is real, unfiltered and from a verified patient"}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                  {t("Trust Desc") || "We never edit, remove or filter any feedback. What you read is exactly what our patients experienced at MediBridge Dental."}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white/15 rounded-2xl flex flex-col items-center justify-center text-center border border-white/20">
                  <span className="text-3xl">⭐</span>
                  <span className="text-xs font-semibold mt-1 text-blue-100">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN GRID ─────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">

            {/* ── LEFT SIDEBAR ── */}
            <div className="space-y-5">

              {/* Submit Form — same card style as appointment sidebar cards */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                {/* Blue top accent bar — same as awareness tip cards */}
                <div className="h-1 w-full bg-blue-600" />
                <div className="p-6">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base mb-0.5">
                    {t("leaveReview") || "Leave a Review"}
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                    {t("Review Subtitle") || "Your honest feedback helps us improve"}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star picker */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t("status") || "Your Rating"} <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" className="star-btn"
                            onMouseEnter={() => setHovered(s)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setForm(f => ({ ...f, stars: s }))}
                            style={{ transform: s <= (hovered||form.stars) ? "scale(1.2)" : "scale(1)" }}>
                            <svg width="30" height="30" viewBox="0 0 20 20"
                              fill={s <= (hovered||form.stars) ? "#f59e0b" : "none"}
                              stroke={s <= (hovered||form.stars) ? "#f59e0b" : "#d1d5db"}
                              strokeWidth="1.2">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                      {form.stars > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
                          style={{ background: starBg[form.stars], color: starColors[form.stars], borderColor: starColors[form.stars]+"33" }}>
                          {starLabels[form.stars]}
                        </span>
                      )}
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t("Your Comment") || "Your Comment"} <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.comment}
                        placeholder={t("Comment Placeholder") || "Tell us about your experience..."}
                        required
                        onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                        rows={4}
                        className="appt-input w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-xl text-sm resize-none"
                      />
                    </div>

                    <button type="submit" disabled={!form.stars}
                      className="btn-shine w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:shadow-lg text-sm">
                      {t("submitReview") || "Submit Review"}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </form>

                  {msg && (
                    <div className={`success-pop mt-4 flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
                      isSuccess
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                    }`}>
                      <span className="text-lg">{isSuccess ? "🎉" : "⚠️"}</span> {msg}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 mt-4">
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    {t("Privacy Note") || "Your data is never shared with third parties."}
                  </div>
                </div>
              </div>

              {/* Rating Breakdown — same card style */}
              {ratings?.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-5">
                    {t("Rating Breakdown") || "Rating Breakdown"}
                  </h3>
                  <div className="space-y-3">
                    {dist.map(({ star, count, pct }) => (
                      <button key={star} onClick={() => setFilter(filter===star ? 0 : star)}
                        className={`dist-btn w-full flex items-center gap-3 rounded-xl px-2 py-1.5 ${filter===star ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-3">{star}</span>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="#f59e0b" className="flex-shrink-0">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width:`${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 w-5 text-right">{count}</span>
                      </button>
                    ))}
                  </div>
                  {filter > 0 && (
                    <button onClick={() => setFilter(0)} className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      ← {t("showAll") || "Show all reviews"}
                    </button>
                  )}
                </div>
              )}

              {/* Trust points — same as "Why Book With Us" */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {t("Our Commitment") || "Our Commitment"}
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon:"✓", title: t("verifiedOnly")||"Verified Patients Only", sub: t("verifiedDesc")||"Every review is from a confirmed MediBridge patient." },
                    { icon:"✕", title: t("noFiltering")||"Never Edited or Removed", sub: t("noFilteringDesc")||"We publish all reviews, positive or critical." },
                    { icon:"↻", title: t("realTime")||"Updated in Real Time", sub: t("realTimeDesc")||"New feedback appears as soon as it's submitted." },
                  ].map(({ icon, title, sub }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="text-xl leading-none mt-0.5 flex-shrink-0">{icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: REVIEWS FEED ── */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg" style={{ fontFamily:"'DM Serif Display',serif" }}>
                  {filter ? `${starLabels[filter]} ${t("reviews")||"Reviews"}` : (t("latestFeedback")||"Latest Feedback")}
                </h2>
                {ratings?.length > 0 && (
                  <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">
                    {filtered?.length} {t("reviews")||"reviews"}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {(!filtered || filtered.length === 0) && (
                  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                    <p className="text-4xl mb-3">💬</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                      {t("noReviews")||"No reviews yet. Be the first!"}
                    </p>
                  </div>
                )}

                {filtered?.slice(0, 8).map((r, i) => {
                  const starN = Number(r.stars);
                  const initials = r.name
                    ? r.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()
                    : ["A","B","C","D","E","F","G","H"][i%8];

                  return (
                    <div key={i}
                      className={`review-card fade-up fade-up-${Math.min(i+1,6)} bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm`}>
                      {/* Colored top accent — exactly like awareness tip cards */}
                      <div className={`h-1 w-full ${badgeColors[starN]}`} />

                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ background: avatarBgs[i % avatarBgs.length] }}>
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                {r.name || (t("verifiedPatient")||"Verified Patient")}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <svg width="10" height="10" viewBox="0 0 20 20" fill="#2563eb">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                  {t("verifiedPatient")||"Verified Patient"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Star badge — mirrors awareness stat badges */}
                          <div className="text-right flex-shrink-0">
                            <div className="flex gap-0.5 justify-end mb-1">
                              {[...Array(5)].map((_,idx) => (
                                <svg key={idx} width="13" height="13" viewBox="0 0 20 20"
                                  fill={idx < starN ? "#f59e0b" : "none"}
                                  stroke={idx < starN ? "#f59e0b" : "#d1d5db"} strokeWidth="1.5">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs font-semibold" style={{ color: starColors[starN] }}>
                              {starLabels[starN]}
                            </span>
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          "{r.comment}"
                        </p>

                        {r.createdAt && (
                          <p className="text-[11px] text-gray-300 dark:text-gray-700 mt-3">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ── PRIVACY NOTICE — same as awareness page bottom ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
                {t("dataProtected")||"Patient Data Protected"}
              </p>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1 leading-relaxed">
                {t("dataProtectedDesc")||"All patient records and reviews are stored securely with end-to-end encryption as per our backend security protocols."}
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}