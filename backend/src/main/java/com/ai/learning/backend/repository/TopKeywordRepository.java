package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.TopKeyword;
import com.ai.learning.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopKeywordRepository extends JpaRepository<TopKeyword,Long> {
    Optional<TopKeyword> findByUserAndSessionAndKeyword(User user, LearningSession session, String Keyword);
    List<TopKeyword> findBySession_LearningSessionId(Long sessionId);
    @Query(value = "SELECT * FROM top_keywords WHERE user_id = :userId " +
            "ORDER BY search_count DESC LIMIT 5", nativeQuery = true)
    List<TopKeyword> findTop5ByUser(@Param("userId") Long userId);}
