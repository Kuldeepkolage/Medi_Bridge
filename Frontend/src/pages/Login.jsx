import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("Logging in...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMsg("Login successful! Redirecting...");
        setTimeout(() => {
          if (data.user?.role === "admin") navigate("/admin/dashboard", { replace: true });
          else navigate(from, { replace: true });
          window.location.reload();
        }, 700);
      } else {
        setMsg(data.message || "Login failed.");
        setLoading(false);
      }
    } catch {
      setMsg("Error logging in!");
      setLoading(false);
    }
  }

  const isSuccess = msg.includes("success") || msg.includes("Logging");

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

        /* Stat chip */
        .stat-chip {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          backdrop-filter: blur(8px);
        }

        /* Grid pattern overlay */
        .grid-overlay {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
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

          {/* Hero */}
          <div className="relative z-10">
            {/* Floating card */}
            <div className="float mb-10">
              <div className="bg-white/8 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-xl">🦷</div>
                  <div>
                    <p className="text-white font-bold text-sm">MediBridge Admin</p>
                    <p className="text-slate-400 text-xs">Real-time patient management</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Patients", val: "6+", color: "text-blue-400" },
                    { label: "Appointments", val: "29", color: "text-green-400" },
                    { label: "Reviews", val: "4.1★", color: "text-yellow-400" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="stat-chip text-center">
                      <p className={`font-bold text-lg ${color}`} style={{ fontFamily: "'DM Serif Display', serif" }}>{val}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-white font-bold text-3xl leading-snug mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Your patients,<br />
              <span className="text-blue-400">always in view.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Manage appointments, track patient records, and handle emergencies — all from one secure panel.
            </p>
          </div>

          {/* Bottom footer */}
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

          <div className="w-full max-w-[400px]">

            {/* Card */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 fade-up fade-up-1">
              <div className="h-1 w-full bg-blue-600" />
              <div className="p-8">

                {/* Header */}
                <div className="mb-7 fade-up fade-up-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    Secure Login
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight"
                    style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Welcome back
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">Sign in to your MediBridge account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                  <div className="fade-up fade-up-3">
                    <label className="auth-label">Email Address</label>
                    <input
                      name="email" type="email" placeholder="you@example.com"
                      value={form.email} required onChange={handleChange}
                      className="auth-input"
                    />
                  </div>
                  <div className="fade-up fade-up-4">
                    <label className="auth-label">Password</label>
                    <input
                      name="password" type="password" placeholder="••••••••"
                      value={form.password} required onChange={handleChange}
                      className="auth-input"
                    />
                  </div>

                  <div className="fade-up fade-up-5 pt-1">
                    <button type="submit" disabled={loading} className="auth-btn">
                      {loading ? (
                        <svg className="w-4 h-4 spinner" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      )}
                      {loading ? "Signing in..." : "Sign In"}
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
                  New user?{" "}
                  <a href="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Create an account</a>
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