import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Registering...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
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
      }
    } catch {
      setMsg("Error registering!");
    }
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {/* background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4"
              style={{ boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}
            >
              <svg style={{ width: 28, height: 28 }} className="text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">Join MediBridge Dental today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input name="fullName" type="text" placeholder="John Doe"
                  value={form.fullName} required onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input name="username" type="text" placeholder="johndoe"
                  value={form.username} required onChange={handleChange} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input name="email" type="email" placeholder="you@example.com"
                value={form.email} required onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input name="password" type="password" placeholder="Create a strong password"
                value={form.password} required onChange={handleChange} className={inputCls} />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 mt-1"
              style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}
            >
              Create Account
            </button>
          </form>

          {/* Feedback */}
          {msg && (
            <div className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${
              msg.includes("Registered")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {msg}
            </div>
          )}

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
          </p>
        </div>

        <p className="text-center mt-4">
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}