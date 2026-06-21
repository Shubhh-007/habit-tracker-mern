const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DailyEntry = require('../models/DailyEntry');

// Pure JS Date Helper (assuming date format YYYY-MM-DD string)
const getPreviousDayStr = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

// Calculate streak mapped strictly to chronological dates
const calculateStreak = (entries, todayStr) => {
  const entryMap = {};
  entries.forEach(e => {
    entryMap[e.date] = e;
  });

  let maxStreak = 0;
  let tempMax = 0;
  let currentStreak = 0;
  let isCurrentStreakActive = true;

  // Calculate max streak by analyzing all entries chronologically
  // We can sort entries ascending
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  if (sortedEntries.length > 0) {
    let prevDate = sortedEntries[0].date;
    for (let i = 0; i < sortedEntries.length; i++) {
      const e = sortedEntries[i];
      if (!e.isAllCompleted) {
        tempMax = 0;
        continue;
      }
      
      if (i === 0) {
        tempMax = 1;
      } else {
        const expectedPrev = getPreviousDayStr(e.date);
        if (expectedPrev === prevDate && tempMax > 0) {
          tempMax++;
        } else if (expectedPrev === prevDate && tempMax === 0) {
           tempMax = 1; // edge case
        } else if (expectedPrev !== prevDate) {
          tempMax = 1; // gap detected
        }
      }
      prevDate = e.date;
      if (tempMax > maxStreak) maxStreak = tempMax;
    }
  }

  // Calculate current streak backwards from today
  let checkDate = todayStr;
  
  // If today is not completed (or doesn't exist), we don't count it towards streak, 
  // BUT the streak is NOT broken yet if they still have time today, so we just start checking from yesterday.
  const todayEntry = entryMap[todayStr];
  if (todayEntry && todayEntry.isAllCompleted) {
    currentStreak++;
    checkDate = getPreviousDayStr(checkDate);
  } else {
    // Start strictly from yesterday
    checkDate = getPreviousDayStr(checkDate);
  }

  while (isCurrentStreakActive) {
    const entry = entryMap[checkDate];
    if (entry && entry.isAllCompleted) {
      currentStreak++;
      checkDate = getPreviousDayStr(checkDate);
    } else {
      isCurrentStreakActive = false;
    }
  }

  return { currentStreak, maxStreak };
};

// GET /stats/dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Important: receive local date from client to avoid UTC timezone drift
    const today = req.query.today; // e.g. "2026-04-17"
    if (!today) {
       return res.status(400).json({ msg: 'Missing today query parameter' });
    }

    const allEntries = await DailyEntry.find({ userId: req.user.id });
    const todayEntry = allEntries.find(e => e.date === today);
    
    let todayProgress = { completed: 0, total: 0, percentage: 0 };
    if (todayEntry) {
      todayProgress.completed = todayEntry.completedCount;
      todayProgress.total = todayEntry.totalCount;
      todayProgress.percentage = todayEntry.totalCount > 0 ? Math.round((todayEntry.completedCount / todayEntry.totalCount) * 100) : 0;
    }

    const { currentStreak, maxStreak } = calculateStreak(allEntries, today);

    // Weekly and Monthly % strictly based on last 7 and 30 calendar days
    let weekComplete = 0; let weekTotal = 0;
    let monthComplete = 0; let monthTotal = 0;
    
    const entryMap = {};
    allEntries.forEach(e => entryMap[e.date] = e);

    let d = today;
    for (let i = 0; i < 30; i++) {
      const e = entryMap[d];
      if (i < 7 && e) {
        weekComplete += e.completedCount;
        weekTotal += e.totalCount;
      }
      if (e) {
        monthComplete += e.completedCount;
        monthTotal += e.totalCount;
      }
      d = getPreviousDayStr(d);
    }

    res.json({
      todayProgress,
      currentStreak,
      maxStreak,
      weeklyPercentage: weekTotal > 0 ? Math.round((weekComplete / weekTotal) * 100) : 0,
      monthlyPercentage: monthTotal > 0 ? Math.round((monthComplete / monthTotal) * 100) : 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
