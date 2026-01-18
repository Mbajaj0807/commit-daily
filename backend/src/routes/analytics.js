import express from 'express';
import DailyEntry from '../models/Entry.js';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private
router.get('/overview', protect, async (req, res) => {
  try {
    const entries = await DailyEntry.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(90);

    const goals = await Goal.find({ userId: req.user._id });

    const analytics = {
      totalDays: entries.length,
      avgRating: entries.length > 0
        ? (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(2)
        : 0,
      fiveStarDays: entries.filter(e => e.rating === 5).length,
      oneStarDays: entries.filter(e => e.rating === 1).length,
      ratingDistribution: {
        1: entries.filter(e => e.rating === 1).length,
        2: entries.filter(e => e.rating === 2).length,
        3: entries.filter(e => e.rating === 3).length,
        4: entries.filter(e => e.rating === 4).length,
        5: entries.filter(e => e.rating === 5).length,
      },
      last30Days: entries.slice(0, 30).reverse(),
      goalCompletionRates: {}
    };

    // Calculate goal completion rates
    goals.forEach(goal => {
      const goalEntries = entries.filter(e => e.goalStatus.has(goal._id.toString()));
      let completed = 0;

      goalEntries.forEach(entry => {
        const status = entry.goalStatus.get(goal._id.toString());
        if (goal.type === 'boolean' && status === true) completed++;
        else if (goal.type === 'numeric' && status >= goal.targetValue) completed++;
      });

      analytics.goalCompletionRates[goal._id] = {
        name: goal.name,
        icon: goal.icon,
        rate: goalEntries.length > 0 ? ((completed / goalEntries.length) * 100).toFixed(1) : 0,
        total: goalEntries.length,
        completed
      };
    });

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;