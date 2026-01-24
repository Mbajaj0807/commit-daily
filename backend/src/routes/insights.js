import express from "express";
import { protect } from "../middleware/auth.js";

import { getMoneyInsights } from "../controllers/insights.controller.js";
import { getGoalInsights } from "../controllers/goalInsights.controller.js";

const router = express.Router();

/* ---------------- Money Insights ---------------- */
router.get("/money", protect, getMoneyInsights);

/* ---------------- Goals Insights ---------------- */
router.get("/goals", protect, getGoalInsights);

export default router;
