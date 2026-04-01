import { useState, useMemo } from "react";
import { COURSES } from "./CoursesData";

export function useCourses() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    let result = COURSES;

    if (activeTab !== "all") {
      result = result.filter((c) => c.status === activeTab);
    }

    if (searchQuery.trim()) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result;
  }, [activeTab, searchQuery]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredCourses,
    totalCourses: COURSES.length,
    completedCount: COURSES.filter((c) => c.status === "completed").length,
    inProgressCount: COURSES.filter((c) => c.status === "in-progress").length,
  };
}
