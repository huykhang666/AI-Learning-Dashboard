package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.TopKeywordResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.TopKeyword;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
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
import java.util.Optional;

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
    public void processAIKeywords(String username, Long sessionId, List<String> extractedKeywords) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        LearningSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

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
    public List<TopKeywordResponse> getTopKeywords(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return topKeywordRepository.findTop5ByUser(user.getUserId())
                .stream()
                .map(topKeywordMapper::toResponse)
                .toList();
    }
}
