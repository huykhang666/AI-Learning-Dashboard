import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Videos', value: '120', unit: 'video' },
    { label: 'Learning Time', value: '55h 30m', unit: 'giờ' },
    { label: 'AI Summaries Generated', value: '85', unit: 'bản' },
  ];

  const activityData = [40, 25, 80, 20, 15, 60, 45];

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 rounded-3xl shadow-xl shadow-blue-100 text-white">
        <h1 className="text-2xl font-bold mb-2">Chào mừng bạn, hôm nay bạn học gì mới?</h1>
        <p className="text-blue-100 text-sm opacity-90">Hệ thống AI đã sẵn sàng giúp bạn tóm tắt kiến thức.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{item.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-600">{item.value}</span>
              <span className="text-slate-400 text-xs">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Learning Activity (Biểu đồ cột) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Learning Activity</h3>
          <div className="flex items-end justify-between h-48 px-4 relative">
            {/* Grid lines mờ */}
            <div className="absolute inset-x-0 bottom-1/4 border-b border-slate-50"></div>
            <div className="absolute inset-x-0 bottom-1/2 border-b border-slate-50"></div>
            <div className="absolute inset-x-0 bottom-3/4 border-b border-slate-50"></div>
            
            {activityData.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group relative z-10">
                <div 
                  style={{ height: `${val}%` }} 
                  className="w-10 bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600 group-hover:shadow-lg"
                ></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">T{i+2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Focus (Biểu đồ tròn/Donut) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-8 self-start">Knowledge Focus</h3>
          <div className="relative w-44 h-44 rounded-full border-[18px] border-slate-50 flex items-center justify-center">
            {/* Phân đoạn màu sắc giả lập bằng border */}
            <div className="absolute inset-[-18px] rounded-full border-[18px] border-blue-500 border-t-transparent border-l-transparent rotate-[45deg]"></div>
            <div className="absolute inset-[-18px] rounded-full border-[18px] border-blue-300 border-b-transparent border-r-transparent -rotate-[30deg]"></div>
            
            <div className="text-center">
              <span className="text-2xl font-black text-slate-800">75%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Overall</p>
            </div>
          </div>
          
          <div className="mt-8 w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Video</span>
              <span className="font-bold text-slate-700">65%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-300"></div> Quizzes</span>
              <span className="font-bold text-slate-700">10%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-5">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border-b border-slate-50 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">ML</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">Machine Learning Basics</p>
              <p className="text-xs text-slate-400">Đã hoàn thành tóm tắt • 2 giờ trước</p>
            </div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Done</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;