import { Router } from "express";
import { createRating, getRatings } from "../controllers/rating.controller.js";
const router = Router();
router.post("/", createRating);
router.get("/", getRatings);
export default router;
