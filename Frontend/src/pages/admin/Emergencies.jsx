import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statusStyle = {
  pending:   "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  resolved:  "bg-green-100 text-green-700",
};

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEmergencies(); }, []);

  // ── Logic unchanged ─────────────────────────────────────────────────────────
  const fetchEmergencies = async () => {
    try {
      const res = await adminAPI.getEmergencyRequests();
      if (res.data.success) setEmergencies(res.data.data);
    } catch (err) { console.error("Error fetching emergencies:", err); }
    finally { setLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formatTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Handle urgent patient requests</p>
      </div>

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
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {emergencies.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{e.patientName || e.name}</td>
                    <td className="px-5 py-4 text-gray-500">{e.phone}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{e.description || e.service}</td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700">{formatDate(e.createdAt)}</p>
                      <p className="text-xs text-gray-400">{formatTime(e.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[e.status] || "bg-yellow-100 text-yellow-700"}`}>
                        {e.status || "pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`tel:${e.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Patient
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {emergencies.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-12">No emergency requests</p>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}