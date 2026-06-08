package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPriceNullOrPrice(Double price);

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.lessons l WHERE c.courseId = :courseId ORDER BY l.orderIndex ASC")
    Optional<Course> findByIdWithLessons(@Param("courseId") Long courseId);
}
