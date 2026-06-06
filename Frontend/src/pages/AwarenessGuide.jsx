import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

function AwarenessGuide() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const tips = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      emoji: "🪥",
      title: t("tip1Title") || "Brush Twice Daily",
      desc: t("tip1Desc") || "Use fluoride toothpaste and brush for at least 2 minutes, morning and night.",
      color: "blue",
      category: "daily",
      stat: "2 min",
      statLabel: "per session",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      emoji: "🍬",
      title: t("tip2Title") || "Reduce Sugar Intake",
      desc: t("tip2Desc") || "Cut down on sugary foods and drinks to prevent tooth decay and cavities.",
      color: "red",
      category: "diet",
      stat: "90%",
      statLabel: "of cavities preventable",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      emoji: "🗓️",
      title: t("tip3Title") || "Regular Checkups",
      desc: t("tip3Desc") || "Visit your dentist every 6 months for a professional cleaning and examination.",
      color: "green",
      category: "checkup",
      stat: "2×",
      statLabel: "per year",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      emoji: "🥊",
      title: t("tip4Title") || "Wear a Mouthguard",
      desc: t("tip4Desc") || "Protect your teeth during contact sports with a proper-fitting mouthguard.",
      color: "orange",
      category: "protection",
      stat: "99%",
      statLabel: "injury prevention",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      emoji: "💊",
      title: t("tip5Title") || "Follow Post-Treatment Care",
      desc: t("tip5Desc") || "Always follow your dentist's advice after any dental procedure for best results.",
      color: "purple",
      category: "checkup",
      stat: "48h",
      statLabel: "critical recovery",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      emoji: "🧵",
      title: t("tip6Title") || "Floss Daily",
      desc: t("tip6Desc") || "Flossing removes plaque from areas your toothbrush can't reach between teeth.",
      color: "teal",
      category: "daily",
      stat: "40%",
      statLabel: "more effective",
    },
  ];

  const faqs = [
    {
      q: "How often should I replace my toothbrush?",
      a: "Every 3–4 months, or sooner if the bristles are frayed. A worn toothbrush won't clean your teeth properly.",
    },
    {
      q: "Is teeth whitening safe?",
      a: "Yes, when done professionally or with dentist-approved products. Avoid overuse of DIY kits, which can cause sensitivity.",
    },
    {
      q: "At what age should children first see a dentist?",
      a: "By their first birthday or within 6 months of their first tooth appearing — whichever comes first.",
    },
    {
      q: "What causes bad breath and how can I prevent it?",
      a: "Most bad breath is caused by bacteria on the tongue and between teeth. Brushing, flossing, tongue scraping, and staying hydrated all help.",
    },
  ];

  const colorMap = {
    blue:   { icon: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/30",   border: "border-blue-100 dark:border-blue-800/60",   stat: "text-blue-600 dark:text-blue-400",   badge: "bg-blue-600" },
    red:    { icon: "text-red-500 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/30",     border: "border-red-100 dark:border-red-800/60",     stat: "text-red-500 dark:text-red-400",     badge: "bg-red-500" },
    green:  { icon: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30", border: "border-green-100 dark:border-green-800/60", stat: "text-green-600 dark:text-green-400", badge: "bg-green-600" },
    orange: { icon: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30", border: "border-orange-100 dark:border-orange-800/60", stat: "text-orange-500 dark:text-orange-400", badge: "bg-orange-500" },
    purple: { icon: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-100 dark:border-purple-800/60", stat: "text-purple-600 dark:text-purple-400", badge: "bg-purple-600" },
    teal:   { icon: "text-teal-600 dark:text-teal-400",   bg: "bg-teal-50 dark:bg-teal-900/30",   border: "border-teal-100 dark:border-teal-800/60",   stat: "text-teal-600 dark:text-teal-400",   badge: "bg-teal-600" },
  };

  const categories = [
    { id: "all", label: "All Tips" },
    { id: "daily", label: "Daily Habits" },
    { id: "diet", label: "Diet" },
    { id: "checkup", label: "Checkups" },
    { id: "protection", label: "Protection" },
  ];

  const filtered = activeCategory === "all" ? tips : tips.filter(t => t.category === activeCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .aware-page { font-family: 'DM Sans', sans-serif; }

        .aware-hero-bg {
          background:
            radial-gradient(ellipse 70% 50% at 50% -5%, rgba(37,99,235,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 35% 25% at 90% 30%, rgba(94,234,212,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 25% 35% at 5% 75%, rgba(59,130,246,0.05) 0%, transparent 55%);
        }
        .dark .aware-hero-bg {
          background:
            radial-gradient(ellipse 70% 50% at 50% -5%, rgba(37,99,235,0.16) 0%, transparent 65%),
            radial-gradient(ellipse 35% 25% at 90% 30%, rgba(20,184,166,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 25% 35% at 5% 75%, rgba(37,99,235,0.07) 0%, transparent 55%);
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.19s; }
        .fade-up-4 { animation-delay: 0.26s; }
        .fade-up-5 { animation-delay: 0.33s; }
        .fade-up-6 { animation-delay: 0.40s; }

        .tip-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .tip-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.07);
        }
        .dark .tip-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.30);
        }

        .cat-btn {
          transition: all 0.15s ease;
        }

        .faq-item {
          transition: all 0.2s ease;
        }

        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        .deco-a { animation: floatA 7s ease-in-out infinite; }
        .deco-b { animation: floatB 9s ease-in-out 1.5s infinite; }

        .progress-bar-inner { transition: width 0.6s cubic-bezier(.22,1,.36,1); }

        .stat-number {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          line-height: 1;
        }
      `}</style>

      <div className="aware-page min-h-screen bg-gray-50 dark:bg-gray-950 aware-hero-bg">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-12 px-4 overflow-hidden">
          <div className="absolute top-20 right-[6%] w-72 h-72 rounded-full bg-teal-100 dark:bg-teal-900/20 opacity-30 blur-3xl deco-a pointer-events-none" />
          <div className="absolute top-36 left-[4%] w-48 h-48 rounded-full bg-blue-200 dark:bg-blue-900/20 opacity-25 blur-2xl deco-b pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-teal-100 dark:border-teal-800 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide mb-5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
              {t("dentalHealthGuide") || "DENTAL HEALTH GUIDE"}
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              <h1
  className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
  style={{ fontFamily: "'DM Serif Display', serif" }}
>
  Dental Awareness<br />
  <span className="text-blue-600">Guidelines</span>
</h1>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
              {t("awarenessDesc") || "Simple habits that protect your smile for a lifetime. Follow these expert-recommended tips."}
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
              {[
                { val: "6+", label: "Expert Tips" },
                { val: "15+", label: "Years Experience" },
                { val: "30K+", label: "Patients Helped" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="stat-number font-bold text-gray-900 dark:text-white">{val}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ORAL HEALTH SCORE BANNER ──────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-7 text-white relative overflow-hidden shadow-xl shadow-blue-200 dark:shadow-blue-950">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 pointer-events-none" />
            <div className="relative z-10 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-1">Did You Know?</p>
                <h3 className="text-xl font-bold mb-2">Poor oral health is linked to 3× higher risk of heart disease</h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                  Gum disease bacteria can enter the bloodstream and affect your cardiovascular system. A healthy mouth is the foundation of a healthy body.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white/15 rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/20">
                  <span className="text-3xl">🦷</span>
                  <span className="text-xs font-semibold mt-1 text-blue-100">Your health</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TIPS SECTION ──────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-12">

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-7 flex-wrap">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`cat-btn px-4 py-2 rounded-full text-sm font-semibold border ${
                  activeCategory === id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200 dark:shadow-blue-900"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-600 font-medium">{filtered.length} tips</span>
          </div>

          {/* Tips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filtered.map((tip, i) => {
              const c = colorMap[tip.color];
              return (
                <div
                  key={tip.title}
                  className={`tip-card fade-up fade-up-${i + 1} bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm`}
                >
                  {/* Card top accent */}
                  <div className={`h-1 w-full ${c.badge}`} />

                  <div className="p-6">
                    {/* Icon + stat row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center ${c.icon}`}>
                        {tip.icon}
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${c.stat}`} style={{ fontFamily: "'DM Serif Display', serif" }}>
                          {tip.stat}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 leading-tight">{tip.statLabel}</p>
                      </div>
                    </div>

                    {/* Emoji large */}
                    <div className="text-3xl mb-3">{tip.emoji}</div>

                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 leading-tight">{tip.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Habit Tracker Visual ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-7 mb-10 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Daily Oral Health Checklist</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">How much of your oral health routine are you completing?</p>
            <div className="space-y-4">
              {[
                { label: "Brush morning & night", pct: 85, color: "bg-blue-500" },
                { label: "Floss once a day", pct: 42, color: "bg-teal-500" },
                { label: "Use mouthwash", pct: 58, color: "bg-purple-500" },
                { label: "Visit dentist twice a year", pct: 33, color: "bg-green-500" },
                { label: "Replace toothbrush every 3 months", pct: 61, color: "bg-orange-400" },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-500">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full progress-bar-inner`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">*Based on average patient self-reports at MediBridge Dental.</p>
          </div>

          {/* ── FAQ ── */}
          <div className="mb-10">
            <h3
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Common Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 pr-4">{faq.q}</span>
                    <div className={`w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${expandedFaq === i ? "rotate-45" : ""}`}>
                      <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-6 pb-5 border-t border-gray-50 dark:border-gray-800 pt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Privacy Notice ── */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
                {t("dataProtected") || "Patient Data Protected"}
              </p>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1 leading-relaxed">
                {t("dataProtectedDesc") || "All patient records are stored securely with end-to-end encryption as per our backend security protocols."}
              </p>
            </div>
          </div>

        </section>
      </div>
    </>
  );
}

export default AwarenessGuide;