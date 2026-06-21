const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DailyEntry = require('../models/DailyEntry');
const Habit = require('../models/Habit');

// Helper to check if date is older than 24 hours
const isOlderThan24Hours = (dateStr) => {
  const entryDate = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - entryDate);
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours > 48; // Giving a bit more leeway for timezone differences (effectively older than previous day)
};

// GET /entries/:date
router.get('/:date', auth, async (req, res) => {
  try {
    let entry = await DailyEntry.findOne({ userId: req.user.id, date: req.params.date });
    
    // If no entry, we might want to return an empty skeleton based on habits
    if (!entry) {
      const habits = await Habit.find({ userId: req.user.id });
      const habitEntries = habits.map(h => ({ habitId: h._id, completed: false, value: 0 }));
      
      // We don't save it yet to avoid clutter, just return the structure
      return res.json({
        userId: req.user.id,
        date: req.params.date,
        habits: habitEntries,
        note: '',
        mood: '',
        completedCount: 0,
        totalCount: habits.length,
        isAllCompleted: false
      });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET /entries (get all for heatmap)
router.get('/', auth, async (req, res) => {
  try {
    const entries = await DailyEntry.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PUT /entries
router.put('/', auth, async (req, res) => {
  const { date, habits, note, mood } = req.body;
  
  if (isOlderThan24Hours(date)) {
    return res.status(403).json({ msg: 'Cannot edit entries older than 24 hours' });
  }

  try {
    const allHabits = await Habit.find({ userId: req.user.id });
    const totalCount = allHabits.length;
    let completedCount = 0;
    
    if (habits) {
      completedCount = habits.filter(h => h.completed).length;
    }

    const isAllCompleted = totalCount > 0 && completedCount === totalCount;

    let entry = await DailyEntry.findOne({ userId: req.user.id, date });

    if (entry) {
      entry.habits = habits || entry.habits;
      if (note !== undefined) entry.note = note;
      if (mood !== undefined) entry.mood = mood;
      entry.completedCount = completedCount;
      entry.totalCount = totalCount;
      entry.isAllCompleted = isAllCompleted;
      await entry.save();
      return res.json(entry);
    } else {
      entry = new DailyEntry({
        userId: req.user.id,
        date,
        habits: habits || [],
        note: note || '',
        mood: mood || '',
        completedCount,
        totalCount,
        isAllCompleted
      });
      await entry.save();
      return res.json(entry);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
