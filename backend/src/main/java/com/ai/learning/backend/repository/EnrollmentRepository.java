package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface EnrollmentRepository  extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUserUserIdAndCourseCourseId(Long userId, Long courseId);
    boolean existsByUserUserIdAndCourseCourseIdAndInActiveFalse(Long userId, Long courseId);
}
