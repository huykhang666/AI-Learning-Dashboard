import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Mycourses.module.css";

export default function CourseCard({ course }) {
  const { t } = useTranslation();
  const isCompleted = course.progress === 100;
  const progressColor = isCompleted ? "#22c55e" : course.color;

  return (
    <div className={styles.card}>
      {course.badge && (
        <span className={styles.cardBadge}>
          ✓ {t(`my_courses.badge.${course.badge}`)}
        </span>
      )}

      <div className={styles.cardTop} style={{ background: course.bg }}>
        <div className={styles.cardIcon}>
          <span>{course.icon}</span>
        </div>
      </div>

      <h3 className={styles.cardTitle}>{course.title}</h3>
      <p className={styles.cardLessons}>
        {t("my_courses.lessons", { count: course.lessons })}
      </p>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${course.progress}%`, background: progressColor }}
        />
      </div>
      <p className={styles.progressLabel} style={{ color: progressColor }}>
        {t("my_courses.progress_complete", { percent: course.progress })}
      </p>

      <div className={styles.cardActions}>
        <button className={styles.btnView}>
          {t("my_courses.button.view_course")}
        </button>
        <button
          className={styles.btnLatest}
          style={{ background: course.color }}
        >
          {t("my_courses.button.latest_lesson")}
        </button>
      </div>
    </div>
  );
}
