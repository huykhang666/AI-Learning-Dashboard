package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
    Page<Message> findByLearningSession_LearningSessionIdOrderByCreatedAtAsc(Long learningSession_learningSessionId, Pageable pageable);
}