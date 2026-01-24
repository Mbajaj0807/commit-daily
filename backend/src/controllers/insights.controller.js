// controllers/insights.controller.js

import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { computeMoneyAggregates } from "../services/financeAggregates.js";
import { generateMoneyInsights } from "../services/financeInsights.js";

export const getMoneyInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    /* ---------- Get user's pocket money day and budget ---------- */
    const user = await User.findById(userId).select("pocketMoneyDay monthlyBudget");

    if (!user || !user.pocketMoneyDay) {
      return res.status(400).json({
        success: false,
        message: "Pocket money day not set",
      });
    }

    const pocketDay = user.pocketMoneyDay;
    const monthlyBudget = user.monthlyBudget || null;

    /* ---------- Calculate date range (IST-safe) ---------- */
    const now = new Date();
    const todayIST = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const to = todayIST.toISOString().split("T")[0];

    let fromDate = new Date(todayIST);
    fromDate.setDate(pocketDay);

    // If pocket day is in the future → go to previous month
    if (fromDate > todayIST) {
      fromDate.setMonth(fromDate.getMonth() - 1);
    }

    const from = fromDate.toISOString().split("T")[0];

    /* ---------- Fetch expenses ---------- */
    const expenses = await Expense.find({
      userId,
      date: { $gte: from, $lte: to },
    });

    /* ---------- Compute insights ---------- */
    // FIXED: Pass pocketMoneyDay instead of fromDate
    const aggregates = computeMoneyAggregates(expenses, {
      monthlyBudget: monthlyBudget,
      pocketMoneyDay: pocketDay
    });
    
    const insights = generateMoneyInsights(aggregates);

    /* ---------- Response ---------- */
    res.json({
      success: true,

      insights,

      charts: {
        categoryBreakdown: aggregates.categoryBreakdown,
        last7DaysTrend: aggregates.last7DaysTrend,
        spendHeatmap: aggregates.spendHeatmap,
      },

      meta: {
        period: { from, to },
        pocketMoneyDay: pocketDay,
        monthlyBudget: monthlyBudget,
        budgetInsights: aggregates.budgetInsights, // Added budget insights to meta
        totalSpent: aggregates.totalSpent,
        avgDailySpend: Math.round(aggregates.avgDailySpend),
        projection: aggregates.projectionSpend,
        silentSpends: aggregates.silentSpends,
        totalTransactions: aggregates.totalTransactions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};