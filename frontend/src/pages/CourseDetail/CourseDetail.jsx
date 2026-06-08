import React, { useState, useEffect, useRef, useCallback } from "react";
import LoadingScreen from "../../components/common/LoadingScreen";
import { courseDetailApi, aiApi } from "../../api/CourseDetailApi";
import { 
  ArrowLeft, 
  FileText, 
  Zap, 
  X, 
  CheckCircle2, 
  XCircle, 
  CircleDot,
  HelpCircle,
  Download,
  MessageSquare
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AIChatBox from "../../components/common/AIChatBox";

const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const baseUrl = apiUrl.includes("/api/v1") ? apiUrl.replace("/api/v1", "") : apiUrl;
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanUrl}`;
};

// Tách YouTube Video ID từ URL
const getYoutubeID = (url) => {
  if (!url) return null;
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)\??v?=?([^#&?]*)).*/;
  const match = url.match(regExp);
  return match && match[7]?.length === 11 ? match[7] : null;
};

// Format giây → [MM:SS]
const formatTime = (seconds) => {
  if (seconds == null) return "[00:00]";
  const total = Math.floor(Number(seconds));
  const mins = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const secs = (total % 60).toString().padStart(2, "0");
  return `[${mins}:${secs}]`;
};

const CourseDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [midTab, setMidTab] = useState("TRANSCRIPT");
  const [isExportingPdf, setIsExportingPdf] = useState(false);



  // --- 📝 BỘ STATE QUẢN LÝ QUIZ TRẮC NGHIỆM TỰ ĐỘNG ---
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const isReadyRef = useRef(false);
  const lastSentRef = useRef(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // --- 📄 XUẤT PDF BỘ CÂU HỎI QUIZ ---
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Không tìm thấy Token! Bạn đã đăng nhập chưa?");
        return;
      }

      const videoTitle = courseData?.title || "Bài giảng";
      const encodedTitle = encodeURIComponent(videoTitle);

      const response = await fetch(
        `http://localhost:8080/api/v1/courses/${id}/quizzes/export-pdf?videoTitle=${encodedTitle}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        alert("Chưa có bộ câu hỏi nào! Hãy tạo Quiz trước khi xuất PDF.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Server trả về mã lỗi: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("[CourseDetail] Lỗi xuất PDF Quiz:", error.message);
      alert("Không thể xuất file PDF lúc này!");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // --- 💡 CÁC HÀM XỬ LÝ LOGIC QUIZ GỌI API THẬT ---
  const handleOpenQuiz = async () => {
    setIsQuizModalOpen(true);
    setUserAnswers({});
    setQuizResult(null);

    if (!courseData || !courseData.transcript) {
      alert("Dữ liệu bản ghi chữ (transcript) chưa sẵn sàng để tạo Quiz!");
      return;
    }

    try {
      setQuizLoading(true);
      const transcriptText = Array.isArray(courseData.transcript)
        ? courseData.transcript.map((item) => item.text || item.content).join(" ")
        : courseData.transcript;

      const data = await courseDetailApi.getOrGenerateQuiz(id, transcriptText);
      setQuizzes(data);
    } catch (error) {
      console.error("Lỗi tải bộ câu hỏi Quiz từ Backend:", error);
      alert("Không thể khởi tạo bộ câu hỏi trắc nghiệm lúc này!");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (quizId, optionId) => {
    if (quizResult?.isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      setQuizLoading(true);
      const result = await courseDetailApi.submitQuizAnswers(id, userAnswers);

      setQuizResult({
        score: result.score,
        correctCount: result.correctCount,
        wrongCount: result.wrongCount,
        isSubmitted: true,
        correctAnswers: result.correctAnswers,
      });
    } catch (error) {
      console.error("Lỗi nộp bài chấm điểm:", error);
      alert("Nộp bài thất bại, vui lòng kiểm tra lại kết nối!");
    } finally {
      setQuizLoading(false);
    }
  };

  // Gửi tiến độ lên server, debounce 5s, chỉ khi đang PLAYING
  const updateProgress = useCallback(async () => {
    const player = playerInstance.current;
    if (!player || !isReadyRef.current) return;

    const state = player.getPlayerState?.();
    if (state !== window.YT?.PlayerState?.PLAYING) return;

    const current = player.getCurrentTime();
    if (!current) return;

    const now = Date.now();
    if (now - lastSentRef.current < 5000) return;
    lastSentRef.current = now;

    await courseDetailApi.updateProgress(id, current);
  }, [id]);

  // Inject YouTube IFrame API script (1 lần)
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // Fetch dữ liệu bài học
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await courseDetailApi.getById(id);
        const data = res.result || res;
        setCourseData({
          title: data.title,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          videoId: getYoutubeID(data.videoUrl),
          summary: data.summary,
          keyPoints: data.keyPoints
            ? data.keyPoints.split("\n").filter((p) => p.trim() !== "")
            : [],
          transcript: data.summaryJson ? JSON.parse(data.summaryJson) : [],
        });
      } catch (error) {
        console.error("[CourseDetail] fetchDetail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5)
        console.info(`[CourseDetail] Session ${id} — ${timeSpent}s`);
    };
  }, [id]);

  // Khởi tạo YouTube Player
  useEffect(() => {
    if (!courseData?.videoId) return;

    const initPlayer = () => {
      if (!playerRef.current) return;
      playerInstance.current = new window.YT.Player(playerRef.current, {
        videoId: courseData.videoId,
        width: "100%",
        height: "100%",
        events: {
          onReady: async (event) => {
            isReadyRef.current = true;
            const duration = Math.floor(event.target.getDuration());
            if (duration > 0) {
              await courseDetailApi.saveDuration(id, { duration });
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    }
  }, [courseData?.videoId]);

  // Gọi updateProgress mỗi 5 giây
  useEffect(() => {
    if (!courseData?.videoId) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 5000);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [courseData?.videoId, updateProgress]);

  // Gửi progress lần cuối khi rời trang
  useEffect(() => {
    return () => {
      if (isReadyRef.current) updateProgress();
    };
  }, [updateProgress]);

  // Destroy player khi unmount
  useEffect(() => {
    return () => {
      playerInstance.current?.destroy?.();
      playerInstance.current = null;
      isReadyRef.current = false;
    };
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-800">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={18} className="text-blue-600" />
            <span className="font-medium text-sm text-blue-600">
              {t("course_detail.back")}
            </span>
          </button>
          <h1 className="font-bold text-lg uppercase tracking-wide">
            {courseData?.title || t("course_detail.summary")}
          </h1>
        </div>

        {/* KHU VỰC CÁC NÚT ĐIỀU HƯỚNG TÁC VỤ */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenQuiz}
            className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-100 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Zap size={16} fill="currentColor" className="animate-pulse" /> Tạo Quiz AI
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={16} />
            {isExportingPdf ? "Đang xuất..." : t("course_detail.export_pdf")}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* CỘT TRÁI: VIDEO + KEY POINTS */}
        <div className="flex-[7] flex flex-col p-6 overflow-y-auto border-r border-slate-100">
          {/* Video Player */}
          <div className="w-full h-[600px] bg-[#0B0A1A] rounded-2xl relative shadow-lg overflow-hidden mb-6">
            {courseData?.videoId ? (
              <div ref={playerRef} className="w-full h-full" />
            ) : courseData?.videoUrl ? (
              <video
                src={getFullUrl(courseData.videoUrl)}
                poster={getFullUrl(courseData.thumbnailUrl)}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                {t("course_detail.loading_video")}
              </div>
            )}
          </div>

          {/* Key Points */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm max-h-[200px] overflow-y-auto">
            <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase">
              {t("course_detail.key_points")}
            </h3>
            <ul className="space-y-2">
              {courseData?.keyPoints?.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* CỘT PHẢI: TRANSCRIPT & SUMMARY */}
        <div className="flex-[3] min-w-[350px] flex flex-col bg-white border-l border-slate-100">
          {/* Tab */}
          <div className="flex items-center gap-8 px-8 pt-8 border-b border-slate-100">
            {["TRANSCRIPT", "SUMMARY"].map((tab) => (
              <button
                key={tab}
                onClick={() => setMidTab(tab)}
                className={`pb-4 text-sm transition-all uppercase tracking-tighter ${
                  midTab === tab
                    ? "text-blue-600 font-black border-b-4 border-blue-600"
                    : "text-slate-300 font-bold hover:text-slate-500"
                }`}
              >
                {tab === "TRANSCRIPT"
                  ? t("course_detail.transcript")
                  : t("course_detail.summary")}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {midTab === "TRANSCRIPT" ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {courseData?.transcript?.map((item, idx) => (
                  <div
                    key={idx}
                    className="group cursor-pointer p-2 rounded-xl hover:bg-blue-50/50 transition-all"
                  >
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
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-blue-600 rounded-full" />
                  <h2 className="text-sm font-medium text-blue-600 tracking-tight">
                    {t("course_detail.executive_summary")}
                  </h2>
                </div>

                <div className="relative p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                  <Zap
                    size={60}
                    className="absolute -bottom-2 -right-2 text-slate-50"
                    fill="currentColor"
                  />
                  <div className="relative z-10">
                    <ul className="space-y-4">
                      {courseData?.summary ? (
                        (Array.isArray(courseData.summary)
                          ? courseData.summary.join(". ")
                          : courseData.summary
                        )
                          .split(".")
                          .map((s) => s.trim())
                          .filter((s) => s.length > 0)
                          .map((sentence, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                              <p className="text-[15px] text-slate-600 leading-relaxed">
                                {sentence}
                              </p>
                            </li>
                          ))
                      ) : (
                        <p className="text-[15px] text-slate-400 italic">
                          {t("course_detail.updating_summary")}
                        </p>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 opacity-20">
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                    {t("course_detail.ai_system_analysis")}
                  </p>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Zap size={24} fill="currentColor" className="animate-pulse" />
          </button>
        ) : (
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

      {/* 📝 OVERLAY MODAL LÀM QUIZ TRẮC NGHIỆM */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" /> Bài Kiểm Tra Trắc Nghiệm Bài Giảng (AI Generated)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dựa trên nội dung bản ghi chữ để sinh câu hỏi tự động
                </p>
              </div>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-200/60 w-8 h-8 rounded-full flex items-center justify-center transition-colors group"
              >
                <X size={16} className="transition-transform group-hover:rotate-90" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

              {quizLoading && quizzes.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-12">
                  <Zap size={40} className="text-amber-500 animate-bounce" fill="currentColor" />
                  <p className="text-sm font-medium text-slate-500 animate-pulse">
                    FlySpeech AI đang phân tích bài giảng và tạo bộ đề thi, vui lòng đợi giây lát...
                  </p>
                </div>
              )}

              {/* Bảng điểm kết quả */}
              {quizResult?.isSubmitted && (
                <div className="p-6 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-around text-center animate-in fade-in duration-300">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tổng Điểm</p>
                    <p className="text-4xl font-black text-blue-600 mt-1">{quizResult.score} / 10</p>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-200" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <CheckCircle2 size={14} className="text-green-600" /> Câu Đúng
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{quizResult.correctCount} câu</p>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-200" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <XCircle size={14} className="text-red-600" /> Câu Sai
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{quizResult.wrongCount} câu</p>
                  </div>
                </div>
              )}

              {/* Danh sách câu hỏi */}
              {!quizLoading &&
                quizzes.map((quiz, qIdx) => (
                  <div
                    key={quiz.id || qIdx}
                    className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 shadow-sm space-y-4"
                  >
                    <h4 className="font-bold text-base text-slate-900 flex items-start gap-2">
                      <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded mt-0.5 shrink-0">
                        Câu {qIdx + 1}
                      </span>
                      {quiz.question}
                    </h4>

                    {/* 4 Lựa chọn A, B, C, D */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quiz.options?.map((option, oIdx) => {
                        const isChosen = userAnswers[quiz.id] === option.id;
                        const isCorrect = quizResult?.correctAnswers?.[quiz.id] === option.id;

                        let optionStyle =
                          "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300";
                        if (isChosen)
                          optionStyle = "border-blue-500 bg-blue-50/60 text-blue-700 font-semibold";

                        if (quizResult?.isSubmitted) {
                          if (isCorrect) {
                            optionStyle = "border-green-500 bg-green-50 text-green-700 font-bold";
                          } else if (isChosen && !isCorrect) {
                            optionStyle = "border-red-500 bg-red-50 text-red-700 font-semibold";
                          } else {
                            optionStyle =
                              "border-slate-200 bg-white text-slate-400 opacity-60 pointer-events-none";
                          }
                        }

                        return (
                          <button
                            key={option.id || oIdx}
                            disabled={quizResult?.isSubmitted || quizLoading}
                            onClick={() => handleSelectOption(quiz.id, option.id)}
                            className={`w-full text-left p-3.5 border rounded-xl text-sm transition-all flex items-center justify-between gap-2 group ${optionStyle}`}
                          >
                            <span className="flex items-center gap-2">
                              <CircleDot
                                size={14}
                                className={`shrink-0 ${
                                  isChosen
                                    ? "text-blue-600"
                                    : "text-slate-300 group-hover:text-slate-400"
                                }`}
                              />
                              <span>
                                {String.fromCharCode(65 + oIdx)}. {option.content}
                              </span>
                            </span>
                            {quizResult?.isSubmitted && isCorrect && (
                              <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                            )}
                            {quizResult?.isSubmitted && isChosen && !isCorrect && (
                              <XCircle size={16} className="text-red-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Giải thích AI */}
                    {quizResult?.isSubmitted && (
                      <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-800 leading-relaxed animate-in slide-in-from-top-2 flex items-start gap-2">
                        <HelpCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Giải thích từ AI:</strong> {quiz.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsQuizModalOpen(false)}
                disabled={quizLoading}
                className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                {quizResult?.isSubmitted ? "Đóng lại" : "Hủy bỏ"}
              </button>

              {/* Nút xuất PDF — chỉ hiện sau khi nộp bài */}
              {quizResult?.isSubmitted && (
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={15} />
                  {isExportingPdf ? "Đang xuất..." : "Xuất PDF đề thi"}
                </button>
              )}

              {!quizResult?.isSubmitted && quizzes.length > 0 && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length === 0 || quizLoading}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:scale-[1.02] active:scale-95"
                >
                  {quizLoading ? "Đang xử lý..." : "Nộp bài chấm điểm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;