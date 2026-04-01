import React from "react";
import { TABS } from "./CoursesData";
import styles from "./Mycourses.module.css";
export default function CourseTabs({ activeTab, onTabChange }) {
  return (
    <div className={styles.tabs}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
