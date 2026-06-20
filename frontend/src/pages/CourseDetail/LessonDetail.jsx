import React, { useState, useEffect, useRef, useCallback } from "react";
import LoadingScreen from "../../components/common/LoadingScreen";
import { courseDetailApi, aiApi } from "../../api/CourseDetailApi";
import { 
  ArrowLeft, 
  MessageSquare,
  Zap,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  FileText,
  CheckCircle2,
  Lock,
  PlayCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Bot,
  Menu,
  X,
  Compass
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const safeUrl = url.replace(/#/g, "%23").replace(/\?/g, "%3F");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  if (safeUrl.startsWith("/uploads") && (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://"))) {
    return safeUrl;
  }
  const baseUrl = apiUrl.includes("/api/v1") ? apiUrl.replace("/api/v1", "") : apiUrl;
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanUrl = safeUrl.startsWith("/") ? safeUrl : `/${safeUrl}`;
  return `${cleanBase}${cleanUrl}`;
};

const getYoutubeID = (url) => {
  if (!url) return null;
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)\??v?=?([^#&?]*)).*/;
  const match = url.match(regExp);
  return match && match[7]?.length === 11 ? match[7] : null;
};

const LessonDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Collapsible Chapters state
  const [expandedChapters, setExpandedChapters] = useState({});

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const data = await courseDetailApi.getComments(id);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[LessonDetail] loadComments error:", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setSubmittingComment(true);
    try {
      const newComment = await courseDetailApi.addComment(id, newCommentText.trim());
      setNewCommentText("");
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("[LessonDetail] Post comment failed:", error);
      alert(t("lesson_detail.alert_comment_fail", { defaultValue: "Không thể đăng bình luận lúc này!" }));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const updatedComment = await courseDetailApi.likeComment(commentId);
      setComments((prev) =>
        prev.map((c) => (c.commentId === commentId ? { ...c, likes: updatedComment.likes } : c))
      );
    } catch (error) {
      console.error("[LessonDetail] Like comment failed:", error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const updatedComment = await courseDetailApi.dislikeComment(commentId);
      setComments((prev) =>
        prev.map((c) => (c.commentId === commentId ? { ...c, dislikes: updatedComment.dislikes } : c))
      );
    } catch (error) {
      console.error("[LessonDetail] Dislike comment failed:", error);
    }
  };

  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const isReadyRef = useRef(false);
  const lastSentRef = useRef(0);
  const intervalRef = useRef(null);

  // Send progress to server
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

    const resolvedId = courseData?.learningSessionId || id;
    await courseDetailApi.updateProgress(resolvedId, current);
  }, [id, courseData]);

  const handleHtml5LoadedMetadata = async (e) => {
    const duration = Math.floor(e.target.duration);
    if (duration > 0) {
      await courseDetailApi.saveDuration(id, { duration });
    }
  };

  const handleHtml5TimeUpdate = async (e) => {
    const videoElement = e.target;
    if (videoElement.paused) return;

    const current = videoElement.currentTime;
    if (!current) return;

    const now = Date.now();
    if (now - lastSentRef.current < 5000) return;
    lastSentRef.current = now;

    const resolvedId = courseData?.learningSessionId || id;
    await courseDetailApi.updateProgress(resolvedId, current);
  };

  // Inject YouTube IFrame API script
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // Fetch lesson details
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await courseDetailApi.getLessonSession(id);
        const data = res.result || res;
        setCourseData({
          title: data.title,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          videoId: getYoutubeID(data.videoUrl),
          learningSessionId: data.learningSessionId,
          transcript: data.transcript,
          summaryJson: data.summaryJson,
          courseId: data.courseId,
          chapter: data.chapter,
          documentUrl: data.documentUrl,
          documentName: data.documentName
        });
      } catch (error) {
        console.error("[LessonDetail] fetchDetail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // Fetch course lessons list when courseId is resolved
  useEffect(() => {
    const fetchCourseLessons = async () => {
      if (!courseData?.courseId) return;
      try {
        const data = await courseDetailApi.getLessonsByCourse(courseData.courseId);
        setCourseLessons(data || []);
      } catch (err) {
        console.error("Lỗi tải danh sách bài học khóa học:", err);
      }
    };
    fetchCourseLessons();
  }, [courseData?.courseId]);

  // Auto expand active lesson's chapter
  useEffect(() => {
    if (courseData?.chapter) {
      setExpandedChapters((prev) => ({
        ...prev,
        [courseData.chapter]: true
      }));
    }
  }, [courseData?.chapter]);

  // Load chat history for the active lesson session
  useEffect(() => {
    const loadChatHistory = async () => {
      const resolvedId = courseData?.learningSessionId || id;
      try {
        const history = await courseDetailApi.getChatHistory(resolvedId);
        if (history?.content?.length) {
          const formatted = history.content.map((m) => ({
            role: m.isAi ? "ai" : "user",
            content: m.content,
          }));
          setChatMessages([{ role: "ai", content: t("ai_chat.welcome", { defaultValue: "Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?" }) }, ...formatted]);
        } else {
          setChatMessages([{ role: "ai", content: t("ai_chat.welcome", { defaultValue: "Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?" }) }]);
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử chatbot:", err);
        setChatMessages([{ role: "ai", content: t("ai_chat.welcome", { defaultValue: "Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?" }) }]);
      }
    };
    if (courseData) {
      loadChatHistory();
    }
  }, [id, courseData?.learningSessionId, t]);

  // Send message to AI
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const textToSend = chatInput.trim();
    const userMsg = { role: "user", content: textToSend };
    const currentMessages = [...chatMessages, userMsg];

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    const resolvedId = courseData?.learningSessionId || id;
    courseDetailApi.sendMessage(resolvedId, textToSend).catch(console.warn);

    try {
      const transcriptText = courseData?.transcript ? (
        Array.isArray(courseData.transcript)
          ? courseData.transcript.map(item => item.text || item.content || item).join(" ")
          : courseData.transcript
      ) : "";

      const res = await aiApi.chat(resolvedId, textToSend, currentMessages, transcriptText);
      setChatMessages((prev) => [...prev, { role: "ai", content: res?.answer || t("ai_chat.not_answer", { defaultValue: "AI không trả lời được lúc này." }) }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "ai", content: t("ai_chat.error_message", { defaultValue: "Đã xảy ra lỗi kết nối với máy chủ AI." }) }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll chatbot to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  // Initialize YouTube Player
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
  }, [courseData?.videoId, id]);

  // Update progress timer
  useEffect(() => {
    if (!courseData?.videoId) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 5000);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [courseData?.videoId, updateProgress]);

  // Clean up players
  useEffect(() => {
    return () => {
      playerInstance.current?.destroy?.();
      playerInstance.current = null;
      isReadyRef.current = false;
    };
  }, []);

  if (loading) return <LoadingScreen />;

  // Group lessons by Chapter
  const chaptersList = (() => {
    const groups = {};
    courseLessons.forEach((ls) => {
      const chapName = ls.chapter || t("course_detail.general_chapter", { defaultValue: "Tổng quan khóa học" });
      if (!groups[chapName]) groups[chapName] = [];
      groups[chapName].push(ls);
    });
    return Object.entries(groups).map(([name, list]) => ({
      chapterName: name,
      lessons: list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    }));
  })();

  const activeLessonIndex = courseLessons.findIndex(l => l.lessonId === Number(id));
  const progressText = courseLessons.length > 0 
    ? `${activeLessonIndex >= 0 ? activeLessonIndex + 1 : 0} / ${courseLessons.length} bài học` 
    : "0 bài học";

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="text-blue-600 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-semibold text-xs text-blue-600 select-none">Quay lại</span>
          </button>

          <div className="w-[1px] h-5 bg-slate-200 hidden sm:block" />

          {/* Logo & Title */}
          <div className="flex items-center gap-2 select-none">
            <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl p-1.5 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-100">
              <Zap size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xs text-slate-800">AI-Learning</span>
              <span className="text-indigo-600 font-black text-[10px]">DASHBOARD</span>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-slate-200 hidden md:block" />
          
          <h1 className="font-bold text-sm text-slate-900 line-clamp-1 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            {courseData?.title}
          </h1>
        </div>

        {/* Right Buttons: Mobile toggle + Language Switcher */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* CORE VIEW */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT COMPONENT: Video Player + Tabs Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">
          {/* Video Container */}
          <div className="w-full aspect-video bg-[#000000] rounded-2xl relative shadow-lg overflow-hidden border border-slate-900 shrink-0">
            {courseData?.videoId ? (
              <div ref={playerRef} className="w-full h-full" />
            ) : courseData?.videoUrl ? (
              <video
                src={getFullUrl(courseData.videoUrl)}
                poster={getFullUrl(courseData.thumbnailUrl)}
                controls
                className="w-full h-full"
                onLoadedMetadata={handleHtml5LoadedMetadata}
                onTimeUpdate={handleHtml5TimeUpdate}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                {t("course_detail.loading_video", { defaultValue: "Đang tải video..." })}
              </div>
            )}
          </div>

          {/* Title bar */}
          <div className="mt-5 shrink-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              {courseData?.title}
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
              <Compass size={12} className="text-indigo-500" />
              <span>{courseData?.chapter || "Chương tổng quan"}</span>
            </p>
          </div>

          {/* Udemy Tabs Navigation */}
          <div className="flex border-b border-slate-200 mt-6 overflow-x-auto shrink-0 select-none scrollbar-none">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "documents"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText size={15} />
              Tài liệu học tập
            </button>
            <button
              onClick={() => setActiveTab("discussion")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "discussion"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare size={15} />
              Thảo luận
            </button>
            <button
              onClick={() => setActiveTab("ai_chat")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ai_chat"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Bot size={15} className={activeTab === "ai_chat" ? "text-indigo-500" : ""} />
              Trợ lý AI
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="flex-1 py-6">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Giới thiệu bài học</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Chào mừng bạn đến với bài học này. Hãy xem kỹ nội dung video bài giảng để nắm chắc kiến thức cốt lõi. Bạn có thể sử dụng tab Thảo luận để giao lưu cùng các học viên khác hoặc chuyển sang tab Trợ lý AI để đặt câu hỏi trực tiếp dựa trên nội dung video.
                  </p>
                </div>
              </div>
            )}

            {/* 2. DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    <span>Tài liệu đính kèm từ Giảng viên</span>
                  </h3>
                  
                  {courseData?.documentUrl ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-600 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate" title={courseData.documentName || "Tài liệu học tập"}>
                            {courseData.documentName || "Tài liệu đính kèm"}
                          </p>
                          <span className="text-[10px] bg-slate-200/80 text-slate-500 rounded px-1.5 py-0.5 font-bold uppercase mt-1 inline-block">
                            {courseData.documentUrl.split('.').pop() || "PDF"}
                          </span>
                        </div>
                      </div>
                      <a
                        href={getFullUrl(courseData.documentUrl)}
                        download={courseData.documentName || "Tài liệu học tập"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 active:scale-95 transition shrink-0 shadow-sm"
                      >
                        <Download size={14} />
                        Tải về tài liệu
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      Bài học này chưa được giảng viên đính kèm thêm tài liệu PDF/Word nào.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. DISCUSSION TAB */}
            {activeTab === "discussion" && (
              <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                    <MessageSquare size={16} className="text-blue-600" />
                    <span>Thảo luận bài học ({comments.length})</span>
                  </h3>
                  
                  <form onSubmit={handlePostComment} className="space-y-3">
                    <textarea
                      rows="3"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Nhập nội dung câu hỏi hoặc ý kiến đóng góp của bạn..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none bg-white text-slate-800"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment || !newCommentText.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submittingComment ? "Đang gửi..." : "Gửi bình luận"}
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {commentsLoading ? (
                      <p className="text-center text-xs text-slate-400">Đang tải bình luận...</p>
                    ) : comments.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 italic py-4">Chưa có bình luận nào. Hãy bắt đầu cuộc thảo luận đầu tiên!</p>
                    ) : (
                      comments.map((comment) => {
                        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          comment.userFullName || comment.username || "Student"
                        )}&background=random&color=fff&rounded=true&size=64`;
                        
                        return (
                          <div key={comment.commentId} className="flex gap-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100/80 hover:bg-slate-50 transition-colors">
                            <img
                              src={avatarUrl}
                              alt="Avatar"
                              className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {comment.userFullName || comment.username || "Học viên"}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString("vi-VN") : ""}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4 pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleLike(comment.commentId)}
                                  className="flex items-center gap-1 text-slate-400 hover:text-blue-600 active:scale-90 transition cursor-pointer"
                                >
                                  <ThumbsUp size={12} />
                                  <span className="text-[10px] font-medium">{comment.likes || 0}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDislike(comment.commentId)}
                                  className="flex items-center gap-1 text-slate-400 hover:text-red-500 active:scale-90 transition cursor-pointer"
                                >
                                  <ThumbsDown size={12} />
                                  <span className="text-[10px] font-medium">{comment.dislikes || 0}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. AI CHAT TAB */}
            {activeTab === "ai_chat" && (
              <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[420px] overflow-hidden">
                  
                  {/* Chat Message Scroll Panel */}
                  <div
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20 custom-scrollbar"
                  >
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                            msg.role === "user" ? "bg-slate-700" : "bg-gradient-to-tr from-blue-700 to-indigo-600"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <span className="text-[8px] font-bold">ME</span>
                          ) : (
                            <Zap size={13} fill="currentColor" className="text-amber-400" />
                          )}
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm max-w-[80%] whitespace-pre-line ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                          }`}
                        >
                          {msg.role === "ai" ? (
                            <ReactMarkdown
                              components={{
                                p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                                li: (props) => <li className="ml-4 list-disc" {...props} />,
                                strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                        <Zap size={10} className="animate-spin text-blue-500" />
                        <span>AI đang phân tích bài học và phản hồi...</span>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setInput ? setChatInput(e.target.value) : setChatInput(e.target.value)}
                      placeholder="Đặt câu hỏi về nội dung video bài giảng này..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md active:scale-95 flex items-center justify-center disabled:opacity-50 transition cursor-pointer"
                    >
                      <Zap size={14} className="fill-current text-amber-400 mr-1" />
                      <span className="text-xs font-bold">Hỏi AI</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT SIDEBAR: Course Curriculum Accordion (Desktop default) */}
        <aside className="hidden lg:flex w-[350px] xl:w-[380px] shrink-0 border-l border-slate-200 bg-white flex-col h-full shadow-sm">
          {/* Sidebar Title */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm">Nội dung khóa học</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">{progressText}</p>
          </div>

          {/* Accordion List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {chaptersList.map((chap, chapIdx) => {
              const isOpen = expandedChapters[chap.chapterName] || false;
              return (
                <div key={chapIdx} className="flex flex-col">
                  {/* Accordion Chapter Header */}
                  <div
                    onClick={() => setExpandedChapters({
                      ...expandedChapters,
                      [chap.chapterName]: !isOpen
                    })}
                    className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition duration-150 cursor-pointer select-none border-b border-slate-100"
                  >
                    <span className="font-bold text-xs text-slate-700 line-clamp-1 pr-2">
                      {chap.chapterName}
                    </span>
                    {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </div>

                  {/* Accordion Lesson List */}
                  {isOpen && (
                    <div className="flex flex-col bg-white">
                      {chap.lessons.map((ls) => {
                        const isActive = Number(id) === ls.lessonId;
                        return (
                          <div
                            key={ls.lessonId}
                            onClick={() => navigate(`/app/lessons/${ls.lessonId}`)}
                            className={`flex items-center justify-between px-4 py-3 border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition ${
                              isActive ? "bg-blue-50/70 border-l-4 border-l-blue-600 pl-3 font-bold text-blue-700" : "text-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isActive ? (
                                <PlayCircle size={14} className="text-blue-600 shrink-0" />
                              ) : (
                                <CheckCircle2 size={14} className="text-slate-300 shrink-0" />
                              )}
                              <span className="text-xs truncate" title={ls.title}>
                                {ls.title}
                              </span>
                            </div>
                            {ls.documentUrl && (
                              <FileText size={12} className="text-emerald-500 shrink-0 ml-1.5" title="Đính kèm tài liệu" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* MOBILE DRAWER SIDEBAR (Triggered by menu button) */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Drawer Body */}
            <div className="relative ml-auto w-[280px] sm:w-[320px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Nội dung khóa học</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{progressText}</p>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {chaptersList.map((chap, chapIdx) => {
                  const isOpen = expandedChapters[chap.chapterName] || false;
                  return (
                    <div key={chapIdx} className="flex flex-col">
                      <div
                        onClick={() => setExpandedChapters({
                          ...expandedChapters,
                          [chap.chapterName]: !isOpen
                        })}
                        className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition cursor-pointer select-none border-b border-slate-100"
                      >
                        <span className="font-bold text-[11px] text-slate-700 line-clamp-1 pr-2">
                          {chap.chapterName}
                        </span>
                        {isOpen ? <ChevronUp size={12} className="text-slate-500" /> : <ChevronDown size={12} className="text-slate-500" />}
                      </div>

                      {isOpen && (
                        <div className="flex flex-col bg-white">
                          {chap.lessons.map((ls) => {
                            const isActive = Number(id) === ls.lessonId;
                            return (
                              <div
                                key={ls.lessonId}
                                onClick={() => {
                                  navigate(`/app/lessons/${ls.lessonId}`);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`flex items-center justify-between px-4 py-2.5 border-b border-slate-50 hover:bg-slate-50 transition ${
                                  isActive ? "bg-blue-50/70 border-l-4 border-l-blue-600 pl-3 font-bold text-blue-700" : "text-slate-600"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {isActive ? (
                                    <PlayCircle size={13} className="text-blue-600 shrink-0" />
                                  ) : (
                                    <CheckCircle2 size={13} className="text-slate-300 shrink-0" />
                                  )}
                                  <span className="text-[11px] truncate" title={ls.title}>
                                    {ls.title}
                                  </span>
                                </div>
                                {ls.documentUrl && (
                                  <FileText size={11} className="text-emerald-500 shrink-0 ml-1" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LessonDetail;
