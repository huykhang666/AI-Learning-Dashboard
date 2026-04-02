import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Layers, 
  CheckCircle, 
  Clock, 
  Hash, 
  Calendar,
  ChevronRight,
  Brain,
  Binary,
  PieChart,
  Network,
  GitBranch
} from 'lucide-react';

/**
 * Component StudyHistory: Hiển thị danh sách lịch sử học tập
 */
const StudyHistory = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  // Dữ liệu thống kê mẫu
  const stats = [
    { label: 'Tổng bài giảng', value: 6, icon: Layers, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Đã xem xong', value: 4, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Tổng thời gian', value: '195m', icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { label: 'Từ khóa học được', value: 19, icon: Hash, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ];

  // Dữ liệu danh sách bài giảng mẫu
  const lectures = [
    {
      id: 1,
      title: 'Discrete Math - Lecture 5: Graph Theory',
      date: '14:23 10/06/2025',
      duration: '45:12',
      category: 'Math',
      progress: 100,
      tags: ['Đồ thị', 'Dijkstra'],
      icon: Binary
    },
    {
      id: 2,
      title: 'AI Fundamental - Lecture 3: Neural Networks',
      date: '10:00 09/06/2025',
      duration: '1:02:30',
      category: 'CS',
      progress: 78,
      tags: ['Neural Network', 'Backpropagation'],
      icon: Brain
    },
    {
      id: 3,
      title: 'Probability & Statistics - Chapter 4',
      date: '16:30 08/06/2025',
      duration: '52:18',
      category: 'Math',
      progress: 100,
      tags: ['Xác suất', 'Bayes'],
      icon: PieChart
    },
    {
      id: 4,
      title: 'Data Structures - Stack & Queue',
      date: '08:45 07/06/2025',
      duration: '38:55',
      category: 'CS',
      progress: 100,
      tags: ['Stack', 'Queue'],
      icon: Layers
    },
    {
      id: 5,
      title: 'Graph Theory - Minimum Spanning Tree',
      date: '13:20 05/06/2025',
      duration: '1:15:00',
      category: 'Math',
      progress: 55,
      tags: ['Kruskal', 'Prim'],
      icon: Network
    },
    {
      id: 6,
      title: 'Linear Algebra - Matrix Operations',
      date: '09:15 03/06/2025',
      duration: '48:20',
      category: 'Math',
      progress: 0,
      tags: ['Matrix', 'Vector'],
      icon: GitBranch
    }
  ];

  const filteredLectures = lectures.filter(l => {
    const matchesTab = activeTab === 'Tất cả' || l.category === activeTab;
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lịch sử học tập</h1>
            <p className="text-slate-500 text-sm mt-1">{filteredLectures.length} bài giảng đã xử lý</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Tìm bài giảng..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Mới nhất
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-1">
          <div className="flex gap-4">
            {['Tất cả', 'Math', 'CS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 text-sm font-medium transition-all relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className={`${stat.bgColor} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {filteredLectures.map((lecture, index) => (
            <div 
              key={lecture.id} 
              className="group bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 relative"
            >
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-blue-600 font-bold text-sm">
                {index + 1}
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                <lecture.icon className="w-6 h-6 text-slate-400" />
              </div>

              <div className="flex-grow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lecture.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {lecture.date}
                      <span className="mx-2">|</span>
                      <Clock className="w-3.5 h-3.5" /> {lecture.duration}
                      <span className={`ml-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        lecture.category === 'Math' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {lecture.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 lg:mt-0">
                    {lecture.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[11px] rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                    <ChevronRight className="w-5 h-5 text-slate-300 ml-2" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {lecture.progress === 100 ? (
                    <div className="flex items-center gap-1.5 text-green-500 text-[11px] font-bold italic">
                      <div className="w-24 h-1.5 bg-green-500 rounded-full" />
                      <CheckCircle className="w-3 h-3" />
                      Xong
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 flex-grow max-w-xs">
                      <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${lecture.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-blue-500">{lecture.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyHistory;