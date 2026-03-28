import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res = await adminAPI.getAllPatients();
      if (res.data.success) setPatients(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-500 text-sm mt-1">View all registered patients</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Patient Name", "Email", "Registered On", "Total Visits"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                          {p.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{p.email}</td>
                    <td className="px-5 py-4 text-gray-500">{fmt(p.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        {p.totalVisits || 0} visits
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-12">No patients found</p>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}