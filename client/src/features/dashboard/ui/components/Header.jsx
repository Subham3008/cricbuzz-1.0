import React from 'react';
import { Search, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0 shadow-sm">
      {/* Left: hamburger (mobile) + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <Menu size={22} />
        </button>

        {/* Search bar — hidden on xs, visible from sm */}
        <div className="relative flex items-center w-full max-w-xs hidden sm:flex">
          <Search className="absolute left-3 h-4 w-4 text-slate-500" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search teams, players..."
            className="w-full pl-10 pr-4 py-2 bg-[#f3f4f6] border-none rounded-md text-[14px] text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1E402F] focus:outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Nav tabs — hidden on mobile */}
        <div className="hidden md:flex ml-4 space-x-5 h-full items-center">
          {['Live', 'Schedule', 'Teams'].map((tab) => {
            const isActive = location.pathname.includes(`/${tab.toLowerCase()}`);
            return (
              <button
                key={tab}
                onClick={() => navigate(`/home/${tab.toLowerCase()}`)}
                className={`text-[14px] font-bold h-[64px] relative flex items-center ${
                  isActive ? 'text-[#1E402F]' : 'text-[#64748b] hover:text-slate-800'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2e7d32] rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Go Live + Avatar */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate('/home/live')}
          className="hidden sm:flex px-4 py-2 bg-[#1E402F] hover:bg-[#152e22] text-white text-[13px] font-bold rounded-md transition-colors shadow-sm tracking-wide"
        >
          Go Live
        </button>
        <div
          onClick={() => navigate('/home/settings')}
          className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer border border-slate-300 flex-shrink-0"
        >
          <img src="https://ui-avatars.com/api/?name=Super+Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
