import mongoose from 'mongoose';

const dailyEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  goalStatus: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  suggestedRating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    required: [true, 'Daily notes are required'],
    minlength: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

dailyEntrySchema.index({ userId: 1, date: -1 });
dailyEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyEntry', dailyEntrySchema);