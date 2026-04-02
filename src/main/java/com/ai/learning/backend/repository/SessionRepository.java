package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.enums.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<LearningSession,Long> {
    List<LearningSession> findByUserUsernameOrderByCreatedAtDesc(String username);

    List<LearningSession> findByStatus(SessionStatus sessionStatus);

    Page<LearningSession> findByUserUsername(String name, Pageable pageable);
}
