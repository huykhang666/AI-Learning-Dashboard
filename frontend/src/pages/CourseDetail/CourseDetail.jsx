import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import { courseDetailApi } from '../../api/CourseDetailApi';
import {
  ArrowLeft, FileText, ChevronLeft, ChevronRight,
  PlayCircle, Zap, X, Send
} from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";

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

  // Hàm xử lý tách ID từ link YouTube (hỗ trợ cả link rút gọn và link có list)
  const getYoutubeID = (url) => {
    if (!url) return null;
    // Regex này cân hết link: watch?v=, link shorts, link mobile, link có list...
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)\??v?=?([^#&?]*)).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await courseDetailApi.getById(id);

        if (res.code === 1000) {
          const data = res.result;
          setCourseData({
            title: data.title,
            videoUrl: data.videoUrl,
            // Tách Key Points thành mảng nếu lưu dạng chuỗi có dấu xuống dòng
            keyPoints: data.keyPoints ? data.keyPoints.split('\n').filter(p => p.trim() !== '') : [],
            // Parse transcript từ JSON String
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

    // Cleanup function: Tính toán thời gian xem khi thoát trang
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

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-800">

      {/* HEADER  */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Quay lại</span>
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

        {/* CỘT PHẢI: TRANSCRIPT*/}
        <div className="flex-[3] min-w-[350px] flex flex-col bg-white">
          <div className="flex items-center gap-6 px-6 pt-6 border-b border-slate-100 uppercase text-xs font-bold">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-4">Transcript</button>
            <button className="text-slate-400 pb-4">Summary</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {courseData?.transcript?.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <span className="inline-block bg-blue-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded mb-1">
                  [{item.time || '00:00'}]
                </span>
                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                  {item.text || item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*  CHATBOT */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95"
            >
              <Zap size={24} fill="currentColor" />
            </button>
          ) : (
            /* Cửa sổ Chat  */
            <div className="w-[400px] h-[550px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                <h2 className="font-bold text-sm tracking-wide uppercase italic">AI Learning DashBoard</h2>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Zap size={16} fill="currentColor" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                    Chào Bạn! Mình đã sẵn sàng hỗ trợ bạn bóc tách bài học này 🎓
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Hỏi AI bất cứ điều gì..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md active:scale-95 flex items-center justify-center">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;