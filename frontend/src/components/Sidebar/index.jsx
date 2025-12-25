import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '🏠', active: true },
    { name: 'Upload Video', icon: '📁', active: false },
    { name: 'Learning History', icon: '📄', active: false },
    { name: 'Quizzes / Exams', icon: '💬', active: false },
    { name: 'Chat AI', icon: '🤖', active: false },
    { name: 'Qualytics', icon: '🚀', active: false },
    { name: 'Analytics', icon: '📊', active: false },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6 mb-4">
        <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">AI</div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">AI-LEARN</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
              item.active 
                ? 'bg-blue-100 text-blue-600 font-semibold' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-[15px]">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;