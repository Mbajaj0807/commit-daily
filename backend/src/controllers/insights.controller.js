// controllers/insights.controller.js

import Expense from "../models/Expense.js";
import { computeMoneyAggregates } from "../services/financeAggregates.js";
import { generateMoneyInsights } from "../services/financeInsights.js";

export const getMoneyInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const to = req.query.to || new Date().toISOString().split("T")[0];
    const from =
      req.query.from ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const expenses = await Expense.find({
      userId,
      date: { $gte: from, $lte: to },
    });

    const aggregates = computeMoneyAggregates(expenses);
    const insights = generateMoneyInsights(aggregates);

    res.json({
      success: true,

      /* ----------- Insight Cards ----------- */
      insights,

      /* ----------- Chart-ready Data ----------- */
      charts: {
        categoryBreakdown: aggregates.categoryBreakdown, // pie
        last7DaysTrend: aggregates.last7DaysTrend,       // bar
        spendHeatmap: aggregates.spendHeatmap,           // heatmap
      },

      /* ----------- Meta / Advanced ----------- */
      meta: {
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
