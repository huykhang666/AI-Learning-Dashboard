package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.TopKeywordResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.TopKeyword;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.mapper.TopKeywordMapper;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.TopKeywordRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.TopKeywordService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class TopKeywordServiceImpl implements TopKeywordService {
    UserRepository userRepository;
    SessionRepository sessionRepository;
    TopKeywordRepository topKeywordRepository;
    TopKeywordMapper topKeywordMapper;
    @Override
    @Transactional
    public void processAIKeywords(Long userId, Long sessionId, List<String> extractedKeywords) {
        User user = userRepository.findById(userId).orElseThrow();
        LearningSession session = sessionRepository.findById(sessionId).orElseThrow();

        for (String key : extractedKeywords) {
            TopKeyword topKeyword = topKeywordRepository
                    .findByUserAndSessionAndKeyword(user, session, key)
                    .orElse(TopKeyword.builder()
                            .user(user)
                            .session(session)
                            .keyword(key)
                            .searchCount(0)
                            .relevanceScore(1.0)
                            .build());

            topKeyword.setSearchCount(topKeyword.getSearchCount() + 1);
            topKeywordRepository.save(topKeyword);
        }
    }
    @Override
    public List<TopKeywordResponse> getKeywordsBySession(Long sessionId) {
        List<TopKeyword> keywords = topKeywordRepository.findBySession_LearningSessionId(sessionId);

        return keywords.stream()
                .map(topKeywordMapper::toResponse)
                .toList();
    }

    @Override
    public List<TopKeywordResponse> getTopKeywords(Long userId) {
        return topKeywordRepository.findTop10ByUserOrderBySearchCountDesc(userRepository.findById(userId).orElseThrow())
                .stream()
                .map(topKeywordMapper::toResponse)
                .toList();
    }
}
