import { Router } from "express";
import {
  getAllAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  getDashboardStats,
  getAllPatients,
  getAllReviews,
  deleteReview,
  getEmergencyRequests,
  getAnalytics
} from "../controllers/admin.controller.js";

const router = Router();

// Dashboard
router.get("/dashboard", getDashboardStats);

// Appointments
router.get("/appointments", getAllAppointments);
router.put("/appointments/:id/approve", approveAppointment);
router.put("/appointments/:id/reject", rejectAppointment);
router.put("/appointments/:id/complete", completeAppointment);

// Patients
router.get("/patients", getAllPatients);

// Reviews
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

// Emergencies
router.get("/emergencies", getEmergencyRequests);

router.get("/analytics", getAnalytics);

export default router;

