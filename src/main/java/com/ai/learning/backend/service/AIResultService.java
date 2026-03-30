package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.AiAnalysisResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;

public interface AIResultService {
    AIResult saveResult(AiAnalysisResponse response, LearningSession session);
}
