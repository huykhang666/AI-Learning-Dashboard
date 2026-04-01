import React from "react";
import styles from "./Mycourses.module.css";

export default function CourseCard({ course }) {
  const isCompleted = course.progress === 100;
  const progressColor = isCompleted ? "#22c55e" : course.color;

  return (
    <div className={styles.card}>
      {course.badge && (
        <span className={styles.cardBadge}>✓ {course.badge}</span>
      )}

      <div className={styles.cardTop} style={{ background: course.bg }}>
        <div className={styles.cardIcon}>
          <span>{course.icon}</span>
        </div>
      </div>

      <h3 className={styles.cardTitle}>{course.title}</h3>
      <p className={styles.cardLessons}>{course.lessons} Lessons</p>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${course.progress}%`, background: progressColor }}
        />
      </div>
      <p className={styles.progressLabel} style={{ color: progressColor }}>
        {course.progress}% Complete
      </p>

      <div className={styles.cardActions}>
        <button className={styles.btnView}>View Course</button>
        <button
          className={styles.btnLatest}
          style={{ background: course.color }}
        >
          Latest Lesson
        </button>
      </div>
    </div>
  );
}
