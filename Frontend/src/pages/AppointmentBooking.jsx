import React, { useState } from "react";
import { userAPI } from "../services/api";
import { Link } from "react-router-dom";

// ── Icons ────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES_CONFIG = [
  { value: "General Checkup",  emoji: "🦷", desc: "Complete oral exam & X-rays" },
  { value: "Teeth Cleaning",   emoji: "✨", desc: "Professional scaling & polish" },
  { value: "Root Canal",       emoji: "🔬", desc: "Pain-free endodontic therapy" },
  { value: "Tooth Extraction", emoji: "🩺", desc: "Safe & comfortable removal" },
  { value: "Braces",           emoji: "😁", desc: "Metal, ceramic or clear aligners" },
  { value: "Emergency Care",   emoji: "🚨", desc: "Same-day urgent treatment" },
];

const TIME_PERIODS = [
  { label: "Morning",   icon: "🌤", slots: ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM"] },
  { label: "Afternoon", icon: "🌅", slots: ["02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"] },
];

const TRUST_POINTS = [
  { icon: "⚡", title: "Instant Confirmation", sub: "Within 2 hours via call/SMS" },
  { icon: "🏅", title: "ISO Certified",        sub: "Highest hygiene standards" },
  { icon: "💎", title: "Zero Hidden Costs",    sub: "Transparent pricing always" },
  { icon: "👨‍⚕️", title: "Expert Dentists",    sub: "15+ years experience" },
];

const STEPS = ["Personal Info", "Choose Service", "Pick a Time"];

const PERKS = [
  { icon: "📅", label: "Book appointments online" },
  { icon: "📋", label: "View appointment history" },
  { icon: "🔄", label: "Reschedule appointments" },
  { icon: "⚡", label: "Faster future bookings" },
];

// ── Styles (shared) ──────────────────────────────────────────────────────────
const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .appt-page { font-family: 'DM Sans', sans-serif; }

  .appt-hero-bg {
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.10) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 85% 20%, rgba(147,197,253,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 30% 40% at 10% 80%, rgba(59,130,246,0.06) 0%, transparent 60%);
  }
  .dark .appt-hero-bg {
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 85% 20%, rgba(30,64,175,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 30% 40% at 10% 80%, rgba(37,99,235,0.08) 0%, transparent 60%);
  }

  @keyframes stepIn {
    from { opacity:0; transform: translateX(20px); }
    to   { opacity:1; transform: translateX(0); }
  }
  .step-panel { animation: stepIn 0.28s cubic-bezier(.22,1,.36,1) both; }

  .service-card { transition: all 0.18s ease; cursor: pointer; }
  .service-card:hover:not(.selected) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.10);
  }
  .service-card.selected {
    border-color: #2563eb;
    background: linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(147,197,253,0.06) 100%);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12), 0 8px 24px rgba(37,99,235,0.08);
    transform: translateY(-1px);
  }
  .dark .service-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(147,197,253,0.08) 100%);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.20), 0 8px 24px rgba(37,99,235,0.15);
  }

  .time-slot { transition: all 0.15s ease; cursor: pointer; }
  .time-slot:hover:not(.selected-time) {
    border-color: #93c5fd;
    background: rgba(219,234,254,0.5);
    transform: translateY(-1px);
  }
  .dark .time-slot:hover:not(.selected-time) {
    background: rgba(37,99,235,0.15);
    border-color: #3b82f6;
  }
  .time-slot.selected-time {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
  }

  .appt-input { transition: all 0.15s ease; }
  .appt-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  .btn-shine { position: relative; overflow: hidden; }
  .btn-shine::after {
    content: '';
    position: absolute;
    top: -50%; left: -75%;
    width: 50%; height: 200%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent);
    transform: skewX(-20deg);
    transition: left 0.55s ease;
  }
  .btn-shine:hover::after { left: 125%; }

  @keyframes successPop {
    0%   { opacity:0; transform: scale(0.7); }
    70%  { transform: scale(1.05); }
    100% { opacity:1; transform: scale(1); }
  }
  .success-pop { animation: successPop 0.45s cubic-bezier(.22,1,.36,1) both; }

  .deco-circle  { animation: decoFloat 6s ease-in-out infinite; }
  .deco-circle2 { animation: decoFloat 8s ease-in-out 2s infinite; }
  @keyframes decoFloat {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-12px) rotate(3deg); }
  }

  @keyframes gateIn {
    from { opacity:0; transform: translateY(24px) scale(0.98); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
  .gate-card { animation: gateIn 0.45s cubic-bezier(.22,1,.36,1) both; }

  @keyframes perkIn {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }
  .perk-item { animation: perkIn 0.35s cubic-bezier(.22,1,.36,1) both; }
  .perk-item:nth-child(1) { animation-delay: 0.10s; }
  .perk-item:nth-child(2) { animation-delay: 0.18s; }
  .perk-item:nth-child(3) { animation-delay: 0.26s; }
  .perk-item:nth-child(4) { animation-delay: 0.34s; }
`;

// ── Login Gate ────────────────────────────────────────────────────────────────
function LoginGate() {
  return (
    <>
      <style>{SHARED_STYLES}</style>
      <div className="appt-page min-h-screen bg-gray-50 dark:bg-gray-950 appt-hero-bg overflow-hidden">

        {/* Floating blobs */}
        <div className="absolute top-32 right-[8%] w-72 h-72 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-35 blur-3xl deco-circle pointer-events-none" />
        <div className="absolute top-56 left-[4%] w-44 h-44 rounded-full bg-sky-200 dark:bg-blue-800/20 opacity-25 blur-2xl deco-circle2 pointer-events-none" />

        {/* ── Hero label ── */}
        <section className="relative pt-20 pb-10 px-4 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            BOOK ONLINE · Confirmed within 2 hours
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Book Your<br /><span className="text-blue-600">Appointment</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
            Skip the queue. Pick your slot and we'll confirm instantly.
          </p>
        </section>

        {/* ── Gate layout ── */}
        <section className="max-w-5xl mx-auto px-4 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

            {/* LEFT — Auth card */}
            <div className="gate-card bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl">
                    🔐
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to continue</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">A free account lets you manage all your visits</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-7">
                {/* Perks list */}
                <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-4">What you get</p>
                <div className="space-y-3 mb-8">
                  {PERKS.map(({ icon, label }) => (
                    <div key={label} className="perk-item flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                        {icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                      <div className="ml-auto w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/login"
                    state={{ from: "/appointment" }}
                    className="btn-shine flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:shadow-lg text-sm"
                  >
                    Login to my account
                    <ArrowRightIcon />
                  </Link>
                  <Link
                    to="/register"
                    state={{ from: "/appointment" }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    Create free account
                  </Link>
                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
                  No credit card required · Free forever
                </p>
              </div>

              {/* Emergency strip */}
              <div className="px-8 pb-8">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚨</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Dental emergency?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">24/7 immediate support</p>
                    </div>
                  </div>
                  <a
                    href="tel:+919511936441"
                    className="btn-shine flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <PhoneIcon />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT — Sidebar (same as booking page) */}
            <div className="space-y-4">

              {/* Trust card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <CheckCircleIcon />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Why Book With Us?</h3>
                </div>
                <div className="space-y-4">
                  {TRUST_POINTS.map(({ icon, title, sub }) => (
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

              {/* Social proof */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 dark:shadow-blue-950 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex mb-4">
                    {["P","R","A","S","M"].map((l, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-blue-500 -ml-2 first:ml-0 flex items-center justify-center text-white text-xs font-bold ${["bg-teal-500","bg-indigo-400","bg-sky-400","bg-violet-400","bg-emerald-500"][i]}`}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="font-bold text-lg mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    30,000+ patients trust us
                  </p>
                  <div className="flex items-center gap-1 text-yellow-300 text-sm">
                    {"★★★★★"} <span className="text-blue-200 ml-1 text-xs font-normal">4.9 / 5 rating</span>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🕘</span> Clinic Hours
                </p>
                <div className="space-y-2.5">
                  {[
                    { day: "Mon – Fri", time: "9:00 AM – 5:00 PM", open: true },
                    { day: "Saturday",  time: "9:00 AM – 5:00 PM", open: true },
                    { day: "Sunday",    time: "Emergency Only",     open: false },
                  ].map(({ day, time, open }) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{day}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${open ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"}`}>
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// ── Main booking page ─────────────────────────────────────────────────────────
export default function AppointmentBooking() {
  const [form, setForm]       = useState({ name: "", phone: "", date: "", time: "", service: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep]       = useState(0);

  const isAuth = !!localStorage.getItem("token");
  if (!isAuth) return <LoginGate />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const response = await userAPI.createAppointment(form);
      if (response.data.success) {
        setSuccess(true);
        setMessage("Appointment booked successfully!");
        setForm({ name: "", phone: "", date: "", time: "", service: "" });
        setStep(0);
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep0 = form.name.trim().length > 1 && form.phone.trim().length >= 8 && form.date;
  const canProceedStep1 = !!form.service;
  const canProceedStep2 = !!form.time;
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <style>{SHARED_STYLES}</style>
      <div className="appt-page min-h-screen bg-gray-50 dark:bg-gray-950 appt-hero-bg overflow-hidden">

        {/* Blobs */}
        <div className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-40 blur-3xl deco-circle pointer-events-none" />
        <div className="absolute top-40 left-[5%] w-40 h-40 rounded-full bg-sky-200 dark:bg-blue-800/20 opacity-30 blur-2xl deco-circle2 pointer-events-none" />

        {/* Hero */}
        <section className="relative pt-20 pb-10 px-4">
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              BOOK ONLINE · Confirmed within 2 hours
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Book Your<br /><span className="text-blue-600">Appointment</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
              Skip the queue. Fill in the form, pick your slot, and we'll confirm instantly.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex">
                  {["bg-blue-500","bg-teal-500","bg-indigo-500","bg-sky-500"].map((c,i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white dark:border-gray-950 -ml-2 first:ml-0 flex items-center justify-center text-white text-[10px] font-bold`}>
                      {["P","R","A","S"][i]}
                    </div>
                  ))}
                </div>
                <span className="ml-1 font-medium">30K+ happy patients</span>
              </div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
                ★★★★★ <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">4.9 rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* Form card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">

              {/* Progress header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-5">
                  {STEPS.map((label, i) => (
                    <React.Fragment key={i}>
                      <button
                        onClick={() => i < step && setStep(i)}
                        className={`flex items-center gap-2 transition-colors ${i <= step ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          i < step  ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900"
                          : i === step ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900 ring-4 ring-blue-100 dark:ring-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                        }`}>
                          {i < step ? "✓" : i + 1}
                        </div>
                        <span className={`hidden sm:block text-sm font-medium transition-colors ${i === step ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"}`}>
                          {label}
                        </span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 mx-3 h-px bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 bg-blue-500 transition-all duration-500 ${i < step ? "w-full" : "w-0"}`} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase">Step {step + 1} of {STEPS.length}</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {step === 0 && "Your Details"}
                  {step === 1 && "Choose a Service"}
                  {step === 2 && "Select a Time Slot"}
                </h2>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit}>
                <div className="px-8 py-7">

                  {/* Step 0 */}
                  {step === 0 && (
                    <div className="step-panel space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon /></div>
                          <input type="text" name="name" value={form.name} onChange={handleChange}
                            placeholder="e.g. Rahul Sharma / राहुल शर्मा" required
                            className="appt-input w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><PhoneIcon /></div>
                          <input type="text" name="phone" value={form.phone} onChange={handleChange}
                            placeholder="+91 95119 36441" required
                            className="appt-input w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preferred Date <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><CalendarIcon /></div>
                          <input type="date" name="date" value={form.date} onChange={handleChange} min={today} required
                            className="appt-input w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm [color-scheme:light] dark:[color-scheme:dark]" />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1.5 ml-1">We're open 7 days a week, 9 AM – 5 PM</p>
                      </div>
                      <button type="button" disabled={!canProceedStep0} onClick={() => setStep(1)}
                        className="btn-shine w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50">
                        Continue to Service <ArrowRightIcon />
                      </button>
                    </div>
                  )}

                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="step-panel">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SERVICES_CONFIG.map(({ value, emoji, desc }) => (
                          <button type="button" key={value} onClick={() => setForm({ ...form, service: value })}
                            className={`service-card text-left p-4 rounded-2xl border-2 ${form.service === value ? "selected border-blue-500" : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"}`}>
                            <div className="flex items-start gap-3">
                              <span className="text-2xl leading-none mt-0.5">{emoji}</span>
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold leading-tight ${form.service === value ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}`}>{value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 leading-snug">{desc}</p>
                              </div>
                              {form.service === value && (
                                <div className="ml-auto flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setStep(0)}
                          className="flex-1 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                          ← Back
                        </button>
                        <button type="button" disabled={!canProceedStep1} onClick={() => setStep(2)}
                          className="btn-shine flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 text-sm">
                          Pick a Time Slot <ArrowRightIcon />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="step-panel">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[
                          { icon: "📅", val: form.date ? new Date(form.date + "T00:00:00").toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "" },
                          { icon: "🦷", val: form.service },
                        ].filter(x => x.val).map(({ icon, val }) => (
                          <span key={val} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800">
                            {icon} {val}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-5">
                        {TIME_PERIODS.map(({ label, icon, slots }) => (
                          <div key={label}>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <span>{icon}</span> {label}
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {slots.map((slot) => (
                                <button type="button" key={slot} onClick={() => setForm({ ...form, time: slot })}
                                  className={`time-slot py-2.5 px-1 border-2 rounded-xl text-sm font-semibold text-center ${form.time === slot ? "selected-time" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"}`}>
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setStep(1)}
                          className="flex-1 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                          ← Back
                        </button>
                        <button type="submit" disabled={!canProceedStep2 || loading}
                          className="btn-shine flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 text-sm">
                          {loading ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              Booking...
                            </>
                          ) : <>Confirm Appointment <ArrowRightIcon /></>}
                        </button>
                      </div>
                    </div>
                  )}

                  {message && (
                    <div className={`mt-5 flex items-center gap-3 p-4 rounded-xl border text-sm font-medium success-pop ${
                      success
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                    }`}>
                      <span className="text-lg">{success ? "🎉" : "⚠️"}</span>
                      {message}
                    </div>
                  )}
                </div>

                <div className="px-8 pb-7 pt-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Your information is encrypted and never shared with third parties.
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white"><CheckCircleIcon /></div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Why Book With Us?</h3>
                </div>
                <div className="space-y-4">
                  {TRUST_POINTS.map(({ icon, title, sub }) => (
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

              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 border border-red-100 dark:border-red-900/50 rounded-3xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Need Immediate Help?</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">24/7 Emergency support available</p>
                  </div>
                </div>
                <a href="tel:+919511936441"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm hover:shadow-md">
                  <PhoneIcon /> Call +91 95119 36441
                </a>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Visit Our Clinic</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 leading-relaxed">Maulana Azad Road, Vasai West,<br />Maharashtra 401201</p>
                  </div>
                </div>
                <a href="https://maps.google.com/?q=Vasai+West+Maharashtra" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors mt-3">
                  Get Directions →
                </a>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><span>🕘</span> Clinic Hours</p>
                <div className="space-y-2.5">
                  {[
                    { day: "Mon – Fri", time: "9:00 AM – 5:00 PM", open: true },
                    { day: "Saturday",  time: "9:00 AM – 3:00 PM", open: true },
                    { day: "Sunday",    time: "Emergency Only",     open: false },
                  ].map(({ day, time, open }) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{day}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${open ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"}`}>
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}