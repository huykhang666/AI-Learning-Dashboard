import React from 'react';

const Dashboard = () => {
  // Dữ liệu mẫu cho biểu đồ
  const stats = [
    { label: 'Total Videos', value: '120', unit: 'video' },
    { label: 'Learning Time', value: '55h 30m', unit: 'giờ' },
    { label: 'AI Summaries', value: '85', unit: 'bản' },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-blue-600 p-8 rounded-2xl shadow-lg shadow-blue-100 text-white">
        <h1 className="text-2xl font-bold">Chào mừng bạn, hôm nay bạn học gì mới?</h1>
      </div>

      {/* Stats Cards (Các ô số liệu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{item.label}</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {item.value} <span className="text-sm font-normal text-slate-400">{item.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section (Biểu đồ) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biểu đồ cột giả lập bằng Tailwind */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Learning Activity</h3>
          <div className="flex items-end justify-between h-40 px-4">
            {[40, 70, 45, 90, 65, 30].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-8 bg-blue-500 rounded-t-lg opacity-80"></div>
            ))}
          </div>
        </div>

        {/* Biểu đồ tròn giả lập */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-slate-800 mb-6 self-start">Knowledge Focus</h3>
          <div className="relative w-40 h-40 rounded-full border-[15px] border-blue-500 border-t-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-slate-800">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;