import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalId: {
    type: String,
    required: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  lastBrokenDate: {
    type: String,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

streakSchema.index({ userId: 1, goalId: 1 }, { unique: true });

export default mongoose.model('Streak', streakSchema);