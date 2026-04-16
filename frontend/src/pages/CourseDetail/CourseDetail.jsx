import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, ChevronLeft, ChevronRight, 
  PlayCircle, Zap, X, Send 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const [leftTab, setLeftTab] = useState('Bóc băng');
  const [midTab, setMidTab] = useState('TRANSCRIPT');
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Back</span>
          </button>
          <h1 className="font-bold text-lg uppercase tracking-wide">
            DISCRETE MATH — LECTURE 5: GRAPH THEORY
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
            <FileText size={16} /> Export PDF
          </button>
          <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Video & Key Points */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto border-r border-slate-100">
          
          {/* Video Player Placeholder */}
          <div className="w-full aspect-video bg-[#0B0A1A] rounded-2xl relative flex flex-col items-center justify-center shadow-lg overflow-hidden group mb-6">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            <button className="relative z-10 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all transform hover:scale-110">
              <PlayCircle size={48} className="text-white opacity-80" strokeWidth={1.5} />
            </button>
            <span className="relative z-10 text-slate-400 mt-4 text-sm font-medium">Discrete Math — Lecture 5</span>
            
            {/* Video Controls (Bottom Bar) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between text-slate-300 text-xs font-mono mb-2">
                <span>05:12</span>
                <span>45:00</span>
              </div>
              <div className="w-full h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[15%]"></div>
              </div>
            </div>
          </div>

          {/* Left Tabs */}
          <div className="flex items-center gap-6 mb-6">
            {['VIDEO PLAYER', 'Bóc băng'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`text-sm font-bold pb-2 uppercase ${
                  leftTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Key Points Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Key key points</h3>
            <ul className="space-y-4">
              {[
                "Thảo luận sự khác biệt giữa Toán Rời Rạc và các môn toán khác trong CS.",
                "Xác định các tiên đề và bổ đề quan trọng của lý thuyết đồ thị.",
                "Trình bày và chứng minh thuật toán Dijkstra qua ví dụ đồ thị có trọng số."
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* MIDDLE COLUMN: Transcript */}
        <div className="w-[350px] flex flex-col border-r border-slate-100 bg-white">
          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 pt-6 border-b border-slate-100">
            {['AI SUMMARY', 'TRANSCRIPT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMidTab(tab)}
                className={`text-xs font-bold pb-4 uppercase tracking-wider ${
                  midTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Transcript Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {[
              { time: '05:12', text: 'Bài giảng bắt đầu với định nghĩa đồ thị G=(V,E) trong Toán Rời Rạc.' },
              { time: '09:12', text: 'Thầy giải thích sự khác biệt giữa đồ thị vô hướng và có hướng, với nhiều ví dụ minh họa.' },
              { time: '12:30', text: 'Công thức Hoán vị P(n,r)=n!/(n-r)! và Tổ hợp C(n,r)=n!/(r!(n-r)!) được trình bày chi tiết.' },
              { time: '18:45', text: 'Thuật toán Dijkstra tìm đường đi ngắn nhất — O((V+E)logV) được chứng minh từng bước.' }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <span className="inline-block bg-blue-600 text-white text-xs font-mono font-bold px-2 py-1 rounded mb-2 shadow-sm">
                  [{item.time}]
                </span>
                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors cursor-pointer">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Chatbot */}
        <div className="w-[400px] flex flex-col bg-slate-50/50">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <h2 className="font-bold text-sm tracking-wide uppercase">ASK AI CHATBOT</h2>
            <button className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* AI Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-blue-500/20">
                <Zap size={16} fill="currentColor" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                Welcome! I've analyzed this lecture. Ask me anything 🎓
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-md shadow-blue-500/20 text-sm text-white leading-relaxed">
                sgsd
              </div>
            </div>

            {/* AI Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-blue-500/20">
                <Zap size={16} fill="currentColor" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                Sure! At timestamp 05:12, the professor explained: "sgsd..." — here's a breakdown step by step.
              </div>
            </div>
            
          </div>

          {/* Chat Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                Explain formula at 05:12
              </button>
              <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                Suggest next topic
              </button>
            </div>
            
            {/* Input Box */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask a question about this lecture." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center">
                Send
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default CourseDetail;