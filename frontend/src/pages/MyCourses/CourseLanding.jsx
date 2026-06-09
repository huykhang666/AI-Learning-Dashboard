    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { toast } from 'react-toastify';
    import {
        PlayCircle,
        Lock,
        BookOpen,
        Clock,
        Users,
        Star,
        CheckCircle,
        Award,
        ShoppingCart,
        ArrowRight,
        Unlock,
        ShieldCheck
    } from 'lucide-react';
    import { courseApi } from '../../api/CourseApi';
    import { paymentApi } from '../../api/PaymentApi';
    import styles from './CourseLanding.module.css';

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

const formatDuration = (seconds) => {
  if (!seconds) return "10:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function CourseLanding() {
        const { courseId } = useParams();
        const navigate = useNavigate();
        const { t } = useTranslation();
        const [course, setCourse] = useState(null);
        const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
        const [selectedGateway, setSelectedGateway] = useState("VNPAY");
        const [isProcessingPayment, setIsProcessingPayment] = useState(false);

        const handleConfirmCoursePayment = async () => {
            try {
                setIsProcessingPayment(true);
                const userStr = localStorage.getItem("user");
                if (!userStr) {
                    toast.error(t("pricing.alerts.login_required", { defaultValue: "Vui lòng đăng nhập để mua khóa học!" }));
                    return;
                }
                const userObj = JSON.parse(userStr);
                const userId = userObj.id || userObj.userId;
                
                const paymentRequest = {
                    userId: Number(userId),
                    amount: course.price,
                    planType: "COURSE",
                    gateway: selectedGateway,
                    courseId: Number(courseId)
                };

                const response = await paymentApi.createPaymentUrl(paymentRequest);
                const resData = response?.data || response;
                if (resData?.paymentUrl) {
                    window.location.href = resData.paymentUrl;
                } else {
                    toast.error(t("pricing.alerts.service_busy", { defaultValue: "Cổng thanh toán bận, thử lại sau!" }));
                }
            } catch (error) {
                console.error("Lỗi tạo link thanh toán:", error);
                toast.error(t("pricing.alerts.service_busy", { defaultValue: "Lỗi kết nối đến cổng thanh toán!" }));
            } finally {
                setIsProcessingPayment(false);
            }
        };

        useEffect(() => {
            const fetchLandingData = async () => {
                try {
                    const userStr = localStorage.getItem("user");
                    const userId = userStr ? JSON.parse(userStr).userId : 0;
                    
                    const response = await courseApi.getCourseDetail(courseId, userId);
                    const courseData = response.data;
                    if (courseData && Array.isArray(courseData.lessons)) {
                        courseData.lessons.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
                    }
                    setCourse(courseData);
                } catch (err) {
                    console.error("Lỗi gọi API đổ dữ liệu:", err);
                }
            };
            fetchLandingData();
        }, [courseId]);

        if (!course) return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingSpinner}></div>
                <p>{t("course_landing.loading")}</p>
            </div>
        );

        const isLessonAccessible = (index) => {
            const priceValue = Number(course.price || 0);
            if (priceValue === 0 || course.unlocked) return true;
            return index < 2;
        };

        const handleEnroll = async () => {
            console.log("Đã bấm nút Đăng ký!");
            try {
                const userStr = localStorage.getItem("user");
                const userId = userStr ? JSON.parse(userStr).userId : 0;
                
                // Gọi API đăng ký
                await courseApi.enroll(courseId, userId); 
                
                toast.success(t("course_landing.enroll_success", { defaultValue: "Đăng ký thành công!" }));
                setCourse(prev => ({ ...prev, unlocked: true }));
                
                setTimeout(() => {
                    navigate("/app/courses", { 
                        state: { enrolledCourseId: Number(courseId) } 
                    });
                }, 1500);                
            } catch (error) {
                console.error("Lỗi đăng ký:", error);
                toast.error(t("course_landing.enroll_fail", { defaultValue: "Đăng ký thất bại, thử lại nhé!" }));
            }
        };

        const handleGoStudy = () => {
            const firstLessonId = course.lessons?.[0]?.lessonId;
            if (firstLessonId) {
                navigate(`/app/lessons/${firstLessonId}`);
            } else {
                toast.warn(t("course_landing.no_lessons_toast", { defaultValue: "Khóa học chưa có bài học nào!" }));
            }
        };
        
        const objectives = t("course_landing.objectives_items", { returnObjects: true }) || [];

        return (
            <div className={styles.landingPage}>
                {/* 1. HERO SECTION: Hiển thị banner thông tin tổng quan */}
                <section className={styles.heroSection}>
                    <div className={styles.heroGradient} />
                    <div className={styles.heroContainer}>
                        <div className={styles.heroBadge}>
                            <Award size={14} />
                            <span>{t("course_landing.recommended")}</span>
                        </div>
                        <h1 className={styles.heroTitle}>{course.title}</h1>
                        <p className={styles.heroSub}>{course.description}</p>

                        <div className={styles.heroMeta}>
                            <div className={styles.metaItem}>
                                <Star size={15} className={styles.metaIconStar} fill="#f4c01e" color="#f4c01e" />
                                <span>4.8 (1,240 {t("course_landing.reviews", { defaultValue: "đánh giá" })})</span>
                            </div>
                            <div className={styles.metaDivider} />
                            <div className={styles.metaItem}>
                                <Users size={15} />
                                <span>{course.student_count || '1,500'} {t("course_landing.students")}</span>
                            </div>
                            <div className={styles.metaDivider} />
                            <div className={styles.metaItem}>
                                <BookOpen size={15} />
                                <span>{course.lessons?.length || 0} {t("course_landing.lessons")}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={styles.mainContent}>
                    {/* 2. CỘT TRÁI: Nội dung chi tiết các bài học */}
                    <div className={styles.leftCol}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>{t("course_landing.objectives")}</h2>
                            <div className={styles.learnGrid}>
                                {Array.isArray(objectives) && objectives.map((item, i) => (
                                    <div key={i} className={styles.learnItem}>
                                        <CheckCircle size={16} className={styles.checkIcon} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>{t("course_landing.lesson_list")}</h2>
                                <span className={styles.lessonCount}>{course.lessons?.length || 0} {t("course_landing.lessons")}</span>
                            </div>

                            <div className={styles.lessonList}>
                                {course.lessons?.map((lesson, index) => {
                                    const canWatch = isLessonAccessible(index);
                                    return (
                                        <div
                                            key={lesson.lessonId}
                                            className={`${styles.lessonRow} ${canWatch ? styles.lessonUnlocked : styles.lessonLocked}`}
                                            onClick={() => canWatch ? navigate(`/app/lessons/${lesson.lessonId}`) : alert(t("course_landing.locked_alert"))}
                                        >
                                            <div className={styles.lessonLeft}>
                                                <div className={styles.lessonIndex}>{String(index + 1).padStart(2, '0')}</div>
                                                <div className={styles.lessonInfo}>
                                                    <span className={styles.lessonTitle}>{lesson.title}</span>
                                                    <div className={styles.lessonMeta}>
                                                        {/* Badge học thử cho khóa tính tiền */}
                                                        {!course.unlocked && course.price > 0 && index < 2 && (
                                                            <span className={styles.previewBadge}>{t("course_landing.preview_badge")}</span>
                                                        )}
                                                         <span className={styles.lessonDuration}>
                                                             <Clock size={11} /> {formatDuration(lesson.duration)}
                                                         </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.lessonRight}>
                                                {canWatch
                                                    ? <PlayCircle size={18} className={styles.iconPlay} />
                                                    : <Lock size={16} className={styles.iconLock} />
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 3. CỘT PHẢI (SIDEBAR): Giá và Nút hành động */}
                    <div className={styles.sidebarCol}>
                        <div className={styles.stickyCard}>
                            <div className={styles.previewWrapper}>
                                {course.thumbnailUrl ? (
                                    <img
                                        src={getFullUrl(course.thumbnailUrl)}
                                        alt={course.title}
                                        className={styles.previewImg}
                                        /* Thêm cái này để YouTube cho phép hiển thị ảnh trên localhost */
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x225?text=Link+Anh+Loi";
                                        }}
                                    />
                                ) : (
                                    <div className={styles.emptyThumbnail} style={{ height: '225px', background: '#eee' }} />
                                )}

                                <div className={styles.previewOverlay}>
                                    <div className={styles.playBtn}>
                                        <PlayCircle size={30} className={styles.centerPlayIcon} />
                                    </div>
                                    <span>{t("course_landing.view_intro")}</span>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.priceRow}>
                                    <span className={styles.priceTag}>
                                        {Number(course.price) > 0
                                            ? `${Number(course.price).toLocaleString('vi-VN')}đ`
                                            : t("sidebar.badges.free")}
                                    </span>
                                    {course.price > 0 && (
                                        <span className={styles.priceOriginal}>
                                            {Number(course.price * 1.2).toLocaleString('vi-VN')}đ
                                        </span>
                                    )}
                                </div>

                                {/* Nút bấm thay đổi theo trạng thái FREE hoặc CÓ PHÍ */}
                                {(() => {
                                    const isFree = Number(course.price) === 0;
                                    const isUnlocked = course.unlocked;
                                    
                                    if (isFree || isUnlocked) {
                                        return (
                                            <button
                                                type="button"
                                                className={`${styles.btnAction} ${styles.btnStudy}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleGoStudy();
                                                }}
                                            >
                                                {t("course_landing.owned")}
                                            </button>
                                        );
                                    } else {
                                        return (
                                            <button
                                                type="button"
                                                className={`${styles.btnAction} ${styles.btnBuy}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const userStr = localStorage.getItem("user");
                                                    if (!userStr) {
                                                        toast.error(t("pricing.alerts.login_required", { defaultValue: "Vui lòng đăng nhập!" }));
                                                        return;
                                                    }
                                                    setIsCheckoutModalOpen(true);
                                                }}
                                            >
                                                {t("course_landing.pay_now")}
                                            </button>
                                        );
                                    }
                                })()}

                                <div className={styles.guaranteeBox}>
                                    <ShieldCheck size={14} />
                                    <span>{t("course_landing.guarantee")}</span>
                                </div>

                                <div className={styles.sidebarFeatures}>
                                    <p className={styles.featuresTitle}>{t("course_landing.includes")}</p>
                                    <div className={styles.featureItem}>
                                        <Clock size={15} />
                                        <span>{t("course_landing.anytime")}</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <Award size={15} />
                                        <span>{t("course_landing.cert")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isCheckoutModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300"
                            onClick={() => setIsCheckoutModalOpen(false)}
                        />
                        
                        {/* Modal content */}
                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-2xl w-full max-w-md relative z-10 p-6 transform transition-all duration-300 animate-in fade-in zoom-in-95">
                            <h3 className="text-lg font-black text-slate-900 mb-2">Thanh toán khóa học</h3>
                            <p className="text-sm text-slate-500 mb-4">Bạn đang thực hiện mua khóa học: <strong>{course.title}</strong></p>
                            
                            <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-bold">Giá tiền:</span>
                                <span className="text-lg font-extrabold text-blue-600">
                                    {Number(course.price).toLocaleString('vi-VN')} đ
                                </span>
                            </div>

                            <div className="mb-6">
                                <label className="block text-slate-450 text-[10px] font-extrabold mb-3 uppercase tracking-widest">
                                    Chọn cổng thanh toán
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedGateway("VNPAY")}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                            selectedGateway === "VNPAY"
                                                ? "border-blue-600 bg-blue-50/20 text-blue-600 font-bold"
                                                : "border-slate-200 hover:border-slate-300 text-slate-650"
                                        }`}
                                    >
                                        <span className="text-sm font-bold">VNPAY</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedGateway("MOMO")}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                            selectedGateway === "MOMO"
                                                ? "border-pink-600 bg-pink-50/20 text-pink-600 font-bold"
                                                : "border-slate-200 hover:border-slate-300 text-slate-650"
                                        }`}
                                    >
                                        <span className="text-sm font-bold">MoMo</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCheckoutModalOpen(false)}
                                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-black transition-all active:scale-95"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    disabled={isProcessingPayment}
                                    onClick={handleConfirmCoursePayment}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isProcessingPayment ? "Đang kết nối..." : "Thanh toán"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }