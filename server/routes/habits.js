const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// GET /habits
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST /habits
router.post('/', auth, async (req, res) => {
  const { name, category, dailyTarget } = req.body;
  try {
    const newHabit = new Habit({
      userId: req.user.id,
      name,
      category,
      dailyTarget
    });
    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PUT /habits/:id
router.put('/:id', auth, async (req, res) => {
  const { name, category, dailyTarget } = req.body;
  const habitFields = {};
  if (name) habitFields.name = name;
  if (category) habitFields.category = category;
  if (dailyTarget) habitFields.dailyTarget = dailyTarget;

  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    habit = await Habit.findByIdAndUpdate(req.params.id, { $set: habitFields }, { new: true });
    res.json(habit);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// DELETE /habits/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Habit removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
