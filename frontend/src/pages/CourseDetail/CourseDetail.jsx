import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import { courseDetailApi, aiApi } from '../../api/CourseDetailApi';
import {
  ArrowLeft, FileText, ChevronLeft, ChevronRight,
  PlayCircle, Zap, X, Send, MessageCircle
} from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import AIChatBox from '../../components/common/AIChatBox';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);
  // State quản lý dữ liệu và UI
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [leftTab, setLeftTab] = useState('VIDEO PLAYER');
  const [midTab, setMidTab] = useState('TRANSCRIPT');
  const [chatInput, setChatInput] = useState('');


  // Ref để tính toán thời gian xem video (Progress Tracking)
  const startTimeRef = useRef(Date.now());

  // Hàm xử lý tách ID từ link YouTube 
  const getYoutubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)\??v?=?([^#&?]*)).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await courseDetailApi.getById(id);

        if (res.code === 1000 || res) {
          const data = res.result || res;

          setCourseData({
            title: data.title,
            videoUrl: data.videoUrl,
            summary: data.summary,

            keyPoints: data.keyPoints ? data.keyPoints.split('\n').filter(p => p.trim() !== '') : [],
            transcript: data.summaryJson ? JSON.parse(data.summaryJson) : []
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bài học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) {
        // Chỗ này mai API updateProgress(id, timeSpent)
        console.log(`User spent ${timeSpent}s on session ${id}`);
      }
    };
  }, [id]);

  if (loading) return <LoadingScreen />;

  const videoId = getYoutubeID(courseData?.videoUrl);

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "[00:00]";

    const totalSeconds = Math.floor(Number(seconds));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `[${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`;
  };

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-800">

      {/* HEADER  */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} className="text-blue-600 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm text-blue-600">Quay lại</span>
          </button>
          <h1 className="font-bold text-lg uppercase tracking-wide">
            {courseData?.title || "LECTURE DETAIL"}
          </h1>
        </div>
        <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
          <FileText size={16} /> Export PDF
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">

        {/* CỘT TRÁI: VIDEO  */}
        <div className="flex-[7] flex flex-col p-6 overflow-y-auto border-r border-slate-100">

          {/* Video Player  */}
          <div className="w-full h-[1000px] bg-[#0B0A1A] rounded-2xl relative shadow-lg overflow-hidden mb-6">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="Lecture Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">Đang tải video...</div>
            )}
          </div>

          {/* Key Points -  */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm max-h-[200px] overflow-y-auto">
            <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase">Key points</h3>
            <ul className="space-y-2">
              {courseData?.keyPoints?.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: TRANSCRIPT & SUMMARY */}
        <div className="flex-[3] min-w-[350px] flex flex-col bg-white border-l border-slate-100">

          {/* Tab Headers - Font Black, Tracking Tighter */}
          <div className="flex items-center gap-8 px-8 pt-8 border-b border-slate-100">
            <button
              onClick={() => setMidTab('TRANSCRIPT')}
              className={`pb-4 text-sm transition-all uppercase tracking-tighter ${midTab === 'TRANSCRIPT'
                ? 'text-blue-600 font-black border-b-4 border-blue-600'
                : 'text-slate-300 font-bold hover:text-slate-500'
                }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setMidTab('SUMMARY')}
              className={`pb-4 text-sm transition-all uppercase tracking-tighter ${midTab === 'SUMMARY'
                ? 'text-blue-600 font-black border-b-4 border-blue-600'
                : 'text-slate-300 font-bold hover:text-slate-500'
                }`}
            >
              Summary
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

            {midTab === 'TRANSCRIPT' ? (
              /* --- RENDER TRANSCRIPT --- */
              <div className="space-y-6 animate-in fade-in duration-300">
                {courseData?.transcript?.map((item, idx) => (
                  <div key={idx} className="group cursor-pointer p-2 rounded-xl hover:bg-blue-50/50 transition-all">
                    <span className="inline-block bg-blue-600 text-white text-[10px] font-mono font-black px-2 py-1 rounded-md mb-2 shadow-md shadow-blue-200">
                      {formatTime(item.time)}
                    </span>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                      {item.text || item.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* --- RENDER AI SUMMARY  --- */
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  <h2 className="text-sm font-medium text-blue-600 tracking-tight">
                    Executive Summary
                  </h2>
                </div>

                <div className="relative p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                  {/* Decor icon Zap mờ ở góc */}
                  <Zap size={60} className="absolute -bottom-2 -right-2 text-slate-50" fill="currentColor" />

                  <div className="relative z-10">
                    <ul className="space-y-4">
                      {courseData?.summary ? (
                        /* Logic xử lý: Tách dòng theo dấu chấm */
                        (Array.isArray(courseData.summary) ? courseData.summary.join('. ') : courseData.summary)
                          .split('.')
                          .map(item => item.trim())
                          .filter(item => item.length > 0)
                          .map((sentence, index) => (
                            <li key={index} className="flex items-start gap-3 group/item">
                              {/* Dấu chấm đầu dòng nhỏ gọn, màu xanh dương nhạt */}
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:bg-blue-600 transition-colors"></div>

                              <p className="text-[15px] text-slate-600 leading-relaxed font-normal">
                                {sentence}
                              </p>
                            </li>
                          ))
                      ) : (
                        <p className="text-[15px] text-slate-400 italic">Đang cập nhật tóm tắt chuyên sâu...</p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer Label */}
                <div className="flex items-center justify-center gap-3 pt-2 opacity-20">
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                    AI Learning System Analysis
                  </p>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/*  CHATBOT */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110"
            >
              <Zap size={24} fill="currentColor" />
            </button>
          )}

          {isChatOpen && (
            <div className="fixed bottom-24 right-8 z-50 animate-in slide-in-from-bottom-5 duration-300">
              <AIChatBox
                sessionId={id}
                courseDetailApi={courseDetailApi}
                aiApi={aiApi}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;