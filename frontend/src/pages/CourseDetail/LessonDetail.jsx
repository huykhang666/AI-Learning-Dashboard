import React, { useState, useEffect, useRef, useCallback } from "react";
import LoadingScreen from "../../components/common/LoadingScreen";
import { courseDetailApi, aiApi } from "../../api/CourseDetailApi";
import { 
  ArrowLeft, 
  MessageSquare,
  Zap,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AIChatBox from "../../components/common/AIChatBox";

const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads")) return url;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const baseUrl = apiUrl.includes("/api/v1") ? apiUrl.replace("/api/v1", "") : apiUrl;
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);

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

    // Use resolved learningSessionId or id
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

  // Inject YouTube IFrame API script (1 lần)
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // Fetch lesson data
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
          learningSessionId: data.learningSessionId
        });
      } catch (error) {
        console.error("[LessonDetail] fetchDetail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
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
  }, [courseData?.videoId, courseData?.learningSessionId, id]);

  // Gọi updateProgress mỗi 5 giây cho YouTube
  useEffect(() => {
    if (!courseData?.videoId) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 5000);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [courseData?.videoId, updateProgress]);

  // Destroy player và cleanup
  useEffect(() => {
    return () => {
      playerInstance.current?.destroy?.();
      playerInstance.current = null;
      isReadyRef.current = false;
    };
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shrink-0 shadow-sm">
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
          <h1 className="font-bold text-lg uppercase tracking-wide text-slate-900">
            {courseData?.title}
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
        <div className="w-full aspect-video bg-[#0B0A1A] rounded-2xl relative shadow-lg overflow-hidden mb-6">
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
              {t("course_detail.loading_video")}
            </div>
          )}
        </div>

        {/* Title and details */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-xl text-slate-900 mb-2">{courseData?.title}</h2>
          <p className="text-sm text-slate-500">
            Chào mừng bạn đến với bài học này. Hãy xem kỹ nội dung video và tham gia thảo luận bên dưới nếu có thắc mắc nhé.
          </p>
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4 mb-12">
          <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-600" />
            <span>Thảo luận bài học ({comments.length})</span>
          </h3>
          
          {/* Form viết bình luận */}
          <form onSubmit={handlePostComment} className="space-y-3">
            <textarea
              rows="3"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Nhập nội dung thảo luận hoặc thắc mắc của bạn..."
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

          {/* Danh sách bình luận */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {commentsLoading ? (
              <p className="text-center text-xs text-slate-400">Đang tải bình luận...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-xs text-slate-400 italic py-4">Chưa có thảo luận nào. Hãy bắt đầu cuộc thảo luận đầu tiên!</p>
            ) : (
              comments.map((comment) => {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  comment.userFullName || comment.username || "Học viên"
                )}&background=random&color=fff&rounded=true&size=64`;
                
                return (
                  <div key={comment.commentId} className="flex gap-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100/80 hover:bg-slate-50 transition-colors">
                    {/* Avatar */}
                    <img
                      src={avatarUrl}
                      alt={comment.userFullName || comment.username || "User"}
                      className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {comment.userFullName || comment.username || "Học viên"}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString("vi-VN") : ""}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => handleLike(comment.commentId)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 active:scale-90 transition"
                          title="Thích"
                        >
                          <ThumbsUp size={13} />
                          <span className="text-[11px] font-medium">{comment.likes || 0}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDislike(comment.commentId)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 active:scale-90 transition"
                          title="Không thích"
                        >
                          <ThumbsDown size={13} />
                          <span className="text-[11px] font-medium">{comment.dislikes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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
              sessionId={courseData?.learningSessionId || id}
              courseDetailApi={courseDetailApi}
              aiApi={aiApi}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
