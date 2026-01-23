// routes/insights.routes.js

import express from "express";
import { protect } from "../middleware/auth.js";
import { getMoneyInsights } from "../controllers/insights.controller.js";

const router = express.Router();

router.get("/money", protect, getMoneyInsights);

export default router;
