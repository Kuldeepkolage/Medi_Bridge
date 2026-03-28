import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../services/api.js";

const STATUS_STYLES = {
  pending:   "bg-yellow-100 text-yellow-800 border border-yellow-200",
  approved:  "bg-blue-100   text-blue-800   border border-blue-200",
  completed: "bg-green-100  text-green-800  border border-green-200",
  rejected:  "bg-red-100    text-red-800    border border-red-200",
};

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","02:00 PM",
  "02:30 PM","03:00 PM","03:30 PM","04:00 PM",
  "04:30 PM","05:00 PM",
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Reschedule Modal ──────────────────────────────────────────────────────────
function RescheduleModal({ appointment, onClose, onSuccess }) {
  const [form, setForm] = useState({ date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.date || !form.time) {
      setError("Please select both date and time.");
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.rescheduleAppointment(appointment._id, form);
      if (res.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.data.message || "Reschedule failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reschedule failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Reschedule Appointment</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current appointment info */}
        <div className="px-6 pt-5">
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Booking</p>
            <p className="text-sm font-semibold text-gray-900">{appointment.service || "General Checkup"}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatDate(appointment.date)} at {appointment.time}
            </p>
            <p className="text-sm text-gray-500">with {appointment.doctor}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Date *</label>
            <input
              type="date"
              value={form.date}
              min={today}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Time *</label>
            <select
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all appearance-none"
            >
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // appointment for reschedule
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchAppointments(); }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.getMyAppointments();
      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        setError("Failed to load appointments.");
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Could not fetch appointments. Please retry."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRescheduleClick(appt) {
    if (!["pending", "approved"].includes(appt.status)) return;
    setSelected(appt);
  }

  function handleSuccess() {
    setSuccessMsg("Appointment rescheduled successfully!");
    fetchAppointments();
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-sm text-gray-500 mt-0.5">View and manage your dental visits</p>
          </div>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{error}</p>
            <button onClick={fetchAppointments} className="mt-2 text-red-600 hover:text-red-800 text-sm font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && appointments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              Book your first appointment and it will show up here.
            </p>
            <Link to="/appointment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Appointment
            </Link>
          </div>
        )}

        {/* Appointments table */}
        {appointments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                All Appointments
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {appointments.length}
                </span>
              </h2>
              <Link to="/appointment"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                + Book New
              </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Date", "Time", "Service", "Doctor", "Status", "Action"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map(appt => (
                    <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {formatDate(appt.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{appt.time}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{appt.service || "General Checkup"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{appt.doctor}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[appt.status]}`}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {["pending", "approved"].includes(appt.status) ? (
                          <button
                            onClick={() => handleRescheduleClick(appt)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            Reschedule
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {appointments.map(appt => (
                <div key={appt._id} className="px-5 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{appt.service || "General Checkup"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{appt.doctor}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[appt.status]}`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">
                      {formatDate(appt.date)} · {appt.time}
                    </p>
                    {["pending", "approved"].includes(appt.status) && (
                      <button
                        onClick={() => handleRescheduleClick(appt)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Reschedule →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {selected && (
        <RescheduleModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}