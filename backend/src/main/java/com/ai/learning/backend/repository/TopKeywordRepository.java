package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.TopKeyword;
import com.ai.learning.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopKeywordRepository extends JpaRepository<TopKeyword,Long> {
    Optional<TopKeyword> findByUserAndSessionAndKeyword(User user, LearningSession session, String Keyword);
    List<TopKeyword> findBySession_LearningSessionId(Long sessionId);
    List<TopKeyword> findTop10ByUserOrderBySearchCountDesc(User user);
}
