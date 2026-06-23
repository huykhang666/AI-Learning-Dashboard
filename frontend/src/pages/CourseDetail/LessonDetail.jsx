import React, { useState, useEffect, useRef, useCallback } from "react";
import LoadingScreen from "../../components/common/LoadingScreen";
import { courseDetailApi, aiApi } from "../../api/CourseDetailApi";
import {
  ArrowLeft,
  MessageSquare,
  Zap,
  ThumbsUp,
  ThumbsDown,
  FileText,
  CheckCircle2,
  PlayCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Bot,
  Menu,
  X,
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  Gauge,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

// ─── helpers ────────────────────────────────────────────────────────────────
const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const safeUrl = url.replace(/#/g, "%23").replace(/\?/g, "%3F");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  if (
    safeUrl.startsWith("/uploads") &&
    !apiUrl.startsWith("http://") &&
    !apiUrl.startsWith("https://")
  )
    return safeUrl;
  const baseUrl = apiUrl.includes("/api/v1")
    ? apiUrl.replace("/api/v1", "")
    : apiUrl;
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanUrl = safeUrl.startsWith("/") ? safeUrl : `/${safeUrl}`;
  return `${cleanBase}${cleanUrl}`;
};

const getYoutubeID = (url) => {
  if (!url) return null;
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ─── Custom HTML5 Video Player ───────────────────────────────────────────────
const CustomVideoPlayer = ({
  src,
  poster,
  onLoadedMetadata,
  onTimeUpdate,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const hideControlsTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCenterPlay, setShowCenterPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // ── Controls visibility ──
  const revealControls = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  // ── Toggle play/pause ──
  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
    // Flash center icon
    setShowCenterPlay(true);
    setTimeout(() => setShowCenterPlay(false), 600);
  };

  // ── Video events ──
  const handleVideoPlay = () => setPlaying(true);
  const handleVideoPause = () => {
    setPlaying(false);
    setShowControls(true);
  };

  const handleTimeUpdate = (e) => {
    const vid = e.target;
    setCurrentTime(vid.currentTime);
    // Update buffer
    if (vid.buffered.length > 0) {
      setBuffered((vid.buffered.end(vid.buffered.length - 1) / vid.duration) * 100);
    }
    if (onTimeUpdate) onTimeUpdate(e);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
    if (onLoadedMetadata) onLoadedMetadata(e);
  };

  // ── Seek ──
  const handleSeek = (e) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  // ── Volume ──
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  // ── Speed ──
  const setSpeed = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  // ── Fullscreen ──
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowRight") { if (videoRef.current) videoRef.current.currentTime += 10; }
      if (e.code === "ArrowLeft") { if (videoRef.current) videoRef.current.currentTime -= 10; }
      if (e.code === "KeyM") toggleMute();
      if (e.code === "KeyF") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playing]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group select-none"
      onMouseMove={revealControls}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      onClick={(e) => {
        // Only toggle if clicking on the video background, not controls
        if (e.target === containerRef.current || e.target === videoRef.current) togglePlay();
      }}
    >
      {/* VIDEO ELEMENT */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        preload="metadata"
      />

      {/* CENTER PLAY/PAUSE FLASH */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          showCenterPlay ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-blue-600/80 backdrop-blur-sm rounded-full p-5 shadow-2xl">
          {playing ? (
            <Play size={40} className="text-white fill-white" />
          ) : (
            <Pause size={40} className="text-white fill-white" />
          )}
        </div>
      </div>

      {/* LARGE CENTER PLAY BUTTON (when paused and controls visible) */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
          style={{ background: "transparent" }}
        >
          <div className="bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-full p-5 shadow-2xl shadow-blue-500/40 transition-all duration-200 group-hover/play:scale-110">
            <Play size={44} className="text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* CONTROLS OVERLAY */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)",
        }}
      >
        {/* ─ Bottom Controls ─ */}
        <div className="pointer-events-auto px-4 pb-3 pt-6 flex flex-col gap-2">

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-white text-[11px] font-mono w-10 text-right shrink-0">
              {formatTime(currentTime)}
            </span>

            <div
              ref={progressRef}
              className="relative flex-1 h-1.5 rounded-full bg-white/20 cursor-pointer group/prog"
              onClick={handleSeek}
            >
              {/* Buffered */}
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-white/30 pointer-events-none"
                style={{ width: `${buffered}%` }}
              />
              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-blue-500 pointer-events-none transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-blue-400/50 pointer-events-none opacity-0 group-hover/prog:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 7px)` }}
              />
            </div>

            <span className="text-white/60 text-[11px] font-mono w-10 shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between">
            {/* LEFT: Play + Volume */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 active:scale-90 transition cursor-pointer"
                title={playing ? "Tạm dừng (Space)" : "Phát (Space)"}
              >
                {playing ? (
                  <Pause size={20} className="fill-current" />
                ) : (
                  <Play size={20} className="fill-current ml-0.5" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition cursor-pointer"
                  title="Tắt/bật tiếng (M)"
                >
                  <VolumeIcon size={18} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-blue-500 cursor-pointer h-1"
                  title="Âm lượng"
                />
              </div>
            </div>

            {/* RIGHT: Speed + Fullscreen */}
            <div className="flex items-center gap-3 relative">
              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu((p) => !p)}
                  className="flex items-center gap-1 text-white hover:text-blue-400 transition text-xs font-bold cursor-pointer px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
                  title="Tốc độ phát"
                >
                  <Gauge size={13} />
                  <span>{playbackRate}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-8 right-0 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl py-1.5 shadow-2xl z-50 min-w-[90px]">
                    <p className="text-[9px] text-slate-500 uppercase font-bold px-3 pb-1 border-b border-slate-700/50 mb-1">
                      Tốc độ
                    </p>
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`w-full text-left px-3 py-1.5 text-xs transition cursor-pointer ${
                          playbackRate === s
                            ? "text-blue-400 font-bold bg-blue-900/30"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {s === 1 ? "Bình thường" : `${s}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition cursor-pointer"
                title="Toàn màn hình (F)"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const LessonDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [expandedChapters, setExpandedChapters] = useState({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Chatbot
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // YT refs
  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const isReadyRef = useRef(false);
  const lastSentRef = useRef(0);
  const intervalRef = useRef(null);

  // ── Comments ──────────────────────────────────────────────────────────────
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

  useEffect(() => { loadComments(); }, [loadComments]);

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
      alert("Không thể đăng bình luận lúc này!");
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
        prev.map((c) =>
          c.commentId === commentId ? { ...c, dislikes: updatedComment.dislikes } : c
        )
      );
    } catch (error) {
      console.error("[LessonDetail] Dislike comment failed:", error);
    }
  };

  // ── Progress tracking ─────────────────────────────────────────────────────
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
    if (duration > 0) await courseDetailApi.saveDuration(id, { duration });
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

  // ── YouTube API ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // ── Fetch data ────────────────────────────────────────────────────────────
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
          documentName: data.documentName,
        });
      } catch (error) {
        console.error("[LessonDetail] fetchDetail error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchCourseLessons = async () => {
      if (!courseData?.courseId) return;
      try {
        const data = await courseDetailApi.getLessonsByCourse(courseData.courseId);
        setCourseLessons(data || []);
      } catch (err) {
        console.error("Lỗi tải danh sách bài học:", err);
      }
    };
    fetchCourseLessons();
  }, [courseData?.courseId]);

  useEffect(() => {
    if (courseData?.chapter) {
      setExpandedChapters((prev) => ({ ...prev, [courseData.chapter]: true }));
    }
  }, [courseData?.chapter]);

  // ── Chatbot ───────────────────────────────────────────────────────────────
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
          setChatMessages([
            { role: "ai", content: "Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?" },
            ...formatted,
          ]);
        } else {
          setChatMessages([
            { role: "ai", content: "Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?" },
          ]);
        }
      } catch (err) {
        setChatMessages([
          { role: "ai", content: "Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?" },
        ]);
      }
    };
    if (courseData) loadChatHistory();
  }, [id, courseData?.learningSessionId]);

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
      const transcriptText = courseData?.transcript
        ? Array.isArray(courseData.transcript)
          ? courseData.transcript.map((item) => item.text || item.content || item).join(" ")
          : courseData.transcript
        : "";
      const res = await aiApi.chat(resolvedId, textToSend, currentMessages, transcriptText);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: res?.answer || "AI không trả lời được lúc này." },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "Đã xảy ra lỗi kết nối với máy chủ AI." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  // ── YouTube Player init ───────────────────────────────────────────────────
  useEffect(() => {
    if (!courseData?.videoId) return;
    const initPlayer = () => {
      if (!playerRef.current) return;
      playerInstance.current = new window.YT.Player(playerRef.current, {
        videoId: courseData.videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: async (event) => {
            isReadyRef.current = true;
            const duration = Math.floor(event.target.getDuration());
            if (duration > 0) await courseDetailApi.saveDuration(id, { duration });
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

  useEffect(() => {
    if (!courseData?.videoId) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 5000);
    return () => { clearInterval(intervalRef.current); intervalRef.current = null; };
  }, [courseData?.videoId, updateProgress]);

  useEffect(() => {
    return () => {
      playerInstance.current?.destroy?.();
      playerInstance.current = null;
      isReadyRef.current = false;
    };
  }, []);

  if (loading) return <LoadingScreen />;

  // ── Chapter grouping ──────────────────────────────────────────────────────
  const chaptersList = (() => {
    const groups = {};
    courseLessons.forEach((ls) => {
      const chapName = ls.chapter || "Tổng quan khóa học";
      if (!groups[chapName]) groups[chapName] = [];
      groups[chapName].push(ls);
    });
    return Object.entries(groups).map(([name, list]) => ({
      chapterName: name,
      lessons: list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)),
    }));
  })();

  const activeLessonIndex = courseLessons.findIndex((l) => l.lessonId === Number(id));
  const progressText =
    courseLessons.length > 0
      ? `${activeLessonIndex >= 0 ? activeLessonIndex + 1 : 0} / ${courseLessons.length} bài học`
      : "0 bài học";

  // ── Sidebar lesson list (reusable) ────────────────────────────────────────
  const SidebarLessons = ({ onNavigate }) => (
    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
      {chaptersList.map((chap, chapIdx) => {
        const isOpen = expandedChapters[chap.chapterName] || false;
        return (
          <div key={chapIdx} className="flex flex-col">
            <div
              onClick={() =>
                setExpandedChapters({ ...expandedChapters, [chap.chapterName]: !isOpen })
              }
              className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition duration-150 cursor-pointer select-none border-b border-slate-100"
            >
              <span className="font-bold text-xs text-slate-700 line-clamp-1 pr-2">
                {chap.chapterName}
              </span>
              {isOpen ? (
                <ChevronUp size={14} className="text-slate-500" />
              ) : (
                <ChevronDown size={14} className="text-slate-500" />
              )}
            </div>

            {isOpen && (
              <div className="flex flex-col bg-white">
                {chap.lessons.map((ls) => {
                  const isActive = Number(id) === ls.lessonId;
                  return (
                    <div
                      key={ls.lessonId}
                      onClick={() => onNavigate(ls.lessonId)}
                      className={`flex items-center justify-between px-4 py-3 border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition ${
                        isActive
                          ? "bg-blue-50/70 border-l-4 border-l-blue-600 pl-3 font-bold text-blue-700"
                          : "text-slate-600"
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
                        <FileText
                          size={12}
                          className="text-emerald-500 shrink-0 ml-1.5"
                          title="Đính kèm tài liệu"
                        />
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
  );

  // ── Render ────────────────────────────────────────────────────────────────
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

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* LEFT: Video + Tabs */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">

          {/* ── Video Container ── */}
          <div className="w-full aspect-video bg-black rounded-2xl relative shadow-xl overflow-hidden border border-slate-900 shrink-0">
            {courseData?.videoId ? (
              /* YouTube embed */
              <div ref={playerRef} className="w-full h-full" />
            ) : courseData?.videoUrl ? (
              /* Custom HTML5 Player */
              <CustomVideoPlayer
                src={getFullUrl(courseData.videoUrl)}
                poster={getFullUrl(courseData.thumbnailUrl)}
                onLoadedMetadata={handleHtml5LoadedMetadata}
                onTimeUpdate={handleHtml5TimeUpdate}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                Đang tải video...
              </div>
            )}
          </div>

          {/* ── Title bar ── */}
          <div className="mt-5 shrink-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              {courseData?.title}
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
              <Compass size={12} className="text-indigo-500" />
              <span>{courseData?.chapter || "Chương tổng quan"}</span>
            </p>
          </div>

          {/* ── Tabs Navigation ── */}
          <div className="flex border-b border-slate-200 mt-6 overflow-x-auto shrink-0 select-none scrollbar-none">
            {[
              { key: "overview", label: "Tổng quan" },
              { key: "documents", label: "Tài liệu học tập", icon: <FileText size={15} /> },
              { key: "discussion", label: "Thảo luận", icon: <MessageSquare size={15} /> },
              { key: "ai_chat", label: "Trợ lý AI", icon: <Bot size={15} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 py-6">

            {/* 1. OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-4 max-w-4xl">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
                    Giới thiệu bài học
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Chào mừng bạn đến với bài học này. Hãy xem kỹ nội dung video bài giảng để nắm
                    chắc kiến thức cốt lõi. Bạn có thể sử dụng tab Thảo luận để giao lưu cùng các
                    học viên khác hoặc chuyển sang tab Trợ lý AI để đặt câu hỏi trực tiếp dựa trên
                    nội dung video.
                  </p>
                </div>
              </div>
            )}

            {/* 2. DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="space-y-4 max-w-4xl">
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
                          <p
                            className="font-bold text-slate-800 text-sm truncate"
                            title={courseData.documentName || "Tài liệu học tập"}
                          >
                            {courseData.documentName || "Tài liệu đính kèm"}
                          </p>
                          <span className="text-[10px] bg-slate-200/80 text-slate-500 rounded px-1.5 py-0.5 font-bold uppercase mt-1 inline-block">
                            {courseData.documentUrl.split(".").pop() || "PDF"}
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

            {/* 3. DISCUSSION */}
            {activeTab === "discussion" && (
              <div className="space-y-4 max-w-4xl">
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
                      <p className="text-center text-xs text-slate-400 italic py-4">
                        Chưa có bình luận nào. Hãy bắt đầu cuộc thảo luận đầu tiên!
                      </p>
                    ) : (
                      comments.map((comment) => {
                        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          comment.userFullName || comment.username || "Student"
                        )}&background=random&color=fff&rounded=true&size=64`;
                        return (
                          <div
                            key={comment.commentId}
                            className="flex gap-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100/80 hover:bg-slate-50 transition-colors"
                          >
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
                                  {comment.createdAt
                                    ? new Date(comment.createdAt).toLocaleString("vi-VN")
                                    : ""}
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
                                  <span className="text-[10px] font-medium">
                                    {comment.likes || 0}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDislike(comment.commentId)}
                                  className="flex items-center gap-1 text-slate-400 hover:text-red-500 active:scale-90 transition cursor-pointer"
                                >
                                  <ThumbsDown size={12} />
                                  <span className="text-[10px] font-medium">
                                    {comment.dislikes || 0}
                                  </span>
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

            {/* 4. AI CHAT */}
            {activeTab === "ai_chat" && (
              <div className="space-y-4 max-w-4xl">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[420px] overflow-hidden">
                  <div
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20"
                  >
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                            msg.role === "user"
                              ? "bg-slate-700"
                              : "bg-gradient-to-tr from-blue-700 to-indigo-600"
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
                                strong: (props) => (
                                  <strong className="font-semibold text-slate-900" {...props} />
                                ),
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
                        <span>AI đang phân tích và phản hồi...</span>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleSendChatMessage}
                    className="p-3 bg-white border-t border-slate-100 flex gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
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

        {/* RIGHT SIDEBAR – Desktop */}
        <aside className="hidden lg:flex w-[350px] xl:w-[380px] shrink-0 border-l border-slate-200 bg-white flex-col h-full shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm">Nội dung khóa học</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">{progressText}</p>
          </div>
          <SidebarLessons onNavigate={(lessonId) => navigate(`/app/lessons/${lessonId}`)} />
        </aside>

        {/* MOBILE DRAWER */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative ml-auto w-[280px] sm:w-[320px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
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
              <SidebarLessons
                onNavigate={(lessonId) => {
                  navigate(`/app/lessons/${lessonId}`);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
