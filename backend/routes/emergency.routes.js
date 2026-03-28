import { Router } from "express";
import Emergency from "../models/Emergency.model.js";

const router = Router();

// Create emergency request
router.post("/", async (req, res) => {
  try {
    const emergency = new Emergency(req.body);
    await emergency.save();
    res.status(201).json({ success: true, message: "Emergency request submitted", data: emergency });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all emergencies (admin)
router.get("/", async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ createdAt: -1 });
    res.json({ success: true, data: emergencies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user's emergencies
router.get("/user/:userId", async (req, res) => {
  try {
    const emergencies = await Emergency.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: emergencies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update emergency status
router.put("/:id/status", async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!emergency) {
      return res.status(404).json({ success: false, message: "Emergency not found" });
    }
    res.json({ success: true, message: "Status updated", data: emergency });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

