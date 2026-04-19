package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<LearningSession,Long> {
    List<LearningSession> findByUserUsernameOrderByCreatedAtDesc(String username);

    List<LearningSession> findByStatus(SessionStatus sessionStatus);

    Page<LearningSession> findByUserUsername(String name, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM learning_session WHERE user_id = :userId", nativeQuery = true)
    long countByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT COALESCE(SUM(duration), 0) / 3600.0 FROM learning_session WHERE user_id = :userId", nativeQuery = true)
    Double getTotalStudyHours(@Param("userId") Long userId);

    @Query(value = "SELECT TO_CHAR(created_at, 'Dy') as day_name, " +
            "COALESCE(SUM(duration), 0) / 60.0 as hours " +
            "FROM learning_session " +
            "WHERE user_id = :userId " +
            "AND created_at >= date_trunc('week', CURRENT_DATE) " +
            "GROUP BY day_name, DATE(created_at) " +
            "ORDER BY DATE(created_at) ASC", nativeQuery = true)
    List<Object[]> getWeeklyProgress(@Param("userId") Long userId);
}
