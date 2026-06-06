import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg(t("messageSent") || "Message sent!");
      else setMsg(t("messageFailed") || "Failed. Try again.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setMsg(t("serverError") || "Server error. Try later.");
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = msg && (
    msg.includes("sent") || msg.includes("भेज") || msg.includes("पाठव") || msg.includes("!")
  ) && !msg.includes("Failed") && !msg.includes("error") && !msg.includes("Error");

  const CONTACT_CARDS = [
    {
      id: "location",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: "blue",
      topBar: "bg-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      label: t("clinicAddress") || "Clinic Address",
      content: (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
          Maulana Azad Road, Holi Bazaar Gharat Wadi,<br />
          Vasai West, Maharashtra 401201
        </p>
      ),
      action: (
        <a
          href="https://maps.google.com/?q=Vasai+West+Maharashtra"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors mt-3"
        >
          Get Directions →
        </a>
      ),
    },
    {
      id: "phone",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      accent: "green",
      topBar: "bg-green-500",
      iconBg: "bg-green-50 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      label: t("phoneNumber") || "Phone Number",
      content: (
        <a
          href="tel:+919511936441"
          className="text-gray-500 dark:text-gray-400 text-sm mt-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
        >
          +91 95119 36441
        </a>
      ),
      action: (
        <a
          href="tel:+919511936441"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 dark:text-green-400 transition-colors mt-3"
        >
          Call Now →
        </a>
      ),
    },
    {
      id: "hours",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "orange",
      topBar: "bg-orange-400",
      iconBg: "bg-orange-50 dark:bg-orange-900/30",
      iconColor: "text-orange-500 dark:text-orange-400",
      label: t("workingHours") || "Working Hours",
      content: (
        <div className="space-y-2 mt-2">
          {[
            { day: "Mon – Fri", time: "9:00 AM – 5:00 PM", open: true },
            { day: "Saturday",  time: "9:00 AM – 5:00 PM", open: true },
            { day: "Sunday",    time: "Emergency Only", open: false },
          ].map(({ day, time, open }) => (
            <div key={day} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{day}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                open
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
              }`}>
                {time}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "email",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      accent: "purple",
      topBar: "bg-purple-500",
      iconBg: "bg-purple-50 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      label: "Email Us",
      content: (
        <a
          href="mailto:kolagekuldeep09@gmail.com"
          className="text-gray-500 dark:text-gray-400 text-sm mt-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
        >
          kolagekuldeep09@gmail.com
        </a>
      ),
      action: (
        <a
          href="mailto:kolagekuldeep09@gmail.com"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 transition-colors mt-3"
        >
          Send Email →
        </a>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

        .contact-page { font-family: 'DM Sans', 'Noto Sans Devanagari', sans-serif; }

        .contact-hero-bg {
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 85% 20%, rgba(147,197,253,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 10% 80%, rgba(59,130,246,0.06) 0%, transparent 60%);
        }
        .dark .contact-hero-bg {
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 85% 20%, rgba(30,64,175,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 10% 80%, rgba(37,99,235,0.08) 0%, transparent 60%);
        }

        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(4deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-3deg)} }
        .deco-a { animation: floatA 7s ease-in-out infinite; }
        .deco-b { animation: floatB 9s ease-in-out 1.5s infinite; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay:.05s } .fade-up-2 { animation-delay:.12s }
        .fade-up-3 { animation-delay:.19s } .fade-up-4 { animation-delay:.26s }

        @keyframes successPop { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
        .success-pop { animation: successPop 0.45s cubic-bezier(.22,1,.36,1) both; }

        .contact-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .contact-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.07);
        }
        .dark .contact-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.30);
        }

        .appt-input { transition: all 0.15s ease; }
        .appt-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        .btn-shine { position:relative; overflow:hidden; }
        .btn-shine::after {
          content:''; position:absolute; top:-50%; left:-75%;
          width:50%; height:200%;
          background:linear-gradient(to right,transparent,rgba(255,255,255,0.22),transparent);
          transform:skewX(-20deg); transition:left 0.55s ease;
        }
        .btn-shine:hover::after { left:125%; }

        .stat-number { font-family:'DM Serif Display',serif; font-size:1.75rem; line-height:1; }

        .whatsapp-btn {
          background: #25d366;
          transition: all 0.2s ease;
        }
        .whatsapp-btn:hover {
          background: #1ebe57;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,211,102,0.35);
        }
      `}</style>

      <div className="contact-page min-h-screen bg-gray-50 dark:bg-gray-950 contact-hero-bg overflow-hidden">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-10 px-4 overflow-hidden">
          <div className="absolute top-20 right-[6%] w-72 h-72 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-40 blur-3xl deco-a pointer-events-none" />
          <div className="absolute top-36 left-[4%] w-48 h-48 rounded-full bg-sky-200 dark:bg-blue-800/20 opacity-30 blur-2xl deco-b pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              GET IN TOUCH · We respond within 2 hours
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              <h1
  className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
  style={{ fontFamily: "'DM Serif Display', serif" }}
>
  Get In<br />
  <span className="text-blue-600">Touch</span>
</h1>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
              {t("contactDesc") || "Have a question or need help? Our team is ready to assist you every step of the way."}
            </p>

            {/* Stats row — same as awareness/appointment pages */}
            <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
              {[
                { val: "2h",   label: "Avg Response Time" },
                { val: "24/7", label: "Emergency Support" },
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

        {/* ── TRUST BANNER — same blue gradient as awareness/ratings pages ── */}
        <section className="max-w-5xl mx-auto px-4 mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-7 text-white relative overflow-hidden shadow-xl shadow-blue-200 dark:shadow-blue-950">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 pointer-events-none" />
            <div className="relative z-10 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-1">Our Promise</p>
                <h3 className="text-xl font-bold mb-2">We're here when you need us most — day or night</h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                  Whether it's a routine query or a dental emergency, our team of experts is just a call or message away. No long waits, no runaround.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white/15 rounded-2xl flex flex-col items-center justify-center text-center border border-white/20">
                  <span className="text-3xl">💬</span>
                  <span className="text-xs font-semibold mt-1 text-blue-100">Always On</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* ── CONTACT FORM CARD ── */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Blue top accent bar — same as tip/review cards */}
              <div className="h-1 w-full bg-blue-600" />

              <div className="px-8 pt-7 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">
                    {t("sendMessage") || "Send a Message"}
                  </h2>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 ml-9">
                  Fill the form below and we'll get back to you within 2 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} autoComplete="off" className="px-8 py-7 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t("fullName") || "Full Name"} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      name="name"
                      value={form.name}
                      placeholder="e.g. Rahul Sharma / राहुल शर्मा"
                      required
                      onChange={handleChange}
                      className="appt-input w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t("emailAddress") || "Email Address"} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      placeholder="you@example.com"
                      required
                      onChange={handleChange}
                      className="appt-input w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t("yourMessage") || "Your Message"} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    placeholder="How can we help you? / आम्ही तुम्हाला कशी मदत करू शकतो?"
                    required
                    onChange={handleChange}
                    rows={5}
                    className="appt-input w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shine w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:shadow-lg text-sm"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      {t("sendMessage") || "Send Message"}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                {msg && msg !== "Sending..." && (
                  <div className={`success-pop flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
                    isSuccess
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                  }`}>
                    <span className="text-lg">{isSuccess ? "🎉" : "⚠️"}</span>
                    {msg}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 pt-1">
                  <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your information is encrypted and never shared with third parties.
                </div>
              </form>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="space-y-4">

              {/* Contact Info Cards */}
              {CONTACT_CARDS.map((card, i) => (
                <div
                  key={card.id}
                  className={`contact-card fade-up fade-up-${i + 1} bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm`}
                >
                  <div className={`h-1 w-full ${card.topBar}`} />
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconColor}`}>
                        {card.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {card.label}
                        </p>
                        {card.content}
                        {card.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Emergency CTA — same as appointment page */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 border border-red-100 dark:border-red-900/50 rounded-3xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {t("dentalEmergency") || "Dental Emergency?"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {t("emergencyDesc") || "We provide 24/7 emergency dental care."}
                    </p>
                  </div>
                </div>
                <a
                  href="tel:+919511936441"
                  className="btn-shine flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm hover:shadow-red-200 dark:hover:shadow-red-900/50 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t("callEmergencyLine") || "Call Emergency Line"}
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919511936441"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn flex items-center justify-center gap-2 w-full py-3 mt-2.5 text-white font-semibold rounded-xl text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>

              {/* Why Contact Us trust card — mirrors "Why Book With Us" */}
            
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Why Reach Out?</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: "⚡", title: "Quick Response", sub: "We reply within 2 hours on all channels" },
                    { icon: "🏅", title: "Expert Advice", sub: "Talk directly to our dental specialists" },
                    { icon: "🔒", title: "Confidential", sub: "Your information is always kept private" },
                    { icon: "🌐", title: "Multilingual", sub: "We speak English, Hindi & Marathi" },
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
          </div>
        </section>

        {/* ── PRIVACY NOTICE — same as awareness & ratings pages ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
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
                {t("dataProtectedDesc") || "All messages and patient records are stored securely with end-to-end encryption as per our backend security protocols."}
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default ContactPage;