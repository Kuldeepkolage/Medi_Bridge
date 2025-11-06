import express from "express";
import cors from "cors";
import appointmentRoutes from "./routes/appointment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import authRouter from "./routes/auth.routes.js";  // Must match below

const app = express(); // This line MUST BE BEFORE any app.use

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter); // 'authRouter' and NOT 'authRoutes'
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ratings", ratingRoutes);

export default app;
