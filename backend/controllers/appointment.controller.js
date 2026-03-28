// controllers/appointment.controller.js
import Appointment from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import jwt from "jsonwebtoken";

export async function createAppointment(req, res) {
  try {
    const appointmentData = { ...req.body };

    // If user is logged in, attach their userId
    const authHeader = req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          authHeader.replace("Bearer ", ""),
          process.env.JWT_SECRET
        );
        if (decoded?.id) appointmentData.userId = decoded.id;
      } catch {
        // Guest booking — no userId, that's fine
      }
    }

    const appt = new Appointment(appointmentData);
    await appt.save();
    res.status(201).json({ success: true, message: "Appointment booked!", data: appt });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getAppointments(req, res) {
  try {
    const appts = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: appts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching appointments" });
  }
}

// GET /api/appointments/my
export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id })
    .sort({ date: 1 });

  res.json({ success: true, data: appointments });
});

// PUT /api/appointments/:id/reschedule
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({
      success: false,
      message: "Date and time are required",
    });
  }

  // Find by ID AND userId together — prevents one user editing another's appointment
  const appointment = await Appointment.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found or not authorized",
    });
  }

  if (!["pending", "approved"].includes(appointment.status)) {
    return res.status(400).json({
      success: false,
      message: "Only pending or approved appointments can be rescheduled",
    });
  }

  appointment.date = new Date(date);
  appointment.time = time;
  await appointment.save();

  res.json({
    success: true,
    message: "Appointment rescheduled successfully",
    data: appointment,
  });
});