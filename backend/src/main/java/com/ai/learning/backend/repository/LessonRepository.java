package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.CourseTransaction;
import com.ai.learning.backend.entity.Enrollment;
import com.ai.learning.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository  extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourse_CourseIdOrderByOrderIndexAsc(Long courseId);
}
