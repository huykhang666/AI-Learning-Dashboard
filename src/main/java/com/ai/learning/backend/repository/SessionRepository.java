package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<LearningSession,Long> {

}
