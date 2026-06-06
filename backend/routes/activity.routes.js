import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyActivity } from "../controllers/activity.controller.js";

const router = Router();

router.get("/my", verifyJWT, getMyActivity);

export default router;