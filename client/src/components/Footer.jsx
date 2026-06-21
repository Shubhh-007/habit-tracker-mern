import React from 'react';
import { Mail, User } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#2A344A] bg-[#0B1120]/50 backdrop-blur-md py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* User Info Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-[#8E9BAE]">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[#3B82F6]" />
            <span className="font-medium text-white tracking-wide">Shubh Gupta</span>
          </div>
          <a 
            href="mailto:shubhgupta1707@gmail.com" 
            className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors"
          >
            <Mail size={18} />
            <span className="font-medium text-[#E2E8F0]">shubhgupta1707@gmail.com</span>
          </a>
        </div>

        {/* Digital Heroes Link */}
        <a 
          href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#1A2235] border border-[#2A344A] hover:border-[#3B82F6] text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          Built for Digital Heroes
        </a>
      </div>
    </footer>
  );
};

export default Footer;
