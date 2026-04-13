package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress,Long> {
    Optional<UserProgress> findByUser_UserIdAndSession_LearningSessionId(Long userId, Long sessionId);
    List<UserProgress> findByUser_UserIdAndIsCompletedTrue(Long userId);
}
