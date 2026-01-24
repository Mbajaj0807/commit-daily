// controllers/goalInsights.controller.js

import Goal from "../models/Goal.js";
import Entry from "../models/Entry.js";
import Streak from "../models/Streak.js";

import { computeGoalAggregates } from "../services/GoalAggregates.js";
import { generateGoalInsights } from "../services/goalInsights.js";

export const getGoalInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const goals = await Goal.find({ userId });
    const entries = await Entry.find({ userId }).sort({ date: 1 });
    const streaks = await Streak.find({ userId });

    // Debug logs
    console.log('Goals found:', goals.length);
    console.log('Entries found:', entries.length);
    console.log('Sample entry:', entries[0]);
    console.log('Sample goalStatus:', entries[0]?.goalStatus);

    const aggregates = computeGoalAggregates({
      goals,
      entries,
      streaks,
    });

    console.log('Aggregates:', {
      completionRate: aggregates.completionRate,
      monthlyStats: aggregates.monthlyStats,
      goalWiseStats: aggregates.goalWiseStats[0]
    });

    const insights = generateGoalInsights(aggregates, goals);

    res.json({
      success: true,
      insights,
      charts: {
        last7DaysCompletion: aggregates.last7DaysCompletion,
        dailyGoalsCompleted: aggregates.dailyGoalsCompleted,
        last7DaysGoalProgress: aggregates.last7DaysGoalProgress,
      },
      meta: {
        totalGoals: aggregates.totalGoals,
        activeGoals: aggregates.activeGoals,
        completionRate: aggregates.completionRate,
        disciplineTrend: aggregates.disciplineTrend,
        monthlyStats: aggregates.monthlyStats,
      },
      goalWiseStats: aggregates.goalWiseStats,
    });
  } catch (err) {
    console.error('Goal insights error:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};