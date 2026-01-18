import express from "express";
import dayjs from "dayjs";
import UserQuote from "../models/UserQuote.js";
import { generateMotivationalQuote } from "../services/ai.service.js";
import { ruleBasedQuote } from "../utils/quoteFallback.js";
import { getUserStatsForQuote } from "../services/quoteStats.service.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

router.post("/update", protect, async (req, res) => {
  const userId = req.user.id;
  const today = dayjs().format("YYYY-MM-DD");

  try {
    const existing = await UserQuote.findOne({ userId });

    if (existing?.lastUpdated === today) {
      return res.json({ quote: existing.quote });
    }

    const stats = await getUserStatsForQuote(userId);

    let quote;
    try {
      quote = await generateMotivationalQuote(stats);
    } catch {
      quote = ruleBasedQuote(stats);
    }

    await UserQuote.findOneAndUpdate(
      { userId },
      { quote, lastUpdated: today },
      { upsert: true }
    );

    res.json({ quote });
  } catch (err) {
    console.error("Quote update error:", err);
    res.status(500).json({ message: "Quote update failed" });
  }
});

/**
 * GET /api/quotes/today
 * Returns today's quote if exists
 */
router.get("/today", protect, async (req, res) => {
  const userId = req.user.id;
  const today = dayjs().format("YYYY-MM-DD");

  try {
    const record = await UserQuote.findOne({ userId });

    if (!record || record.lastUpdated !== today) {
      return res.json({
        quote: "",
        message: "No quote generated yet",
      });
    }

    res.json({
      quote: record.quote,
    });
  } catch (err) {
    console.error("Get quote error:", err);
    res.status(500).json({ message: "Failed to fetch quote" });
  }
});

export default router;
