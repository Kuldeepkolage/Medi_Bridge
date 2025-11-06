import Appointment from "../models/Appointment.model.js";


export async function createAppointment(req, res) {
  try {
    const appt = new Appointment(req.body);
    await appt.save();
    res.status(201).json({ success: true, message: "Appointment booked!", data: appt });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error booking appointment", error: err.message });
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
