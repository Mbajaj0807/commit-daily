import express from 'express';
import DailyEntry from '../models/Entry.js';
import Streak from '../models/Streak.js';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Calculate suggested rating
const calculateSuggestedRating = (goalStatus, goals) => {
  if (goals.length === 0) return 3;

  let completed = 0;
  goals.forEach(goal => {
    const status = goalStatus.get(goal._id.toString());
    if (goal.type === 'boolean' && status === true) completed++;
    else if (goal.type === 'numeric' && status >= goal.targetValue) completed++;
  });

  const rate = completed / goals.length;
  if (rate >= 0.9) return 5;
  if (rate >= 0.7) return 4;
  if (rate >= 0.5) return 3;
  if (rate >= 0.3) return 2;
  return 1;
};

const getTodayIST = () => {
  const now = new Date();
  
  // Convert to IST (Asia/Kolkata)
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  
  // Format as YYYY-MM-DD
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};


// Update streaks
const updateStreaks = async (userId, entry, goals) => {
  const yesterday = new Date(entry.date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const yesterdayEntry = await DailyEntry.findOne({
    userId,
    date: yesterdayStr
  });

  // Overall streak
  let overallStreak = await Streak.findOne({ userId, goalId: 'overall' });
  if (!overallStreak) {
    overallStreak = await Streak.create({
      userId,
      goalId: 'overall',
      currentStreak: 0,
      bestStreak: 0
    });
  }

  if (entry.rating >= 3) {
    if (yesterdayEntry?.rating >= 3 || overallStreak.currentStreak === 0) {
      overallStreak.currentStreak++;
    } else {
      overallStreak.currentStreak = 1;
    }
    overallStreak.bestStreak = Math.max(overallStreak.bestStreak, overallStreak.currentStreak);
  } else {
    overallStreak.lastBrokenDate = entry.date;
    overallStreak.currentStreak = 0;
  }
  await overallStreak.save();

  // Individual goal streaks
  for (const goal of goals) {
    if (!goal.isActive) continue;

    let streak = await Streak.findOne({ userId, goalId: goal._id.toString() });
    if (!streak) {
      streak = await Streak.create({
        userId,
        goalId: goal._id.toString(),
        currentStreak: 0,
        bestStreak: 0
      });
    }

    const status = entry.goalStatus.get(goal._id.toString());
    let success = false;

    if (goal.type === 'boolean' && status === true) success = true;
    if (goal.type === 'numeric' && status >= goal.targetValue) success = true;

    if (success) {
      const prevStatus = yesterdayEntry?.goalStatus?.get(goal._id.toString());
      let prevSuccess = false;
      if (goal.type === 'boolean' && prevStatus === true) prevSuccess = true;
      if (goal.type === 'numeric' && prevStatus >= goal.targetValue) prevSuccess = true;

      if (prevSuccess || streak.currentStreak === 0) {
        streak.currentStreak++;
      } else {
        streak.currentStreak = 1;
      }
      streak.bestStreak = Math.max(streak.bestStreak, streak.currentStreak);
    } else {
      streak.lastBrokenDate = entry.date;
      streak.currentStreak = 0;
    }

    await streak.save();
  }
};

// @route   POST /api/entries/add-day-update
// @desc    Add or update daily entry
// @access  Private
router.post('/add-day-update', protect, async (req, res) => {
  try {
    const { date, goalStatus, rating, notes } = req.body;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Daily notes are required' });
    }

    const goals = await Goal.find({ userId: req.user._id, isActive: true });
    const goalStatusMap = new Map(Object.entries(goalStatus || {}));
    const suggestedRating = calculateSuggestedRating(goalStatusMap, goals);

    let entry = await DailyEntry.findOne({ userId: req.user._id, date });

    if (entry) {
      entry.goalStatus = goalStatusMap;
      entry.rating = rating || suggestedRating;
      entry.suggestedRating = suggestedRating;
      entry.notes = notes;
      entry.updatedAt = Date.now();
      await entry.save();
    } else {
      entry = await DailyEntry.create({
        userId: req.user._id,
        date,
        goalStatus: goalStatusMap,
        rating: rating || suggestedRating,
        suggestedRating,
        notes
      });
    }

    await updateStreaks(req.user._id, entry, goals);

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/entries
// @desc    Get all entries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 90 } = req.query;
    const entries = await DailyEntry.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/entries/today
// @desc    Get today's entry
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = getTodayIST();
    let entry = await DailyEntry.findOne({ userId: req.user._id, date: today });

    if (!entry) {
      entry = {
        date: today,
        goalStatus: {},
        rating: 0,
        suggestedRating: 0,
        notes: ''
      };
    }

    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/entries/streaks
// @desc    Get all streaks
// @access  Private
router.get('/streaks', protect, async (req, res) => {
  try {
    const streaks = await Streak.find({ userId: req.user._id });
    res.json({ success: true, data: streaks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;