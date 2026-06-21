import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { subDays, format } from 'date-fns';

const EMOJIS = ['😄', '🙂', '😐', '😔', '😫'];

const Insights = ({ note = '', mood = '', onSaveInsights, entries = [], habits = [], stats = { maxStreak: 0 } }) => {
  const [localNote, setLocalNote] = useState(note);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setLocalNote(val);
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onSaveInsights(val, mood);
    }, 1000);
  };

  const handleMoodSelect = (m) => {
    onSaveInsights(localNote, m);
  };

  // Generate real data for LineChart (Last 30 days)
  const generateLineData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      
      const validHabits = habits.filter(h => {
        const habitDate = new Date(h.createdAt);
        return format(habitDate, 'yyyy-MM-dd') <= dateStr;
      });
      
      const total = validHabits.length;
      let completed = 0;
      
      if (entry && entry.habits) {
        completed = entry.habits.filter(h => h.completed).length;
      }
      
      let val = 0;
      if (total > 0) {
        val = Math.round((completed / total) * 100);
      }
      
      data.push({ name: format(date, 'MMM d'), val });
    }
    return data;
  };

  // Generate real data for BarChart (Last 7 days)
  const generateBarData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      
      let completed = 0;
      if (entry && entry.habits) {
        completed = entry.habits.filter(h => h.completed).length;
      }
      
      data.push({ name: format(date, 'EEE'), val: completed });
    }
    return data;
  };

  const lineData = generateLineData();
  const barData = generateBarData();

  // If there's absolutely no data and no habits, we can check this
  const noData = entries.length === 0 && habits.length === 0;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Consistency Line Chart */}
        <div className="bg-[#171C26] p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#2A3441] transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Consistency &middot; 30 days</h3>
            <span className="text-[#8E9BAE] text-xs">Daily completion %</span>
          </div>
          <div className="h-48 w-full cursor-crosshair relative">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="val" stroke="#10B981" strokeWidth={3} dot={false} isAnimationActive={true} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8E9BAE', fontSize: 10}} dy={10} minTickGap={20} />
                <Tooltip contentStyle={{ backgroundColor: '#151A24', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-[#171C26] p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#2A3441] transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">This week</h3>
            <span className="text-[#8E9BAE] text-xs">Habits done per day</span>
          </div>
          <div className="h-48 w-full pl-4 cursor-pointer relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={32}>
                <Bar dataKey="val" fill="#34D399" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8E9BAE', fontSize: 10}} dy={10} />
                <Tooltip cursor={{fill: '#1F2937'}} contentStyle={{ backgroundColor: '#151A24', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Thoughts */}
        <div className="bg-[#171C26] p-6 rounded-2xl shadow-lg flex flex-col group transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Today's thoughts</h3>
            <span className="text-[#8E9BAE] text-xs opacity-0 group-hover:opacity-100 transition-opacity">Auto-saved</span>
          </div>
          <div className="flex gap-4 mb-4">
            {EMOJIS.map((emoji, i) => (
              <button 
                key={i} 
                onClick={() => handleMoodSelect(emoji)}
                className={`text-2xl transition-transform origin-bottom ${mood === emoji ? 'scale-125 ring-2 ring-[#10B981] rounded-full' : 'opacity-60 hover:scale-125 hover:opacity-100'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <textarea 
            className="w-full bg-[#0B0E14] border border-[#1F2937] rounded-xl p-4 text-sm text-[#8E9BAE] focus:outline-none focus:border-[#10B981] resize-none flex-grow placeholder:text-[#4A5568]"
            placeholder="What went well today? What's on your mind?"
            value={localNote}
            onChange={handleNoteChange}
          ></textarea>
        </div>

        {/* Achievements */}
        <div className="bg-[#171C26] p-6 rounded-2xl shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <span className="text-[#8E9BAE] text-xs">
              {(() => {
                const maxStreak = stats?.maxStreak || 0;
                const achievements = [
                  { title: '3-day spark', days: 3, icon: '🔥', textColor: 'text-orange-400', bgColor: 'bg-orange-500/20', hoverBorder: 'hover:border-orange-500/50' },
                  { title: '7-day streak', days: 7, icon: '🥇', textColor: 'text-amber-400', bgColor: 'bg-amber-500/20', hoverBorder: 'hover:border-amber-500/50' },
                  { title: 'Fortnight', days: 14, icon: '🎯', textColor: 'text-purple-400', bgColor: 'bg-purple-500/20', hoverBorder: 'hover:border-purple-500/50' },
                  { title: '30-day legend', days: 30, icon: '🏆', textColor: 'text-blue-400', bgColor: 'bg-blue-500/20', hoverBorder: 'hover:border-blue-500/50' },
                  { title: '50-day master', days: 50, icon: '💎', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50' },
                  { title: '100-day conqueror', days: 100, icon: '👑', textColor: 'text-rose-400', bgColor: 'bg-rose-500/20', hoverBorder: 'hover:border-rose-500/50' },
                ];
                const unlockedCount = achievements.filter(a => maxStreak >= a.days).length;
                return `${unlockedCount}/${achievements.length} unlocked`;
              })()}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {(() => {
              const maxStreak = stats?.maxStreak || 0;
              const achievements = [
                { title: '3-day spark', days: 3, icon: '🔥', textColor: 'text-orange-400', bgColor: 'bg-orange-500/20', hoverBorder: 'hover:border-orange-500/50' },
                { title: '7-day streak', days: 7, icon: '🥇', textColor: 'text-amber-400', bgColor: 'bg-amber-500/20', hoverBorder: 'hover:border-amber-500/50' },
                { title: 'Fortnight', days: 14, icon: '🎯', textColor: 'text-purple-400', bgColor: 'bg-purple-500/20', hoverBorder: 'hover:border-purple-500/50' },
                { title: '30-day legend', days: 30, icon: '🏆', textColor: 'text-blue-400', bgColor: 'bg-blue-500/20', hoverBorder: 'hover:border-blue-500/50' },
                { title: '50-day master', days: 50, icon: '💎', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50' },
                { title: '100-day conqueror', days: 100, icon: '👑', textColor: 'text-rose-400', bgColor: 'bg-rose-500/20', hoverBorder: 'hover:border-rose-500/50' },
              ];

              return achievements.map((acc, idx) => {
                const isUnlocked = maxStreak >= acc.days;
                if (isUnlocked) {
                  return (
                    <div key={idx} className={`min-w-[100px] h-[120px] bg-[#1A2526] rounded-xl border border-[#10B981]/30 ${acc.hoverBorder} flex flex-col items-center justify-center gap-2 relative overflow-hidden group transition-colors cursor-pointer`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${acc.bgColor} ${acc.textColor}`}>
                        <span className="text-xl">{acc.icon}</span>
                      </div>
                      <div className="text-xs font-bold text-center mt-1 text-[#E2E8F0]">{acc.title}</div>
                      <div className="text-[10px] text-[#8E9BAE] tracking-wider uppercase">{acc.days} DAYS</div>
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]"></div>
                    </div>
                  );
                } else {
                  const progressPercent = Math.min(100, Math.round((maxStreak / acc.days) * 100));
                  return (
                    <div key={idx} className="min-w-[100px] h-[120px] bg-[#111620] rounded-xl border border-[#1F2937] flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                      <div className="w-12 h-12 rounded-full bg-[#1F2937]/50 flex items-center justify-center text-[#8E9BAE] grayscale opacity-40">
                        <span className="text-xl">{acc.icon}</span>
                      </div>
                      <div className="text-xs font-bold text-center text-[#8E9BAE] mt-1">{acc.title}</div>
                      <div className="w-16 h-1.5 bg-[#1F2937] rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-[#3B82F6] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <div className="text-[9px] text-[#4A5568] tracking-widest">{maxStreak} / {acc.days}</div>
                    </div>
                  );
                }
              });
            })()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;
