import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  service: String,
  doctor: { type: String, default: "Dr. Samruddhi" },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "completed"], 
    default: "pending" 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

