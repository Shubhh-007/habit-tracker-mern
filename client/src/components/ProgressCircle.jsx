import React from 'react';

const ProgressCircle = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#171C26] p-6 rounded-2xl flex flex-col items-center justify-center col-span-1 md:col-span-1 shadow-lg h-full">
      <h3 className="text-[#8E9BAE] text-xs font-semibold tracking-wider mb-6">TODAY'S PROGRESS</h3>
      <div className="relative flex items-center justify-center">
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-[#1F2937]"
          />
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-[#10B981] transition-all duration-1000 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{completed}/{total}</span>
          <span className="text-[#8E9BAE] text-xs mt-1">{percentage}% COMPLETE</span>
        </div>
      </div>
      <p className="text-[#8E9BAE] text-xs mt-6 text-center">
        {total === 0 
          ? "A blank page. Pick a habit to begin." 
          : completed === 0 
            ? "Start your day by finishing a habit!" 
            : completed === total 
              ? "All habits completed! Great job! 🎉" 
              : "You're making progress. Keep it up! 🚀"}
      </p>
    </div>
  );
};

export default ProgressCircle;
