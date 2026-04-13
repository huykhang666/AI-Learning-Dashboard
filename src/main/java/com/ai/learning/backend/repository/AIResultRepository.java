package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.AIResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AIResultRepository extends JpaRepository<AIResult,Long> {
    Optional<AIResult> findByLearningSession_LearningSessionId(Long sessionId);
}
