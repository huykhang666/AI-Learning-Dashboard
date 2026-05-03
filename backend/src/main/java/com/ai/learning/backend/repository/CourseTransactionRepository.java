package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.CourseTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseTransactionRepository extends JpaRepository<CourseTransaction, Long> {
    boolean existsByUserUserIdAndCourseCourseIdAndStatus(Long userId, Long courseId, String status);
    List<CourseTransaction> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}
