// src/pages/dashboard/MyCourses/MyCourses.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import CourseCard from "./CoursesCard";
import CourseTabs from "./CoursesTabs";
import { useCourses } from "./UseCourses";
import styles from "./MyCourses.module.css";

export default function MyCourses() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredCourses,
  } = useCourses();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t("my_courses.title")}</h1>
          <p className={styles.pageSub}>{t("my_courses.subtitle")}</p>
        </div>
        <input
          className={styles.searchCourses}
          type="text"
          placeholder={t("my_courses.search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Course Grid */}
      <div className={styles.grid}>
        {filteredCourses.length === 0 ? (
          <div className={styles.emptyState}>{t("my_courses.empty")}</div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}
