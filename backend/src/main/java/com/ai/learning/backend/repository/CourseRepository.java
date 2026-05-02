package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTitleContainingIgnoreCase(String title);

    List<Course> findByIsPremiumRequired(boolean isPremium);
}
