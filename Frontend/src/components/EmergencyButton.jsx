// src/components/EmergencyButton.jsx
import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const API_URL = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL";

function EmergencyButton({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("confirm"); // "confirm" | "info" | "sent"
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Try to get logged-in user info
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const prefillName = stored?.fullName || "";
  const prefillPhone = stored?.phone || "";

  function openModal() {
    setPhase("confirm");
    setPhone(prefillPhone);
    setName(prefillName);
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setPhase("confirm");
    setError("");
  }

  async function sendEmergency(n, p) {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: n || "Unknown",
          phone: p || "Not provided",
          description: "🚨 INSTANT EMERGENCY — Patient needs immediate attention.",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhase("sent");
      } else {
        setError(data.message || "Failed. Please call directly.");
      }
    } catch {
      setError("Server error. Please call directly.");
    } finally {
      setSending(false);
    }
  }

  // If user is logged in with name+phone → one-tap confirm
  const isKnownUser = prefillName && prefillPhone;

  function handleConfirm() {
    if (isKnownUser) {
      sendEmergency(prefillName, prefillPhone);
    } else {
      setPhase("info");
    }
  }

  function handleInfoSubmit(e) {
    e.preventDefault();
    if (!phone.trim()) { setError("Phone number is required."); return; }
    sendEmergency(name, phone);
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className={`inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm ${className}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        Emergency
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
            {/* Red Header */}
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <span className="text-white font-bold text-base">Emergency Alert</span>
              </div>
              <button onClick={closeModal} className="text-white/70 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Direct Call Strip — always visible */}
            <a href="tel:+919511936441"
              className="flex items-center justify-between px-6 py-3 bg-red-50 border-b border-red-100 hover:bg-red-100 transition-colors group">
              <span className="text-red-700 text-xs font-medium">Immediate? Call us directly</span>
              <span className="flex items-center gap-1.5 text-red-700 font-bold text-sm group-hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 9511936441
              </span>
            </a>

            <div className="px-6 py-6">
              {/* PHASE: confirm (one-tap for known user) */}
              {phase === "confirm" && (
                <div className="text-center space-y-4">
                  {isKnownUser ? (
                    <>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Tap below to <strong>instantly alert the doctor</strong>. Your details will be sent automatically.
                      </p>
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-left text-sm text-gray-600 space-y-1">
                        <p><span className="font-semibold text-gray-800">Name:</span> {prefillName}</p>
                        <p><span className="font-semibold text-gray-800">Phone:</span> {prefillPhone}</p>
                      </div>
                      {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                      <button
                        onClick={handleConfirm}
                        disabled={sending}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Alerting Doctor...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Alert Doctor Now
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm">Provide your contact so the doctor can reach you immediately.</p>
                      <button onClick={handleConfirm} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors">
                        Continue
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* PHASE: info (quick 2-field form for guests) */}
              {phase === "info" && (
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <p className="text-gray-600 text-sm">We need your contact to alert the doctor instantly.</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                    <input
                      value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX" required type="tel"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    type="submit" disabled={sending}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Alerting...
                      </>
                    ) : "Alert Doctor Now"}
                  </button>
                </form>
              )}

              {/* PHASE: sent */}
              {phase === "sent" && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-bold text-base">Doctor Alerted</p>
                  <p className="text-gray-500 text-sm">Our team will call you within minutes. You can also call us directly.</p>
                  <button onClick={closeModal} className="mt-2 text-sm text-gray-400 underline hover:text-gray-600">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;