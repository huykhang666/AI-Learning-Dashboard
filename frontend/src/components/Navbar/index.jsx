import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Tìm kiếm khóa học..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 pr-5 border-r border-slate-200">
          <Bell className="text-slate-500 cursor-pointer hover:text-blue-600 transition-colors" size={20} />
          <MessageSquare className="text-slate-500 cursor-pointer hover:text-blue-600 transition-colors" size={20} />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">Khang Huy</p>
            <p className="text-[11px] text-slate-400 mt-1">Học viên Pro</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            K
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;