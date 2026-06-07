import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  rescheduleAppointment,
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createAppointment);
router.get("/", getAppointments);
router.get("/my", verifyJWT, getMyAppointments);
router.put("/:id/reschedule", verifyJWT, rescheduleAppointment);

export default router;