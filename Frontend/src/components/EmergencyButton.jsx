// src/components/EmergencyButton.jsx
import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EmergencyButton({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patientName: "", phone: "", email: "", description: "" });
  const [status, setStatus] = useState(""); // "loading" | "success" | "error"
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMsg("Emergency request submitted! Our team will contact you shortly.");
        setForm({ patientName: "", phone: "", email: "", description: "" });
        setTimeout(() => { setOpen(false); setStatus(""); setMsg(""); }, 3000);
      } else {
        setStatus("error");
        setMsg(data.message || "Failed to submit. Please call us directly.");
      }
    } catch {
      setStatus("error");
      setMsg("Server error. Please call +91 9511936441 directly.");
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        Emergency
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => { setOpen(false); setStatus(""); setMsg(""); }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <h2 className="text-white font-bold text-lg">Emergency Request</h2>
              </div>
              <button
                onClick={() => { setOpen(false); setStatus(""); setMsg(""); }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Direct Call Strip */}
            <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-center justify-between">
              <span className="text-red-700 text-sm font-medium">Need immediate help?</span>
              <a href="tel:+919511936441"
                className="inline-flex items-center gap-1.5 text-red-700 font-bold text-sm hover:text-red-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now: +91 9511936441
              </a>
            </div>

            {/* Form */}
            <div className="px-6 py-5">
              {status === "success" ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-700 font-semibold text-sm">{msg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                      <input
                        name="patientName" value={form.patientName} required
                        onChange={handleChange} placeholder="Your name"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                      <input
                        name="phone" type="tel" value={form.phone} required
                        onChange={handleChange} placeholder="+91 XXXXX"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email (optional)</label>
                    <input
                      name="email" type="email" value={form.email}
                      onChange={handleChange} placeholder="your@email.com"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Describe your emergency *</label>
                    <textarea
                      name="description" value={form.description} required
                      onChange={handleChange} rows={3}
                      placeholder="e.g. Severe toothache, broken tooth, swelling..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{msg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold text-sm rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Submitting..." : "Submit Emergency Request"}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Our team will contact you within minutes
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;