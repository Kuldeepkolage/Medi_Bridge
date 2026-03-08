import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin APIs
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard"),
  
  // Appointments
  getAllAppointments: () => api.get("/admin/appointments"),
  approveAppointment: (id) => api.put(`/admin/appointments/${id}/approve`),
  rejectAppointment: (id) => api.put(`/admin/appointments/${id}/reject`),
  completeAppointment: (id) => api.put(`/admin/appointments/${id}/complete`),
  
  // Patients
  getAllPatients: () => api.get("/admin/patients"),
  
  // Reviews
  getAllReviews: () => api.get("/admin/reviews"),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  
  // Emergencies
  getEmergencyRequests: () => api.get("/admin/emergencies"),
};

// Emergency APIs
export const emergencyAPI = {
  createEmergency: (data) => api.post("/emergencies", data),
  getEmergencies: () => api.get("/emergencies"),
  getUserEmergencies: (userId) => api.get(`/emergencies/user/${userId}`),
};

export default api;

