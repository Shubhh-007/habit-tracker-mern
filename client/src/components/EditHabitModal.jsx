import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { API_URL } from '../config/api';

const CATEGORIES = [
  { id: 'Health', icon: '🌿', label: 'Health' },
  { id: 'Fitness', icon: '🔥', label: 'Fitness' },
  { id: 'Study', icon: '📚', label: 'Study' },
  { id: 'Mindfulness', icon: '🧘', label: 'Mindfulness' },
  { id: 'Work', icon: '💼', label: 'Work' },
  { id: 'Creative', icon: '🎨', label: 'Creative' },
  { id: 'Other', icon: '✨', label: 'Other' },
];

const EditHabitModal = ({ onClose, onEdit, habit }) => {
  const [name, setName] = useState(habit.name || '');
  const [category, setCategory] = useState(habit.category || 'Health');
  const [dailyTarget, setDailyTarget] = useState(habit.dailyTarget || 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/habits/${habit._id}`, 
        { name, category, dailyTarget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onEdit(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating habit');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-[#12161F] p-8 rounded-3xl w-full max-w-lg border border-[#1F2937] shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit habit</h2>
          <button 
            onClick={onClose} 
            className="text-[#8E9BAE] hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name Field */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Name</label>
            <input
              type="text"
              placeholder="e.g. Morning run"
              className="w-full bg-[#12161F] text-white p-4 rounded-xl border-2 border-[#1F2937] focus:outline-none focus:border-[#3B82F6] transition-all placeholder:text-[#4B5563] shadow-[0_0_0_transparent] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category Field */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`
                    p-3 rounded-xl border flex flex-col items-start justify-center gap-2 transition-all
                    ${category === cat.id 
                      ? 'border-[#3B82F6] bg-[#3B82F6]/5' 
                      : 'border-[#1F2937] hover:border-[#4B5563] bg-[#1A202C]/30'
                    }
                  `}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-white">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Slider Field */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-white">Goal</label>
              <span className="text-sm text-[#8E9BAE]">{dailyTarget} days / week</span>
            </div>
            
            <input
              type="range"
              min="1"
              max="7"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(Number(e.target.value))}
              className="w-full h-2 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
            />
            
            <style>{`
              input[type=range]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #12161F;
                border: 4px solid #3B82F6;
                cursor: pointer;
              }
              input[type=range]::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #12161F;
                border: 4px solid #3B82F6;
                cursor: pointer;
              }
            `}</style>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="font-semibold text-white px-4 py-2 hover:text-[#8E9BAE] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] transform active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHabitModal;
