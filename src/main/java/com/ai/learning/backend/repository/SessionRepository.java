package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<LearningSession,Long> {
    List<LearningSession> findByUserOrderByCreatedAtDesc(User user);
}
