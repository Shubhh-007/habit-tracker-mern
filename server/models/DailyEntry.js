const mongoose = require('mongoose');

const dailyEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  habits: [{
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
    completed: { type: Boolean, default: false },
    value: { type: Number, default: 0 }
  }],
  note: { type: String, default: '' },
  mood: { type: String, default: '' },
  completedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  isAllCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('DailyEntry', dailyEntrySchema);
