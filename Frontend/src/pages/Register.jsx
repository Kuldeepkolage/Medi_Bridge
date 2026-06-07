import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("Registering...");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Registered! Please login.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMsg(data.message || "Register failed.");
        setLoading(false);
      }
    } catch {
      setMsg("Error registering!");
      setLoading(false);
    }
  }

  const isSuccess = msg.includes("Registered");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .auth-root { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay: .06s; }
        .fade-up-2 { animation-delay: .13s; }
        .fade-up-3 { animation-delay: .20s; }
        .fade-up-4 { animation-delay: .27s; }
        .fade-up-5 { animation-delay: .34s; }
        .fade-up-6 { animation-delay: .41s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(1deg); }
          66%       { transform: translateY(-5px) rotate(-1deg); }
        }
        .float { animation: float 6s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }

        .auth-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.875rem;
          font-size: 0.875rem;
          color: #1e293b;
          background: #f8fafc;
          outline: none;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }

        .auth-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.4rem;
          letter-spacing: 0.01em;
        }

        .auth-btn {
          width: 100%;
          padding: 0.8125rem 1rem;
          background: #2563eb;
          color: white;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(37,99,235,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .auth-btn:hover:not(:disabled) {
          background: #1d4ed8;
          box-shadow: 0 6px 22px rgba(37,99,235,0.45);
          transform: translateY(-1px);
        }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Left panel gradient */
        .auth-left {
          background: linear-gradient(135deg, #0f1623 0%, #1a2540 50%, #0f1e38 100%);
        }

        /* Grid pattern overlay */
        .grid-overlay {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* Feature list item */
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
        }
        .feature-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }
      `}</style>

      <div className="auth-root min-h-screen flex">

        {/* ── LEFT PANEL ── */}
        <div className="auth-left grid-overlay hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-10 relative overflow-hidden">

          {/* Glow blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.55)" }}>
                <svg style={{ width: 20, height: 20 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">MediBridge</p>
                <p className="text-slate-500 text-xs">Dental Care Platform</p>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-10">
            <div className="float mb-10">
              <div className="bg-white/8 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">What you get</p>
                <div className="divide-y divide-white/5">
                  {[
                    { icon: "📅", bg: "bg-blue-600/20", label: "Book appointments", sub: "Schedule visits in seconds" },
                    { icon: "🦷", bg: "bg-green-600/20", label: "Expert dental care", sub: "Qualified professionals" },
                    { icon: "⭐", bg: "bg-yellow-500/20", label: "Leave reviews", sub: "Share your experience" },
                    { icon: "🚑", bg: "bg-red-600/20",  label: "Emergency support", sub: "24/7 urgent assistance" },
                  ].map(({ icon, bg, label, sub }) => (
                    <div key={label} className="feature-item">
                      <div className={`feature-icon ${bg}`}>
                        <span className="text-base">{icon}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-white font-bold text-3xl leading-snug mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Join thousands of<br />
              <span className="text-blue-400">happy patients.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Create your free account and start managing your dental health with ease.
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" style={{ boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
              <span className="text-slate-500 text-xs">All systems operational</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">

          {/* Mobile brand */}
          <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center"
              style={{ boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}>
              <svg style={{ width: 16, height: 16 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-gray-800 font-bold text-sm">MediBridge</span>
          </div>

          <div className="w-full max-w-[420px]">

            {/* Card */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 fade-up fade-up-1">
              <div className="h-1 w-full bg-blue-600" />
              <div className="p-8">

                {/* Header */}
                <div className="mb-6 fade-up fade-up-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    Free Account
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight"
                    style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Create account
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">Join MediBridge Dental today</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 fade-up fade-up-3">
                    <div>
                      <label className="auth-label">Full Name</label>
                      <input name="fullName" type="text" placeholder="John Doe"
                        value={form.fullName} required onChange={handleChange} className="auth-input" />
                    </div>
                    <div>
                      <label className="auth-label">Username</label>
                      <input name="username" type="text" placeholder="johndoe"
                        value={form.username} required onChange={handleChange} className="auth-input" />
                    </div>
                  </div>

                  <div className="fade-up fade-up-4">
                    <label className="auth-label">Email Address</label>
                    <input name="email" type="email" placeholder="you@example.com"
                      value={form.email} required onChange={handleChange} className="auth-input" />
                  </div>

                  <div className="fade-up fade-up-5">
                    <label className="auth-label">Password</label>
                    <input name="password" type="password" placeholder="Create a strong password"
                      value={form.password} required onChange={handleChange} className="auth-input" />
                  </div>

                  <div className="fade-up fade-up-6 pt-1">
                    <button type="submit" disabled={loading} className="auth-btn">
                      {loading ? (
                        <svg className="w-4 h-4 spinner" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      )}
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                  </div>
                </form>

                {/* Feedback */}
                {msg && (
                  <div className={`mt-4 p-3 rounded-xl text-center text-xs font-semibold border ${
                    isSuccess
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {msg}
                  </div>
                )}

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-300 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Sign in</a>
                </p>
              </div>
            </div>

            <p className="text-center mt-5">
              <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to website
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}