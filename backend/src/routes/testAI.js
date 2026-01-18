// src/routes/testAI.js
import express from "express";
import { generateMotivationalQuote } from "../services/ai.service.js";

const router = express.Router();

router.get("/test-ai", async (req, res) => {
  try {
    const quote = await generateMotivationalQuote({
      currentStreak: 0,
      bestStreak: 100,
      streakBrokenToday: true,
      avgRatingLast7Days: 4,
    });

    res.json({ quote });
  } catch (err) {
    console.error("AI ERROR FULL:", err.response?.data || err.message);
    res.status(500).json({
      message: "AI failed",
      error: err.response?.data || err.message,
    });
  }
});


export default router;
