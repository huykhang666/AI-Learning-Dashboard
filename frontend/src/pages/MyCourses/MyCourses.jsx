// src/pages/dashboard/MyCourses/MyCourses.jsx

import React from "react";
import CourseCard from "./CoursesCard";
import CourseTabs from "./CoursesTabs";
import { useCourses } from "./UseCourses";
import styles from "./MyCourses.module.css";

export default function MyCourses() {
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
          <h1 className={styles.pageTitle}>My Courses</h1>
          <p className={styles.pageSub}>Khóa học của tôi</p>
        </div>
        <input
          className={styles.searchCourses}
          type="text"
          placeholder="Search within courses"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Course Grid */}
      <div className={styles.grid}>
        {filteredCourses.length === 0 ? (
          <div className={styles.emptyState}>
            Không tìm thấy khóa học nào 🎓
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}
