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
        ShieldCheck,
        X,
    } from 'lucide-react';
    import { courseApi } from '../../api/CourseApi';
    import { paymentApi } from '../../api/PaymentApi';
    import momoLogo from '../../img/MoMo.png';
    import vnpayLogo from '../../img/VNPay.png';
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
        const [showPaymentModal, setShowPaymentModal] = useState(false);
        const [selectedGateway, setSelectedGateway] = useState('VNPAY');
        const [isProcessing, setIsProcessing] = useState(false);

        const gatewayOptions = [
            {
                id: 'VNPAY',
                name: 'VNPay',
                description: t('pricing.gateways.vnpay.description', { defaultValue: 'Thẻ ATM, Visa, QR Code' }),
                logo: vnpayLogo,
            },
            {
                id: 'MOMO',
                name: 'MoMo',
                description: t('pricing.gateways.momo.description', { defaultValue: 'Ví MoMo, liên kết ngân hàng' }),
                logo: momoLogo,
            },
        ];

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

        const handleOpenPayment = () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error(t('pricing.alerts.login_required', { defaultValue: 'Vui lòng đăng nhập để thanh toán!' }));
                return;
            }
            setSelectedGateway('VNPAY');
            setShowPaymentModal(true);
        };

        const handleConfirmPayment = async () => {
            try {
                setIsProcessing(true);

                const token = localStorage.getItem('accessToken');
                if (!token) {
                    toast.error(t('pricing.alerts.login_required', { defaultValue: 'Vui lòng đăng nhập để thanh toán!' }));
                    return;
                }

                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    toast.error(t('pricing.alerts.user_not_found', { defaultValue: 'Không tìm thấy thông tin người dùng!' }));
                    return;
                }

                const userObj = JSON.parse(userStr);
                const userId = userObj.userId || userObj.id;
                if (!userId) {
                    toast.error(t('pricing.alerts.user_not_found', { defaultValue: 'Không tìm thấy thông tin người dùng!' }));
                    return;
                }

                const paymentRequest = {
                    userId: Number(userId),
                    amount: Math.round(Number(course.price)),
                    planType: 'COURSE',
                    gateway: selectedGateway,
                    courseId: Number(courseId),
                };

                const response = await paymentApi.createPaymentUrl(paymentRequest);
                const resData = response?.data || response;
                const payUrl = resData?.paymentUrl || resData?.payUrl;

                if (payUrl && (resData?.code === '00' || resData?.resultCode === 0)) {
                    window.location.href = payUrl;
                    return;
                }

                toast.error(t('pricing.alerts.service_busy', { defaultValue: 'Cổng thanh toán đang bận, thử lại sau!' }));
            } catch (error) {
                console.error('Lỗi thanh toán khóa học:', error);
                toast.error(t('pricing.alerts.service_busy', { defaultValue: 'Cổng thanh toán đang bận, thử lại sau!' }));
            } finally {
                setIsProcessing(false);
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
                                                    handleOpenPayment();
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
                {showPaymentModal && (
                    <div className={styles.paymentOverlay} onClick={() => !isProcessing && setShowPaymentModal(false)}>
                        <div className={styles.paymentModal} onClick={(e) => e.stopPropagation()}>
                            {isProcessing && (
                                <div className={styles.paymentProcessing}>
                                    <div className={styles.loadingSpinner} />
                                    <p>{t('pricing.modal.connecting_gateway', { defaultValue: 'Đang kết nối cổng thanh toán...' })}</p>
                                </div>
                            )}

                            <div className={styles.paymentModalHeader}>
                                <h3 className={styles.paymentModalTitle}>
                                    {t('course_landing.pay_now', { defaultValue: 'Thanh toán ngay' })}
                                </h3>
                                <button
                                    type="button"
                                    className={styles.paymentModalClose}
                                    onClick={() => !isProcessing && setShowPaymentModal(false)}
                                    disabled={isProcessing}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className={styles.paymentModalBody}>
                                <div className={styles.paymentSummary}>
                                    <div>
                                        <p className={styles.paymentSummaryLabel}>
                                            {t('pricing.modal.selected_plan', { defaultValue: 'Khóa học' })}
                                        </p>
                                        <p className={styles.paymentSummaryName}>{course.title}</p>
                                    </div>
                                    <p className={styles.paymentSummaryPrice}>
                                        {Number(course.price).toLocaleString('vi-VN')}đ
                                    </p>
                                </div>

                                <div className={styles.paymentGatewayList}>
                                    {gatewayOptions.map((gw) => {
                                        const active = selectedGateway === gw.id;
                                        return (
                                            <button
                                                key={gw.id}
                                                type="button"
                                                className={`${styles.paymentGatewayBtn} ${active ? styles.paymentGatewayBtnActive : ''}`}
                                                onClick={() => !isProcessing && setSelectedGateway(gw.id)}
                                                disabled={isProcessing}
                                            >
                                                <div className={styles.paymentGatewayLogo}>
                                                    <img src={gw.logo} alt={gw.name} />
                                                </div>
                                                <div className={styles.paymentGatewayInfo}>
                                                    <p className={styles.paymentGatewayName}>{gw.name}</p>
                                                    <p className={styles.paymentGatewayDesc}>{gw.description}</p>
                                                </div>
                                                <div className={`${styles.paymentRadio} ${active ? styles.paymentRadioActive : ''}`}>
                                                    {active && <div className={styles.paymentRadioDot} />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    className={styles.paymentConfirmBtn}
                                    onClick={handleConfirmPayment}
                                    disabled={isProcessing}
                                >
                                    {t('pricing.modal.confirm_pay', { defaultValue: 'Xác nhận thanh toán' })}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }