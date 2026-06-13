import Appointment from "../models/Appointment.model.js";
import User from "../models/User.model.js";
import Rating from "../models/Rating.model.js";
import Emergency from "../models/Emergency.model.js";

// Get all appointments
export async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Approve appointment
export async function approveAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment approved", data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Reject appointment
export async function rejectAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment rejected", data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Complete appointment
export async function completeAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment completed", data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get dashboard analytics
export async function getDashboardStats(req, res) {
  try {
    const totalPatients = await User.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });
    const approvedAppointments = await Appointment.countDocuments({ status: "approved" });
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });
    const rejectedAppointments = await Appointment.countDocuments({ status: "rejected" });
    
    res.json({
      success: true,
      data: {
        totalPatients,
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        rejectedAppointments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS to your existing admin.controller.js
// Place after the existing getDashboardStats function.
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/admin/analytics
export async function getAnalytics(req, res) {
  try {
    const now = new Date();

    // ── 1. Appointment trend — last 6 months ──────────────────────────────
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const appointmentTrends = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                months: [
                  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ],
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] },
            },
          },
          count: 1,
        },
      },
    ]);

    // ── 2. Appointment status distribution ────────────────────────────────
    const statusRaw = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const appointmentStatus = statusRaw.map((s) => ({
      name:  s._id.charAt(0).toUpperCase() + s._id.slice(1),
      value: s.count,
    }));

    // ── 3. Review / rating analytics ─────────────────────────────────────
    const ratingDist = await Rating.aggregate([
      { $group: { _id: "$stars", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Fill in all 5 star slots even if 0
    const starMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDist.forEach((r) => { starMap[r._id] = r.count; });
    const reviewAnalytics = Object.entries(starMap).map(([star, count]) => ({
      name: `${star}★`,
      count,
    }));

    const avgRatingAgg = await Rating.aggregate([
      { $group: { _id: null, avg: { $avg: "$stars" }, total: { $sum: 1 } } },
    ]);
    const averageRating = avgRatingAgg[0]?.avg ? +avgRatingAgg[0].avg.toFixed(1) : 0;
    const totalReviews  = avgRatingAgg[0]?.total ?? 0;

    // ── 4. Emergency trends — last 6 months ──────────────────────────────
    const emergencyTrends = await Emergency.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                months: [
                  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ],
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] },
            },
          },
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        appointmentTrends,
        appointmentStatus,
        reviewAnalytics,
        emergencyTrends,
        averageRating,
        totalReviews,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get all patients
export async function getAllPatients(req, res) {
  try {
    const patients = await User.find().sort({ createdAt: -1 });
    
    // Get total visits for each patient
    const patientsWithVisits = await Promise.all(
      patients.map(async (patient) => {
        const totalVisits = await Appointment.countDocuments({ userId: patient._id });
        return {
          _id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          createdAt: patient.createdAt,
          totalVisits
        };
      })
    );
    
    res.json({ success: true, data: patientsWithVisits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get all reviews
export async function getAllReviews(req, res) {
  try {
    const reviews = await Rating.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Delete review
export async function deleteReview(req, res) {
  try {
    const review = await Rating.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Emergency requests from Emergency collection
export async function getEmergencyRequests(req, res) {
  try {
    const emergencies = await Emergency.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: emergencies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

