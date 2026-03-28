import express from "express";
import cors from "cors";
import appointmentRoutes from "./routes/appointment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import authRouter from "./routes/auth.routes.js";  // Must match below
import adminRouter from "./routes/admin.routes.js";
import emergencyRouter from "./routes/emergency.routes.js";

const app = express(); // This line MUST BE BEFORE any app.use

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter); // 'authRouter' and NOT 'authRoutes'
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/emergencies", emergencyRouter);

export default app;
