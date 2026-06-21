import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, subMonths, addMonths } from 'date-fns';
import { Plus } from 'lucide-react';
import ProgressCircle from '../components/ProgressCircle';
import StatsSection from '../components/StatsSection';
import HabitGrid from '../components/HabitGrid';
import Insights from '../components/Insights';
import AddHabitModal from '../components/AddHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { API_URL } from '../config/api';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    todayProgress: { completed: 0, total: 0, percentage: 0 },
    currentStreak: 0,
    maxStreak: 0,
    weeklyPercentage: 0,
    monthlyPercentage: 0
  });
  
  const [todayNote, setTodayNote] = useState('');
  const [todayMood, setTodayMood] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const token = localStorage.getItem('token');

  // We use datefns format to get local date perfectly
  const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');

  const fetchData = async () => {
    try {
      const todayStr = getTodayStr();
      const headers = { Authorization: `Bearer ${token}` };
      const [habitsRes, entriesRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/habits`, { headers }),
        axios.get(`${API_URL}/entries`, { headers }),
        axios.get(`${API_URL}/stats/dashboard?today=${todayStr}`, { headers })
      ]);
      setHabits(habitsRes.data);
      setEntries(entriesRes.data);
      setStats(statsRes.data);

      const todayEntry = entriesRes.data.find(e => e.date === todayStr);
      if (todayEntry) {
        setTodayNote(todayEntry.note || '');
        setTodayMood(todayEntry.mood || '');
      } else {
        setTodayNote('');
        setTodayMood('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveInsights = async (newNote, newMood) => {
    try {
      const todayStr = getTodayStr();
      setTodayNote(newNote);
      setTodayMood(newMood);

      let entry = entries.find(e => e.date === todayStr);
      await axios.put(`${API_URL}/entries`, {
        date: todayStr,
        note: newNote,
        mood: newMood,
        habits: entry ? entry.habits : habits.map(h => ({ habitId: h._id, completed: false, value: 0 }))
      }, { headers: { Authorization: `Bearer ${token}` } });
      
    } catch (err) {
      console.error("Error saving insights", err);
    }
  };

  const toggleHabit = async (habitId, dateStr) => {
    try {
      let entry = entries.find(e => e.date === dateStr);
      let updatedHabits = [];

      // Only evaluate habits that existed on or before the given date
      const validHabits = habits.filter(h => {
        const habitDate = new Date(h.createdAt);
        const cellDate = new Date(dateStr);
        // Compare YYYY-MM-DD
        return format(habitDate, 'yyyy-MM-dd') <= dateStr;
      });

      if (!entry) {
        updatedHabits = validHabits.map(h => ({
          habitId: h._id,
          completed: h._id === habitId ? true : false,
          value: 0
        }));
      } else {
        updatedHabits = entry.habits.map(h => {
          if (h.habitId === habitId) return { ...h, completed: !h.completed };
          return h;
        });
        
        // Ensure any new valid habit gets pushed correctly
        validHabits.forEach(vh => {
          if (!updatedHabits.find(uh => uh.habitId === vh._id)) {
            updatedHabits.push({ 
              habitId: vh._id, 
              completed: vh._id === habitId ? true : false, 
              value: 0 
            });
          }
        });
      }

      await axios.put(`${API_URL}/entries`, {
        date: dateStr,
        habits: updatedHabits
      }, { headers: { Authorization: `Bearer ${token}` } });

      fetchData();
    } catch (err) {
      console.error("Error toggling habit", err);
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProgressCircle 
            completed={stats.todayProgress.completed} 
            total={stats.todayProgress.total} 
          />
        </div>
        <div className="lg:col-span-2">
          <StatsSection stats={stats} />
        </div>
      </div>

      <HabitGrid 
        habits={habits}
        entries={entries}
        toggleHabit={toggleHabit}
        currentDate={currentDate}
        onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
        onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        onEditHabit={(habit) => setEditingHabit(habit)}
        onDeleteHabit={(habit) => setDeletingHabit(habit)}
      />

      <Insights 
        note={todayNote}
        mood={todayMood}
        onSaveInsights={saveInsights}
        entries={entries}
        habits={habits}
        stats={stats}
      />

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-[#10B981] text-[#0B0E14] px-6 py-4 rounded-full font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all transform hover:-translate-y-1 active:translate-y-0 z-40"
      >
        <Plus size={24} /> Add habit
      </button>

      {isModalOpen && <AddHabitModal onClose={() => setIsModalOpen(false)} onAdd={() => fetchData()} />}
      {editingHabit && <EditHabitModal onClose={() => setEditingHabit(null)} onEdit={() => fetchData()} habit={editingHabit} />}
      {deletingHabit && <DeleteConfirmModal onClose={() => setDeletingHabit(null)} onDelete={() => fetchData()} habit={deletingHabit} />}
    </div>
  );
};

export default Dashboard;
