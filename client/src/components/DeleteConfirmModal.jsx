import React from 'react';
import axios from 'axios';
import { Trash2, X } from 'lucide-react';
import { API_URL } from '../config/api';

const DeleteConfirmModal = ({ onClose, onDelete, habit }) => {

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/habits/${habit._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(habit._id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error deleting habit');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-[#12161F] p-8 rounded-3xl w-full max-w-sm border border-[#1F2937] shadow-2xl relative text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <Trash2 size={28} className="text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Delete Habit?</h2>
        <p className="text-[#8E9BAE] text-sm mb-8">
          Are you sure you want to delete <strong className="text-white">"{habit.name}"</strong>? This action cannot be undone and will not remove past progress history.
        </p>

        <div className="flex justify-center items-center gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 font-semibold text-white bg-[#1F2937] hover:bg-[#374151] px-4 py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] transform active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
