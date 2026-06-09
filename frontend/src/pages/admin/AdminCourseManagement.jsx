import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  Upload,
  X,
  MessageSquare,
  Search,
  CheckCircle2,
  DollarSign,
  Video,
  Image as ImageIcon,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  PlayCircle
} from "lucide-react";
import { adminApi } from "../../api/AdminApi";
import { toast } from "react-toastify";

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

// Generates a backup premium gradient layout if no thumbnail exists
const getGradientForCourse = (id) => {
  const gradients = [
    "from-blue-600/90 to-cyan-500/90",
    "from-indigo-600/90 to-purple-500/90",
    "from-violet-600/90 to-pink-500/90",
    "from-emerald-600/90 to-teal-500/90",
    "from-orange-600/90 to-amber-500/90"
  ];
  const index = id ? Number(id) % gradients.length : 0;
  return gradients[index];
};

export default function AdminCourseManagement() {
  const { t } = useTranslation();
  
  // State for Course list
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Course Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "",
    isPremiumRequired: false,
    thumbnail: null
  });
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [courseActionLoading, setCourseActionLoading] = useState(false);

  // Lesson Management panel state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    orderIndex: "",
    video: null,
    thumbnail: null
  });
  const [lessonThumbnailPreview, setLessonThumbnailPreview] = useState("");
  const [videoPreviewName, setVideoPreviewName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [lessonActionLoading, setLessonActionLoading] = useState(false);

  // Comments Moderation state
  const [moderatingLesson, setModeratingLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentDeletingId, setCommentDeletingId] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải danh sách khóa học:", err);
      toast.error(t("admin.courses.errors.load_failed", { defaultValue: "Không thể tải danh sách khóa học!" }));
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId) => {
    setLessonsLoading(true);
    try {
      const data = await adminApi.getCourseDetail(courseId);
      setLessons(Array.isArray(data?.lessons) ? data.lessons : []);
    } catch (err) {
      console.error("Lỗi tải danh sách bài học:", err);
      toast.error(t("admin.courses.errors.lessons_failed", { defaultValue: "Không thể tải danh sách bài học!" }));
    } finally {
      setLessonsLoading(false);
    }
  };

  // Course handlers
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      description: "",
      price: "",
      isPremiumRequired: false,
      thumbnail: null
    });
    setThumbnailPreview("");
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || "",
      price: course.price !== null && course.price !== undefined ? course.price : "",
      isPremiumRequired: course.isPremiumRequired || false,
      thumbnail: null
    });
    setThumbnailPreview(course.thumbnailUrl ? getFullUrl(course.thumbnailUrl) : "");
    setShowCourseModal(true);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      toast.warn(t("admin.courses.warnings.title_required", { defaultValue: "Vui lòng nhập tiêu đề khóa học!" }));
      return;
    }

    setCourseActionLoading(true);
    const formData = new FormData();
    formData.append("title", courseForm.title.trim());
    formData.append("description", courseForm.description.trim());
    formData.append("price", courseForm.price === "" ? "0" : courseForm.price);
    formData.append("isPremiumRequired", courseForm.isPremiumRequired);
    if (courseForm.thumbnail) {
      formData.append("thumbnail", courseForm.thumbnail);
    }

    try {
      if (editingCourse) {
        await adminApi.updateCourse(editingCourse.courseId, formData);
        toast.success(t("admin.courses.success.update", { defaultValue: "Cập nhật khóa học thành công!" }));
      } else {
        await adminApi.createCourse(formData);
        toast.success(t("admin.courses.success.create", { defaultValue: "Tạo khóa học mới thành công!" }));
      }
      setShowCourseModal(false);
      loadCourses();
    } catch (err) {
      console.error("Lỗi lưu khóa học:", err);
      toast.error(t("admin.courses.errors.save_failed", { defaultValue: "Lỗi trong quá trình lưu khóa học!" }));
    } finally {
      setCourseActionLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm(t("admin.courses.confirm.delete_course", { defaultValue: "Bạn có chắc chắn muốn xóa khóa học này cùng toàn bộ bài học và tệp tin liên quan không?" }))) {
      return;
    }

    try {
      await adminApi.deleteCourse(courseId);
      toast.success(t("admin.courses.success.delete", { defaultValue: "Xóa khóa học thành công!" }));
      loadCourses();
      if (selectedCourse?.courseId === courseId) {
        setSelectedCourse(null);
      }
    } catch (err) {
      console.error("Lỗi xóa khóa học:", err);
      toast.error(t("admin.courses.errors.delete_failed", { defaultValue: "Không thể xóa khóa học!" }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseForm({ ...courseForm, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Lesson handlers
  const handleOpenLessons = (course) => {
    setSelectedCourse(course);
    loadLessons(course.courseId);
    setShowLessonForm(false);
    setModeratingLesson(null);
  };

  const handleOpenAddLesson = () => {
    setEditingLesson(null);
    // Suggest the next order index automatically
    const nextOrder = lessons.length > 0 
      ? Math.max(...lessons.map(l => l.orderIndex || 0)) + 1 
      : 1;
    setLessonForm({
      title: "",
      orderIndex: nextOrder.toString(),
      video: null,
      thumbnail: null
    });
    setVideoPreviewName("");
    setLessonThumbnailPreview("");
    setUploadProgress(null);
    setShowLessonForm(true);
  };

  const handleOpenEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      orderIndex: lesson.orderIndex !== undefined ? lesson.orderIndex.toString() : "1",
      video: null,
      thumbnail: null
    });
    setVideoPreviewName(lesson.videoUrl ? lesson.videoUrl.split("/").pop() : "");
    setLessonThumbnailPreview(lesson.thumbnailUrl ? getFullUrl(lesson.thumbnailUrl) : "");
    setUploadProgress(null);
    setShowLessonForm(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      toast.warn(t("admin.lessons.warnings.title_required", { defaultValue: "Vui lòng nhập tiêu đề bài học!" }));
      return;
    }

    setLessonActionLoading(true);
    const formData = new FormData();
    formData.append("title", lessonForm.title.trim());
    formData.append("orderIndex", lessonForm.orderIndex || "1");
    if (lessonForm.video) {
      formData.append("video", lessonForm.video);
    }
    if (lessonForm.thumbnail) {
      formData.append("thumbnail", lessonForm.thumbnail);
    }

    const onUploadProgress = (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      }
    };

    try {
      if (editingLesson) {
        await adminApi.updateLesson(editingLesson.lessonId, formData, onUploadProgress);
        toast.success(t("admin.lessons.success.update", { defaultValue: "Cập nhật bài học thành công!" }));
      } else {
        await adminApi.createLesson(selectedCourse.courseId, formData, onUploadProgress);
        toast.success(t("admin.lessons.success.create", { defaultValue: "Thêm bài học mới thành công!" }));
      }
      setShowLessonForm(false);
      loadLessons(selectedCourse.courseId);
      loadCourses(); // Refresh courses counts
    } catch (err) {
      console.error("Lỗi lưu bài học:", err);
      toast.error(t("admin.lessons.errors.save_failed", { defaultValue: "Lỗi trong quá trình lưu bài học!" }));
    } finally {
      setLessonActionLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm(t("admin.lessons.confirm.delete_lesson", { defaultValue: "Bạn có chắc chắn muốn xóa bài học này không?" }))) {
      return;
    }

    try {
      await adminApi.deleteLesson(lessonId);
      toast.success(t("admin.lessons.success.delete", { defaultValue: "Xóa bài học thành công!" }));
      loadLessons(selectedCourse.courseId);
      loadCourses();
    } catch (err) {
      console.error("Lỗi xóa bài học:", err);
      toast.error(t("admin.lessons.errors.delete_failed", { defaultValue: "Không thể xóa bài học!" }));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLessonForm({ ...lessonForm, video: file });
      setVideoPreviewName(file.name);
    }
  };

  // Comments handlers
  const handleOpenComments = async (lesson) => {
    setModeratingLesson(lesson);
    setCommentsLoading(true);
    try {
      const data = await adminApi.getLessonComments(lesson.lessonId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
      toast.error(t("admin.comments.errors.load_failed", { defaultValue: "Không thể tải danh sách bình luận!" }));
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentDeletingId(commentId);
    try {
      await adminApi.deleteComment(commentId);
      toast.success(t("admin.comments.success.delete", { defaultValue: "Đã xóa bình luận thành công!" }));
      // Remove comment from state with animated transition
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      console.error("Lỗi xóa bình luận:", err);
      toast.error(t("admin.comments.errors.delete_failed", { defaultValue: "Không thể xóa bình luận!" }));
    } finally {
      setCommentDeletingId(null);
    }
  };

  // Filtering courses based on search
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalCourses = courses.length;
  const premiumCoursesCount = courses.filter((c) => c.isPremiumRequired).length;
  const totalLessonsCount = courses.reduce((sum, c) => sum + (c.lessonsCount || 0), 0);
  const freeCoursesCount = totalCourses - premiumCoursesCount;

  return (
    <div className="space-y-8">
      {/* Dynamic Glassmorphic Stats Section */}
      {!selectedCourse && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {t("admin.courses.stats.total_courses", { defaultValue: "Tổng khóa học" })}
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-gray-900">{totalCourses}</span>
              <span className="rounded-2xl bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                +100% Active
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {t("admin.courses.stats.premium_courses", { defaultValue: "Premium khóa học" })}
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-purple-600">{premiumCoursesCount}</span>
              <span className="rounded-2xl bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-600">
                Paywalled
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {t("admin.courses.stats.total_lessons", { defaultValue: "Tổng số bài học" })}
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-cyan-600">{totalLessonsCount}</span>
              <span className="rounded-2xl bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-600 flex items-center gap-1">
                <Video className="h-3 w-3" /> Videos
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {t("admin.courses.stats.free_courses", { defaultValue: "Khóa học miễn phí" })}
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-600">{freeCoursesCount}</span>
              <span className="rounded-2xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                Public Access
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          // --- COURSE MANAGEMENT VIEW ---
          <motion.div
            key="course-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute top-3.5 left-4 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("admin.courses.search_placeholder", { defaultValue: "Tìm kiếm khóa học..." })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-gray-100 bg-white/80 py-3 pr-4 pl-11 text-sm outline-none transition focus:border-blue-500/50 focus:bg-white shadow-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenAddCourse}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-700/10 transition hover:shadow-lg hover:shadow-blue-700/20 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>{t("admin.courses.add_button", { defaultValue: "Tạo khóa học" })}</span>
              </button>
            </div>

            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-500 font-medium">{t("admin.courses.loading", { defaultValue: "Đang tải dữ liệu khóa học..." })}</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white/50 p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {t("admin.courses.no_courses_title", { defaultValue: "Chưa có khóa học nào" })}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t("admin.courses.no_courses_desc", { defaultValue: "Bắt đầu bằng cách thêm khóa học đầu tiên của bạn!" })}
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddCourse}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("admin.courses.create_first", { defaultValue: "Tạo ngay" })}</span>
                </button>
              </div>
            ) : (
              // Glassmorphic Bento Grid
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-md hover:border-gray-200/80"
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                      {course.thumbnailUrl ? (
                        <img
                          src={getFullUrl(course.thumbnailUrl)}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${getGradientForCourse(
                          course.courseId
                        )} text-white p-4 text-center ${course.thumbnailUrl ? "hidden" : "flex"}`}
                      >
                        <BookOpen className="h-10 w-10 opacity-70 mb-2" />
                        <span className="font-bold text-sm line-clamp-2">{course.title}</span>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {course.isPremiumRequired && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5 fill-white/20" />
                            Premium
                          </span>
                        )}
                        {course.price > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
                            Paid
                          </span>
                        ) : (!course.isPremiumRequired && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
                            Free
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex-1 space-y-2">
                        <h3 className="line-clamp-2 text-base font-bold text-gray-900 group-hover:text-blue-700 transition">
                          {course.title}
                        </h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {course.description || t("admin.courses.no_description", { defaultValue: "Chưa có mô tả chi tiết." })}
                        </p>
                      </div>

                      {/* Details row */}
                      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-semibold text-gray-500">
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4 text-gray-400" />
                          <span>{course.lessonsCount || 0} bài học</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-gray-900 font-bold">
                          {course.price > 0 ? (
                            <>
                              <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                              <span>{course.price ? course.price.toLocaleString("vi-VN") : "0"} VNĐ</span>
                            </>
                          ) : (
                            <span className="text-emerald-600 uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Miễn phí</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenLessons(course)}
                          className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition active:scale-95"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Chi tiết bài học</span>
                        </button>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourse(course)}
                            className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-100 bg-white p-2.5 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 transition active:scale-95"
                            title={t("admin.courses.actions.edit", { defaultValue: "Sửa" })}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(course.courseId)}
                            className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-100 bg-white p-2.5 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition active:scale-95"
                            title={t("admin.courses.actions.delete", { defaultValue: "Xóa" })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // --- LESSONS MANAGEMENT VIEW ---
          <motion.div
            key="lesson-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header with back navigation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm transition hover:border-blue-200 hover:text-blue-700 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    {selectedCourse.isPremiumRequired ? "Premium Course" : "Free Course"}
                  </p>
                  <h2 className="text-xl font-extrabold text-gray-900">{selectedCourse.title}</h2>
                </div>
              </div>

              {!showLessonForm && (
                <button
                  type="button"
                  onClick={handleOpenAddLesson}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-700/10 transition hover:shadow-lg hover:shadow-blue-700/20 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("admin.lessons.add_button", { defaultValue: "Thêm bài học" })}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left / Main panel: Lesson List */}
              <div className={`space-y-4 lg:col-span-8 ${showLessonForm ? "lg:col-span-7" : "lg:col-span-12"}`}>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                  <span>Danh sách bài học ({lessons.length})</span>
                </h3>

                {lessonsLoading ? (
                  <div className="flex h-48 flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <p className="text-xs text-gray-500">{t("admin.lessons.loading", { defaultValue: "Đang tải bài học..." })}</p>
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-gray-200 bg-white/50 p-10 text-center">
                    <Video className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500 font-medium">Khóa học này chưa có bài học nào.</p>
                    <button
                      type="button"
                      onClick={handleOpenAddLesson}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Thêm bài học đầu tiên</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons
                      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                      .map((lesson) => (
                        <div
                          key={lesson.lessonId}
                          className={`flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border bg-white p-4 transition-all duration-200 ${
                            editingLesson?.lessonId === lesson.lessonId
                              ? "border-blue-500 shadow-sm shadow-blue-500/5"
                              : "border-gray-100 hover:border-gray-200 shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-slate-100 flex items-center justify-center">
                              {lesson.thumbnailUrl ? (
                                <img
                                  src={getFullUrl(lesson.thumbnailUrl)}
                                  alt={lesson.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className={`h-full w-full bg-gradient-to-br ${getGradientForCourse(lesson.lessonId)} flex items-center justify-center text-white`}>
                                  <Video className="h-4 w-4 opacity-70" />
                                </div>
                              )}
                              <div className="absolute bottom-0.5 right-0.5 bg-slate-950/70 px-1 py-0.5 rounded text-[8px] font-black text-white backdrop-blur-sm">
                                #{lesson.orderIndex}
                              </div>
                            </div>
                            <div className="space-y-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{lesson.title}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                {lesson.videoUrl ? (
                                  <a
                                    href={getFullUrl(lesson.videoUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                                  >
                                    <PlayCircle className="h-3.5 w-3.5" />
                                    <span>Xem video bài giảng</span>
                                  </a>
                                ) : (
                                  <span className="flex items-center gap-1 text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                                    <AlertCircle className="h-3 w-3" />
                                    Chưa upload video
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleOpenComments(lesson)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 transition active:scale-95"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Bình luận</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditLesson(lesson)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 transition active:scale-95"
                              title="Sửa bài học"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(lesson.lessonId)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition active:scale-95"
                              title="Xóa bài học"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Right panel: Inline Lesson Form Drawer */}
              {showLessonForm && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                    <h3 className="font-extrabold text-sm text-gray-900">
                      {editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowLessonForm(false)}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleLessonSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề bài học *</label>
                      <input
                        type="text"
                        required
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        placeholder="Nhập tiêu đề bài học..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số thứ tự (Order Index)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={lessonForm.orderIndex}
                        onChange={(e) => setLessonForm({ ...lessonForm, orderIndex: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Premium Video Dropzone with Framer Motion Progress */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Video bài giảng</span>
                        {editingLesson && (
                          <span className="text-[10px] text-gray-400 normal-case font-normal">(Bỏ qua nếu giữ nguyên video cũ)</span>
                        )}
                      </label>
                      
                      <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="absolute inset-0 z-10 cursor-pointer opacity-0"
                        />
                        <Video className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs font-bold text-gray-700">Kéo thả hoặc Click để chọn Video</span>
                        <span className="text-[10px] text-gray-400 mt-1">Hỗ trợ các định dạng video MP4, MOV, WebM</span>
                      </div>

                      {videoPreviewName && (
                        <div className="flex items-center justify-between rounded-xl bg-blue-50/50 px-3.5 py-2 text-xs font-semibold text-blue-700">
                          <span className="truncate max-w-[200px]">{videoPreviewName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setLessonForm({ ...lessonForm, video: null });
                              setVideoPreviewName("");
                            }}
                            className="rounded-full p-0.5 hover:bg-blue-100 text-blue-500 hover:text-blue-800 transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Framer Motion Upload Progress Bar */}
                      {uploadProgress !== null && (
                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-[10px] font-bold text-blue-600">
                            <span>Đang upload video...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-700 to-cyan-500"
                              initial={{ width: "0%" }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Lesson Thumbnail Dropzone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Ảnh đại diện video (Thumbnail)</span>
                        {editingLesson && (
                          <span className="text-[10px] text-gray-400 normal-case font-normal">(Bỏ qua nếu giữ nguyên)</span>
                        )}
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="sm:col-span-2 relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/50 p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setLessonForm({ ...lessonForm, thumbnail: file });
                                setLessonThumbnailPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="absolute inset-0 z-10 cursor-pointer opacity-0"
                          />
                          <Upload className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                          <span className="text-xs font-bold text-gray-700">Chọn ảnh</span>
                          <span className="text-[9px] text-gray-400 mt-0.5">JPG, PNG, WebP</span>
                        </div>

                        <div className="relative aspect-[16/9] w-full rounded-xl border border-gray-100 bg-slate-100 overflow-hidden flex items-center justify-center">
                          {lessonThumbnailPreview ? (
                            <>
                              <img src={lessonThumbnailPreview} alt="Preview" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setLessonForm({ ...lessonForm, thumbnail: null });
                                  setLessonThumbnailPreview("");
                                }}
                                className="absolute top-1 right-1 rounded-full bg-slate-900/60 p-1 text-white backdrop-blur hover:bg-slate-900 transition"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center text-[10px] text-gray-400 font-semibold p-2">
                              <ImageIcon className="h-5 w-5 text-gray-300 mx-auto mb-1" />
                              Chưa có ảnh
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        disabled={lessonActionLoading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/10 hover:shadow-lg transition disabled:opacity-50"
                      >
                        {lessonActionLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <span>Lưu bài học</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLessonForm(false)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- COURSE MODAL (CREATE / EDIT) --- */}
      <AnimatePresence>
        {showCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCourseModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-base font-extrabold text-gray-900">
                  {editingCourse ? "Chỉnh sửa thông tin khóa học" : "Tạo khóa học mới"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="rounded-full border border-gray-100 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleCourseSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề khóa học *</label>
                    <input
                      type="text"
                      required
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      placeholder="Nhập tên khóa học..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mô tả khóa học</label>
                    <textarea
                      rows="3"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      placeholder="Nhập mô tả tóm tắt khóa học..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mức giá (VNĐ)</label>
                    <input
                      type="number"
                      min="0"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      placeholder="Nhập giá tiền, e.g., 299000"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isPremiumRequired"
                      checked={courseForm.isPremiumRequired}
                      onChange={(e) => setCourseForm({ ...courseForm, isPremiumRequired: e.target.checked })}
                      className="h-4.5 w-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <label htmlFor="isPremiumRequired" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Yêu cầu tài khoản Premium
                    </label>
                  </div>
                </div>

                {/* Thumbnail Dropzone with Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ảnh đại diện (Thumbnail)</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2 relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/50 p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="absolute inset-0 z-10 cursor-pointer opacity-0"
                      />
                      <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-gray-700">Chọn ảnh</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">JPG, PNG, WebP</span>
                    </div>

                    <div className="relative aspect-[16/9] w-full rounded-xl border border-gray-100 bg-slate-100 overflow-hidden flex items-center justify-center">
                      {thumbnailPreview ? (
                        <>
                          <img src={thumbnailPreview} alt="Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setCourseForm({ ...courseForm, thumbnail: null });
                              setThumbnailPreview("");
                            }}
                            className="absolute top-1 right-1 rounded-full bg-slate-900/60 p-1 text-white backdrop-blur hover:bg-slate-900 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-[10px] text-gray-400 font-semibold p-2">
                          <ImageIcon className="h-5 w-5 text-gray-300 mx-auto mb-1" />
                          Chưa có ảnh
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={courseActionLoading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/10 hover:shadow-lg transition disabled:opacity-50"
                  >
                    {courseActionLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <span>Lưu thông tin</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMMENTS MODERATION MODAL (HEIGHT-CLOSING DELETION) --- */}
      <AnimatePresence>
        {moderatingLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModeratingLesson(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Moderation Hub</span>
                  <h3 className="text-base font-extrabold text-gray-900 mt-1 line-clamp-1">
                    Bình luận: {moderatingLesson.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModeratingLesson(null)}
                  className="rounded-full border border-gray-100 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Comments List Area */}
              <div className="mt-4 max-h-[350px] overflow-y-auto pr-1 space-y-3">
                {commentsLoading ? (
                  <div className="flex h-40 flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <p className="text-xs text-gray-500 font-medium">Đang tải danh sách bình luận...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center text-center text-gray-400">
                    <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-xs font-semibold">Chưa có bình luận nào cho bài học này.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {comments.map((comment) => (
                        <motion.div
                          key={comment.commentId}
                          initial={{ opacity: 1, height: "auto" }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            marginBottom: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            borderWidth: 0,
                            overflow: "hidden"
                          }}
                          transition={{ duration: 0.3 }}
                          className="group relative flex items-start justify-between rounded-2xl border border-gray-50 bg-slate-50/50 p-4 transition hover:border-red-100 hover:bg-red-50/10"
                        >
                          <div className="space-y-1 min-w-0 pr-8">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900">
                                {comment.userFullName || comment.username || "Học viên"}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleString("vi-VN") : ""}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed break-words">{comment.content}</p>
                          </div>

                          <button
                            type="button"
                            disabled={commentDeletingId === comment.commentId}
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="absolute top-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                            title="Xóa bình luận"
                          >
                            {commentDeletingId === comment.commentId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModeratingLesson(null)}
                  className="rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
