import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

const statusColors = {
  pending: { bg: "#fef3c7", text: "#92400e" },
  contacted: { bg: "#dbeafe", text: "#1e40af" },
  resolved: { bg: "#d1fae5", text: "#065f46" },
};

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const res = await adminAPI.getEmergencyRequests();
      if (res.data.success) {
        setEmergencies(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching emergencies:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Emergency Requests</h1>
          <p>Handle urgent patient requests</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emergencies.map((emergency) => (
                  <tr key={emergency._id}>
                    <td>
                      <strong>{emergency.patientName || emergency.name}</strong>
                    </td>
                    <td>
                      <a href={`tel:${emergency.phone}`} className="phone-link">
                        📞 {emergency.phone}
                      </a>
                    </td>
                    <td>{emergency.description || emergency.service}</td>
                    <td>
                      {formatDate(emergency.createdAt)}
                      <br />
                      <span className="text-muted">{formatTime(emergency.createdAt)}</span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: statusColors[emergency.status]?.bg,
                          color: statusColors[emergency.status]?.text
                        }}
                      >
                        {emergency.status || "pending"}
                      </span>
                    </td>
                    <td>
                      <a 
                        href={`tel:${emergency.phone}`} 
                        className="btn-call"
                      >
                        📞 Call Patient
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {emergencies.length === 0 && (
              <p className="no-data">No emergency requests</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

