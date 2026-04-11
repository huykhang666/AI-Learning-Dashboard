package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.AIResultResponse;
import com.ai.learning.backend.dto.response.AiAnalysisResponse;
import com.ai.learning.backend.entity.LearningSession;

public interface AIResultService {
    void saveResult(AiAnalysisResponse response, LearningSession session);
    AIResultResponse getResultById(Long sessionId);
}
