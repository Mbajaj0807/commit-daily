import dayjs from "dayjs";
import Entry from "../models/Entry.js";
import Streak from "../models/Streak.js";

/**
 * Collects minimal stats needed for AI quote generation
 * Keeps AI input small and meaningful
 */
export async function getUserStatsForQuote(userId) {
  // 1️⃣ Get today's entry
  const today = dayjs().format("YYYY-MM-DD");
  const todayEntry = await Entry.findOne({ userId, date: today });

  // 2️⃣ Get overall streak
  const overallStreak = await Streak.findOne({
    userId,
    goalId: "overall",
  });

  // 3️⃣ Average rating (last 7 days)
  const last7Entries = await Entry.find({ userId })
    .sort({ date: -1 })
    .limit(7);

  const avgRatingLast7Days =
    last7Entries.length > 0
      ? (
          last7Entries.reduce((sum, e) => sum + (e.rating || 0), 0) /
          last7Entries.length
        ).toFixed(1)
      : 0;

    console.log("Quote Stats:", {
      currentStreak: overallStreak?.currentStreak || 0,
      bestStreak: overallStreak?.bestStreak || 0,
    });

  return {
    currentStreak: overallStreak?.currentStreak || 0,
    bestStreak: overallStreak?.bestStreak || 0,
    streakBrokenToday:
      todayEntry && todayEntry.rating < 3, // based on your rules
    avgRatingLast7Days,
  };
}
