import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusStyle = {
  pending:   "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  resolved:  "bg-green-100 text-green-700",
};

const updateStatus = (setFn, id, status) =>
  setFn(prev => prev.map(e => e._id === id ? { ...e, status } : e));

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newAlert, setNewAlert] = useState(false);
  const [updating, setUpdating] = useState(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    fetchEmergencies(true);
    const interval = setInterval(() => fetchEmergencies(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async (initial = false) => {
    try {
      const res = await adminAPI.getEmergencyRequests();
      if (res.data.success) {
        const data = res.data.data;
        if (!initial && data.length > prevCountRef.current) {
          setNewAlert(true);
          setTimeout(() => setNewAlert(false), 6000);
        }
        prevCountRef.current = data.length;
        setEmergencies(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching emergencies:", err);
    } finally {
      if (initial) setLoading(false);
    }
  };

  // Mark as Contacted
  const handleContacted = async (e) => {
    setUpdating(e._id);
    try {
      const res = await fetch(`${API_URL}/api/emergencies/${e._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted" }),
      });
      const data = await res.json();
      if (data.success) updateStatus(setEmergencies, e._id, "contacted");
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  // Resolve: update status + create normal appointment
  const handleResolve = async (e) => {
    setUpdating(e._id);
    try {
      // 1. Update emergency to resolved
      const statusRes = await fetch(`${API_URL}/api/emergencies/${e._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      const statusData = await statusRes.json();

      if (statusData.success) {
        // 2. Create appointment entry (shows in Appointments page)
        await fetch(`${API_URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: e.patientName || e.name || "Emergency Patient",
            phone: e.phone,
            email: e.email || "",
            service: "Emergency",
            date: new Date().toISOString(),
            time: "ASAP",
            doctor: "Dr. Samruddhi",
            status: "approved",
          }),
        });
        updateStatus(setEmergencies, e._id, "resolved");
      }
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formatTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const pendingCount = emergencies.filter(e => (e.status || "pending") === "pending").length;

  const active   = emergencies.filter(e => (e.status || "pending") !== "resolved");
  const resolved = emergencies.filter(e => e.status === "resolved");
  const ordered  = [...active, ...resolved];

  return (
    <AdminLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">Emergency Requests</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Handle urgent patient requests
            {lastUpdated && <span className="text-gray-400 ml-2">· Updated {formatTime(lastUpdated)}</span>}
          </p>
        </div>
        <button onClick={() => fetchEmergencies(false)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {newAlert && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          New emergency request received!
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Patient</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Description</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date & Time</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordered.map((e) => {
                  const status = e.status || "pending";
                  const isPending   = status === "pending";
                  const isContacted = status === "contacted";
                  const isResolved  = status === "resolved";
                  const isUpdating  = updating === e._id;

                  return (
                    <tr key={e._id} className={`transition-colors ${
                      isResolved ? "bg-gray-50/60 opacity-60 hover:opacity-100"
                      : isPending ? "bg-red-50/30 hover:bg-red-50/50"
                      : "hover:bg-gray-50"
                    }`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isPending && (
                            <span className="relative flex h-2 w-2 flex-shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                          <span className="font-medium text-gray-900">{e.patientName || e.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{e.phone}</td>
                      <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{e.description || e.service}</td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{formatDate(e.createdAt)}</p>
                        <p className="text-xs text-gray-400">{formatTime(e.createdAt)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[status] || "bg-yellow-100 text-yellow-700"}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Call — always for non-resolved */}
                          {!isResolved && (
                            <a href={`tel:${e.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call
                            </a>
                          )}

                          {/* Pending → Contacted */}
                          {isPending && (
                            <button onClick={() => handleContacted(e)} disabled={isUpdating}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                              {isUpdating ? "..." : "Mark Contacted"}
                            </button>
                          )}

                          {/* Contacted → Resolve + move to Appointments */}
                          {isContacted && (
                            <button onClick={() => handleResolve(e)} disabled={isUpdating}
                              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                              {isUpdating ? "..." : "Resolve & Move to Appointments"}
                            </button>
                          )}

                          {/* Resolved */}
                          {isResolved && (
                            <span className="text-green-600 text-xs font-medium">✓ Resolved · Moved to Appointments</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {emergencies.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-gray-400 text-sm">No emergency requests</p>
                <p className="text-gray-300 text-xs mt-1">Auto-refreshes every 30 seconds</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}