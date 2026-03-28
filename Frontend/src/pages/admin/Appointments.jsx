import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

// ── Logic unchanged ───────────────────────────────────────────────────────────
const statusStyle = {
  pending:   { bg: "bg-yellow-100 text-yellow-700", label: "Pending" },
  approved:  { bg: "bg-blue-100 text-blue-700",     label: "Approved" },
  rejected:  { bg: "bg-red-100 text-red-700",       label: "Rejected" },
  completed: { bg: "bg-green-100 text-green-700",   label: "Completed" },
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await adminAPI.getAllAppointments();
      if (res.data.success) setAppointments(res.data.data);
    } catch (err) { console.error("Error fetching appointments:", err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    setUpdating(id);
    try {
      const res = await adminAPI.approveAppointment(id);
      if (res.data.success) setAppointments(appointments.map(a => a._id === id ? { ...a, status: "approved" } : a));
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try {
      const res = await adminAPI.rejectAppointment(id);
      if (res.data.success) setAppointments(appointments.map(a => a._id === id ? { ...a, status: "rejected" } : a));
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const handleComplete = async (id) => {
    setUpdating(id);
    try {
      const res = await adminAPI.completeAppointment(id);
      if (res.data.success) setAppointments(appointments.map(a => a._id === id ? { ...a, status: "completed" } : a));
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all patient appointments</p>
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
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Service</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{apt.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{apt.email}</p>
                      <p className="text-xs text-gray-400">{apt.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(apt.date)}</td>
                    <td className="px-5 py-4 text-gray-600">{apt.service || apt.doctor}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[apt.status]?.bg}`}>
                        {statusStyle[apt.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {apt.status === "pending" && (
                          <>
                            <button onClick={() => handleApprove(apt._id)} disabled={updating === apt._id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                              {updating === apt._id ? "..." : "Approve"}
                            </button>
                            <button onClick={() => handleReject(apt._id)} disabled={updating === apt._id}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                        {apt.status === "approved" && (
                          <button onClick={() => handleComplete(apt._id)} disabled={updating === apt._id}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                            {updating === apt._id ? "..." : "Mark Done"}
                          </button>
                        )}
                        {apt.status === "completed" && (
                          <span className="text-green-600 text-xs font-medium">✓ Completed</span>
                        )}
                        {apt.status === "rejected" && (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-12">No appointments found</p>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}