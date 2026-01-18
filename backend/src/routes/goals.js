import express from 'express';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/goals/add-goal
// @desc    Add new goal
// @access  Private
router.post('/add-goal', protect, async (req, res) => {
  try {
    const { name, type, targetValue, unit, category, icon } = req.body;

    const goal = await Goal.create({
      userId: req.user._id,
      name,
      type,
      targetValue: type === 'numeric' ? targetValue : null,
      unit: unit || '',
      category: category || 'Discipline',
      icon: icon || '🎯'
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/goals
// @desc    Get all goals
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/goals/remove-goal/:id
// @desc    Remove goal
// @access  Private
router.delete('/remove-goal/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/goals/:id
// @desc    Update goal
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;