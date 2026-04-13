package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.TopKeywordResponse;

import java.util.List;

public interface TopKeywordService {
    void processAIKeywords(Long userId, Long sessionId, List<String> extractedKeywords);
    List<TopKeywordResponse> getKeywordsBySession(Long sessionId);
    List<TopKeywordResponse> getTopKeywords(Long userId);
}
