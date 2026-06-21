import React, { useState } from 'react';
import { format, isSameDay, startOfMonth, getDaysInMonth, addDays } from 'date-fns';
import { Check, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const HabitGrid = ({ habits, entries, toggleHabit, currentDate, onPrevMonth, onNextMonth, onEditHabit, onDeleteHabit }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  // Use currentDate to get the correct month
  const currentMonth = currentDate || new Date();
  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(monthStart);

  const allDays = Array.from({ length: daysInMonth }).map((_, i) => addDays(monthStart, i));

  // Define week sections with distinct pastel/tinted colors to match the spreadsheet aesthetic
  const baseColors = [
    { color: 'bg-sky-500/10', headerColor: 'bg-sky-500/20', activeBtn: 'bg-sky-500', text: 'text-sky-400' },
    { color: 'bg-indigo-500/10', headerColor: 'bg-indigo-500/20', activeBtn: 'bg-indigo-500', text: 'text-indigo-400' },
    { color: 'bg-purple-500/10', headerColor: 'bg-purple-500/20', activeBtn: 'bg-purple-500', text: 'text-purple-400' },
    { color: 'bg-pink-500/10', headerColor: 'bg-pink-500/20', activeBtn: 'bg-pink-500', text: 'text-pink-400' },
    { color: 'bg-rose-500/10', headerColor: 'bg-rose-500/20', activeBtn: 'bg-rose-500', text: 'text-rose-400' }
  ];

  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const chunkId = Math.floor(i / 7) + 1;
    const style = baseColors[(chunkId - 1) % 5];
    weeks.push({
       id: chunkId,
       label: `Week ${chunkId}`,
       days: allDays.slice(i, i + 7),
       ...style
    });
  }

  const getEntryForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(e => e.date === dateStr);
  };

  const getHabitStatus = (habit, date) => {
    const entry = getEntryForDate(date);
    if (!entry) return 'EMPTY';
    const habitRecord = entry.habits.find(h => h.habitId === habit._id);
    if (habitRecord && habitRecord.completed) return 'COMPLETED';
    return 'MISSED';
  };

  const canToggle = (habit, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const habitCreationStr = format(new Date(habit.createdAt), 'yyyy-MM-dd');
    if (dateStr > todayStr) return false;
    if (dateStr < habitCreationStr) return false;
    return true; 
  };

  return (
    <div className="mt-12 bg-[#1A2235] border border-[#2A344A] rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-[#2A344A] bg-[#0B1120]/50 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white tracking-wide">Progress Tracker</h2>
        <div className="flex items-center gap-4 bg-[#1A2235] px-4 py-2 rounded-xl text-sm border border-[#2A344A]">
          <button onClick={onPrevMonth} className="text-[#8E9BAE] hover:text-white transition-colors">&lt;</button>
          <span className="text-[#E2E8F0] font-medium min-w-[100px] text-center">{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={onNextMonth} className="text-[#8E9BAE] hover:text-white transition-colors">&gt;</button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <table className="w-full text-sm min-w-max border-collapse">
          <thead>
            {/* Top Header Row with Week Labels */}
            <tr>
              <th className="sticky left-0 z-20 bg-[#1A2235] p-0 min-w-[220px] border-b border-r border-[#2A344A]"></th>
              <th className="p-0 border-b border-r border-[#2A344A] w-[70px]"></th>
              <th className="p-0 border-b border-r border-[#2A344A] w-[90px]"></th>
              {weeks.map((week) => (
                <th key={week.id} colSpan={week.days.length} className={`py-3 text-center text-xs font-bold uppercase tracking-wider text-white border-b border-r border-[#2A344A] ${week.headerColor}`}>
                  {week.label}
                </th>
              ))}
            </tr>
            {/* Sub Header Row with Columns and Days */}
            <tr>
              <th className="sticky left-0 z-20 bg-[#1A2235] px-5 py-3 text-left border-b border-r border-[#2A344A] text-[#8E9BAE] text-xs font-semibold uppercase tracking-wider shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                Habit
              </th>
              <th className="px-2 py-3 text-center border-b border-r border-[#2A344A] text-[#8E9BAE] text-[10px] font-semibold uppercase tracking-wider bg-[#1A2235]">
                Goal
              </th>
              <th className="px-2 py-3 text-center border-b border-r border-[#2A344A] text-[#8E9BAE] text-[10px] font-semibold uppercase tracking-wider leading-tight bg-[#1A2235]">
                Days/Wk<br/>Selected
              </th>
              {weeks.map((week) => (
                <React.Fragment key={week.id}>
                  {week.days.map((day, idx) => {
                    const isToday = isSameDay(day, new Date());
                    return (
                      <th key={idx} className={`w-[42px] py-2 text-center border-b border-r border-[#2A344A] ${week.headerColor}`}>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className={`text-[10px] uppercase font-bold leading-none ${isToday ? 'text-white' : week.text}`}>
                            {format(day, 'eeeee')}
                          </span>
                          <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mt-0.5 ${isToday ? 'text-white bg-[#10B981] shadow-md shadow-[#10B981]/30' : 'text-[#E2E8F0]'}`}>
                            {format(day, 'd')}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit._id} className="group hover:bg-[#1F2937]/50 transition-colors">
                <td className="sticky left-0 z-10 bg-[#1A2235] px-5 py-3 border-b border-r border-[#2A344A] group-hover:bg-[#1F2937] transition-colors shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2A344A] border border-[#404b61] flex items-center justify-center text-lg shadow-inner shrink-0">
                        {habit.category === 'Fitness' ? '🔥' : habit.category === 'Mindfulness' ? '🧘' : habit.category === 'Study' ? '📚' : '🌿'}
                      </div>
                      <span className="font-medium text-[#E2E8F0] whitespace-nowrap">{habit.name}</span>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === habit._id ? null : habit._id)}
                        className="p-1 rounded-md text-[#8E9BAE] hover:text-white hover:bg-[#2A344A] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === habit._id && (
                        <div className="absolute left-0 top-full mt-1 w-36 bg-[#12161F] border border-[#2A344A] rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                          <button 
                            onClick={() => { setActiveDropdown(null); onEditHabit(habit); }}
                            className="w-full text-left px-4 py-2 text-sm text-[#8E9BAE] hover:bg-[#1F2937] hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={14} /> Edit Habit
                          </button>
                          <button 
                            onClick={() => { setActiveDropdown(null); onDeleteHabit(habit); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1F2937] hover:text-red-300 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 border-b border-r border-[#2A344A] text-[#8E9BAE] font-medium text-xs bg-[#1A2235]/50">
                  {habit.dailyTarget || '1'} 
                </td>
                <td className="text-center py-3 border-b border-r border-[#2A344A] text-[#8E9BAE] font-medium text-xs bg-[#1A2235]/50">
                  7/7
                </td>
                
                {weeks.map((week) => (
                  <React.Fragment key={week.id}>
                    {week.days.map((day, idx) => {
                      const status = getHabitStatus(habit, day);
                      const clickable = canToggle(habit, day);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <td key={idx} className={`p-0 border-b border-r border-[#2A344A] ${week.color}`}>
                          <div className="w-full h-full min-h-[52px] flex items-center justify-center p-1">
                            {!clickable ? (
                              <div className="w-5 h-5 rounded border-2 border-[#2A344A] opacity-30 bg-[#0B1120]"></div>
                            ) : (
                              <button
                                onClick={() => toggleHabit(habit._id, format(day, 'yyyy-MM-dd'))}
                                className={`w-5 h-5 flex items-center justify-center rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A2235] focus:ring-white/40 ${
                                  status === 'COMPLETED' 
                                    ? `${week.activeBtn} shadow-[0_0_10px_rgba(255,255,255,0.15)] border-transparent` 
                                    : 'border-2 border-[#404b61] bg-[#0B1120]/40 hover:border-[#8E9BAE]'
                                } ${isToday && status !== 'COMPLETED' ? 'ring-1 ring-white/30' : ''}`}
                                title={format(day, 'MMM d, yyyy')}
                                aria-label={`Toggle habit for ${format(day, 'MMM d, yyyy')}`}
                              >
                                {status === 'COMPLETED' && <Check size={14} className="text-white stroke-[4]" />}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tr>
            ))}
            {habits.length === 0 && (
              <tr>
                <td colSpan={3 + daysInMonth} className="text-center py-12 text-[#8E9BAE]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl px-4 py-2 bg-[#2A344A] rounded-2xl mb-2 grayscale opacity-50">👻</span>
                    <p>No habits to track yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitGrid;
