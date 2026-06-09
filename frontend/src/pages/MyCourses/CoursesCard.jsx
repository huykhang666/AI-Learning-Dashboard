import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./MyCourses.module.css";

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

export default function CourseCard({ course }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewDetails = () => {

    navigate(`/app/courses/${course.courseId}`);
  };

  const progress = course.progress || 0;
  const isCompleted = progress === 100;
  const progressColor = isCompleted ? "#22c55e" : (course.color || "#4f6ef7");

  const displayPrice = course.price > 0
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)
    : "FREE";
  const handleLatestLesson = () => {
    console.log("course data:", JSON.stringify(course));
    const latestLessonId = course.latestLessonId || course.lessons?.[0]?.lessonId;
    if (latestLessonId) {
      navigate(`/app/lessons/${latestLessonId}`);
    } else {
      // Không có lesson thì vào trang khóa học
      navigate(`/app/courses/${course.courseId}`);
    }
  };
  return (
    <div className={styles.card}> 
      {(isCompleted || course.badge) && (
        <span className={styles.cardBadge}>
          ✓ {t("my_courses.badge.done")}
        </span>
      )}

      <div className={styles.cardTop}>
        {course.thumbnailUrl ? (
          <img
            src={getFullUrl(course.thumbnailUrl)}
            alt={course.title}
            className={styles.thumbnail}
          />
        ) : (
          <div className={styles.emptyThumbnail} />
        )}
      </div>

      <h3 className={styles.cardTitle}>{course.title}</h3>

      <div className={styles.infoSection}>
        {course.unlocked && progress > 0 ? (
          <>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%`, background: progressColor }}
              />
            </div>
            <p className={styles.progressLabel} style={{ color: progressColor }}>
              {t("my_courses.progress_complete", { percent: progress })}
            </p>
          </>
        ) : (
          <p style={{
            fontSize: '16px',
            fontWeight: '800',
            color: course.price > 0 ? '#4f6ef7' : '#22c55e', 
            margin: '10px 0'
          }}>
            {displayPrice}
          </p>
        )}
      </div>

      <p className={styles.cardLessons}>
        {t("my_courses.lessons", { count: course.lessonsCount ?? course.lessons_count ?? 0 })}
      </p>

      <div className={styles.cardActions}>
        <button className={styles.btnView} onClick={handleViewDetails}>
          {course.unlocked
            ? t("my_courses.button.go_study")   
            : t("my_courses.button.view_course") 
          }
        </button>

        {course.unlocked && (
          <button
            className={styles.btnLatest}
            style={{ background: progressColor }}
            onClick={handleLatestLesson}
          >
            {t("my_courses.button.latest_lesson")}
          </button>
        )}
      </div>
    </div>
  );
}