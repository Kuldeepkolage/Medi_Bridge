import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "contacted", "resolved"], 
    default: "pending" 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const Emergency = mongoose.model('Emergency', emergencySchema);

export default Emergency;

