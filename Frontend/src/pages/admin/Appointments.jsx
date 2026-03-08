import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statusColors = {
  pending: { bg: "#fef3c7", text: "#92400e", label: "Pending" },
  approved: { bg: "#dbeafe", text: "#1e40af", label: "Approved" },
  rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
  completed: { bg: "#d1fae5", text: "#065f46", label: "Completed" },
};

const statusMessages = {
  pending: "Waiting for clinic confirmation",
  approved: "Appointment Confirmed",
  rejected: "Appointment Rejected",
  completed: "Treatment Completed",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await adminAPI.getAllAppointments();
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setUpdating(id);
    try {
      const res = await adminAPI.approveAppointment(id);
      if (res.data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === id ? { ...apt, status: "approved" } : apt
        ));
      }
    } catch (err) {
      console.error("Error approving appointment:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try {
      const res = await adminAPI.rejectAppointment(id);
      if (res.data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === id ? { ...apt, status: "rejected" } : apt
        ));
      }
    } catch (err) {
      console.error("Error rejecting appointment:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleComplete = async (id) => {
    setUpdating(id);
    try {
      const res = await adminAPI.completeAppointment(id);
      if (res.data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === id ? { ...apt, status: "completed" } : apt
        ));
      }
    } catch (err) {
      console.error("Error completing appointment:", err);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Appointments</h1>
          <p>Manage all patient appointments</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>
                      <div className="patient-cell">
                        <strong>{apt.name}</strong>
                        <span>{apt.email}</span>
                        <span>{apt.phone}</span>
                      </div>
                    </td>
                    <td>{formatDate(apt.date)}</td>
                    <td>{apt.time}</td>
                    <td>{apt.service || apt.doctor}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: statusColors[apt.status]?.bg,
                          color: statusColors[apt.status]?.text
                        }}
                      >
                        {statusColors[apt.status]?.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {apt.status === "pending" && (
                          <>
                            <button
                              className="btn-approve"
                              onClick={() => handleApprove(apt._id)}
                              disabled={updating === apt._id}
                            >
                              {updating === apt._id ? "..." : "✓ Approve"}
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleReject(apt._id)}
                              disabled={updating === apt._id}
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {apt.status === "approved" && (
                          <button
                            className="btn-complete"
                            onClick={() => handleComplete(apt._id)}
                            disabled={updating === apt._id}
                          >
                            {updating === apt._id ? "..." : "✓ Mark Completed"}
                          </button>
                        )}
                        {apt.status === "rejected" && (
                          <span className="text-muted">No actions</span>
                        )}
                        {apt.status === "completed" && (
                          <span className="text-success">✓ Done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <p className="no-data">No appointments found</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

