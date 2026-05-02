package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Course;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository {
    List<Course> findByTitleContainingIgnoreCase(String title);

    List<Course> findByIsPremiumRequired(boolean isPremium);
}
