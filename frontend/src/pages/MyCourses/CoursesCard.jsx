import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./MyCourses.module.css"; 

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
            src={course.thumbnailUrl}
            alt={course.title}
            className={styles.thumbnail}
          />
        ) : (
          <div className={styles.emptyThumbnail} />
        )}
      </div>

      <h3 className={styles.cardTitle}>{course.title}</h3>

      {course.unlocked ? (
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
          fontSize: '14px',
          fontWeight: '700',
          color: course.price > 0 ? '#4f6ef7' : '#22c55e',
          margin: '4px 0'
        }}>
          {displayPrice}
        </p>
      )}

      <p className={styles.cardLessons}>
        {t("my_courses.lessons", { count: course.lessons || 0 })}
      </p>

      <div className={styles.cardActions}>
        <button className={styles.btnView} onClick={handleViewDetails}>
          {t("my_courses.button.view_course")}
        </button>
        
        {course.unlocked && (
          <button
            className={styles.btnLatest}
            style={{ background: progressColor }}
          >
            {t("my_courses.button.latest_lesson")}
          </button>
        )}
      </div>
    </div>
  );
}