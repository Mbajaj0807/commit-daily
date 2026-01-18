import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['boolean', 'numeric'],
    required: true
  },
  targetValue: {
    type: Number,
    default: null
  },
  unit: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Fitness', 'Study', 'Health', 'Discipline', 'Work', 'Social'],
    default: 'Discipline'
  },
  icon: {
    type: String,
    default: '🎯'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

goalSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model('Goal', goalSchema);