import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Activity, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-8 border-b border-[#1A2235]/60 bg-[#0B1120]/80 backdrop-blur-md shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gradient-to-br from-[#10B981] to-[#047857] rounded-xl shadow-lg shadow-[#10B981]/20 transform transition-transform hover:scale-105">
          <Activity size={24} className="text-white" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span className="text-white font-extrabold text-xl tracking-tight hidden sm:block">HabitTracker</span>
            <span className="text-[#10B981] font-bold text-2xl leading-none">.</span>
          </div>
          <span className="text-[#8E9BAE] text-xs font-medium uppercase tracking-wider">
            {greeting}{user?.name ? `, ${user.name}` : ''}
          </span>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A2235]/50 border border-[#1A2235] rounded-full shadow-inner">
            <div className="bg-[#10B981]/20 p-1 rounded-full">
              <User size={14} className="text-[#10B981]" />
            </div>
            <span className="text-sm font-medium text-[#E2E8F0] tracking-wide">
              {user.name ? user.name : (user.email ? user.email.split('@')[0] : 'Dashboard')}
            </span>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#8E9BAE] hover:text-rose-400 bg-transparent hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all duration-300 group"
            title="Logout"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
