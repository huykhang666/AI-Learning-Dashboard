package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    List<Message> findAllByLearningSessionIdOrderByCreatedAtAsc(Long sessionId);
}
