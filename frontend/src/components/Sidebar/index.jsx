import React from 'react';
import { Home, Upload, History, FileText, MessageSquare, BarChart2 } from 'lucide-react'; // Cài đặt: npm install lucide-react

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, active: true },
    { name: 'Upload Video', icon: <Upload size={20} /> },
    { name: 'Learning History', icon: <History size={20} /> },
    { name: 'Quizzes / Exams', icon: <FileText size={20} /> },
    { name: 'Chat AI', icon: <MessageSquare size={20} /> },
    { name: 'Analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col p-4 shadow-sm">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">AI</div>
        <span className="text-xl font-bold text-slate-800 uppercase tracking-wider">AI-Learn</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
              item.active 
              ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;