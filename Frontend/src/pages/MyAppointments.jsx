import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const STATUS_STYLES = {
  pending:   "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800",
  approved:  "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  completed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800",
  rejected:  "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800",
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
  const { t } = useLanguage();
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
      if (res.data.success) { onSuccess(); onClose(); }
      else setError(res.data.message || "Reschedule failed.");
    } catch (err) {
      setError(err.response?.data?.message || "Reschedule failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-10 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{t("rescheduleAppointment")}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current booking info */}
        <div className="px-6 pt-5">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {t("currentBooking")}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {appointment.service || t("generalCheckup")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {formatDate(appointment.date)} at {appointment.time}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">with {appointment.doctor}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t("newDate")} *
            </label>
            <input
              type="date" value={form.date} min={today}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white focus:bg-white dark:focus:bg-gray-700 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t("newTime")} *
            </label>
            <select
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white focus:bg-white dark:focus:bg-gray-700 transition-all appearance-none"
            >
              <option value="">{t("selectTimeSlot")}</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-800">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {t("cancel")}
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : t("confirmReschedule")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyAppointments() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchAppointments(); }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.getMyAppointments();
      if (res.data.success) setAppointments(res.data.data);
      else setError("Failed to load appointments.");
    } catch (err) {
      setError(err.response?.status === 401
        ? "Session expired. Please log in again."
        : "Could not fetch appointments. Please retry."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    setSuccessMsg(t("rescheduledSuccess"));
    fetchAppointments();
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("myAppointmentsTitle")}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t("manageVisits")}</p>
          </div>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-300 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            <button onClick={fetchAppointments}
              className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 text-sm font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && appointments.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 py-20 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("noAppointments")}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mb-6">{t("noAppointmentsDesc")}</p>
            <Link to="/appointment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
              {t("bookAppointment")}
            </Link>
          </div>
        )}

        {/* Table */}
        {appointments.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {t("myAppointmentsTitle")}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                  {appointments.length}
                </span>
              </h2>
              <Link to="/appointment"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                + {t("bookNow")}
              </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    {[t("date"), t("time"), t("service"), t("doctor"), t("status"), t("action")].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {appointments.map(appt => (
                    <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatDate(appt.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{appt.time}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{appt.service || t("generalCheckup")}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{appt.doctor}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[appt.status]}`}>
                          {t(`status_${appt.status}`) || appt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {["pending", "approved"].includes(appt.status) ? (
                          <button onClick={() => setSelected(appt)}
                            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                            {t("reschedule")}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {appointments.map(appt => (
                <div key={appt._id} className="px-5 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {appt.service || t("generalCheckup")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{appt.doctor}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[appt.status]}`}>
                      {t(`status_${appt.status}`) || appt.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(appt.date)} · {appt.time}
                    </p>
                    {["pending", "approved"].includes(appt.status) && (
                      <button onClick={() => setSelected(appt)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {t("reschedule")} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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