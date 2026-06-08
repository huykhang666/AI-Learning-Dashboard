package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByLessonLessonIdOrderByCreatedAtDesc(Long lessonId);
    void deleteByLessonLessonId(Long lessonId);
}
