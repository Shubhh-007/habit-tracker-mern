import React from 'react';
import { Flame, Calendar, TrendingUp, Sparkles } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgIcon }) => (
  <div className="bg-[#171C26] p-6 rounded-2xl flex justify-between items-start shadow-lg">
    <div>
      <h3 className="text-[#8E9BAE] text-xs font-semibold tracking-wider mb-2 uppercase">{title}</h3>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-[#8E9BAE] text-xs">{subtitle}</div>
    </div>
    <div className={`p-3 rounded-xl ${bgIcon}`}>
      <Icon className={color} size={24} />
    </div>
  </div>
);

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <StatCard 
        title="Streak" 
        value={`${stats.currentStreak}d`} 
        subtitle="Consecutive active days" 
        icon={Flame} 
        color="text-orange-500"
        bgIcon="bg-orange-500/10"
      />
      <StatCard 
        title="Daily Goal" 
        value={`${stats.todayProgress.completed}/${stats.todayProgress.total}`} 
        subtitle="Habits completed today" 
        icon={Calendar} 
        color="text-green-400"
        bgIcon="bg-green-400/10"
      />
      <StatCard 
        title="Weekly" 
        value={`${stats.weeklyPercentage}%`} 
        subtitle="Last 7 days" 
        icon={TrendingUp} 
        color="text-blue-400"
        bgIcon="bg-blue-400/10"
      />
      <StatCard 
        title="Monthly" 
        value={`${stats.monthlyPercentage}%`} 
        subtitle="Last 30 days" 
        icon={Sparkles} 
        color="text-pink-400"
        bgIcon="bg-pink-400/10"
      />
    </div>
  );
};

export default StatsSection;
