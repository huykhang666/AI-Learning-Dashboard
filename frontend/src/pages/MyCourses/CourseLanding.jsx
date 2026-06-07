import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import styles from './CourseLanding.module.css';

export default function CourseLanding() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                // Lấy userId từ máy, nếu không có mặc định là 0 để tránh lỗi 500
                const userId = localStorage.getItem("userId") || 0;
                const response = await courseApi.getCourseDetail(courseId, userId);
                setCourse(response.data);
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
                                        onClick={() => canWatch ? navigate(`/app/history/${lesson.lessonId}`) : alert(t("course_landing.locked_alert"))}
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
                                                        <Clock size={11} /> 10:00
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
                        {course.thumbnailUrl ? (
                            <img
                                src={course.thumbnailUrl}
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
                            <PlayCircle size={45} className={styles.centerPlayIcon} />
                            <span>{t("course_landing.view_intro")}</span>
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
                            <button
                                className={`${styles.btnAction} ${(Number(course.price) === 0 || course.unlocked) ? styles.btnStudy : styles.btnBuy}`}
                                onClick={() =>
                                    (Number(course.price) === 0 || course.unlocked)
                                        ? navigate(`/app/history/${course.lessons[0]?.lessonId}`)
                                        : alert(t("course_landing.locked_alert"))
                                }
                            >
                                {(Number(course.price) === 0 || course.unlocked) ? t("course_landing.study_now") : t("course_landing.enroll_now")}
                            </button>

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
        </div>
    );
}