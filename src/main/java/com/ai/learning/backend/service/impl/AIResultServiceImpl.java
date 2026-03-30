package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.AiAnalysisResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.repository.AIResultRepository;
import com.ai.learning.backend.service.AIResultService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AIResultServiceImpl implements AIResultService {
    final AIResultRepository aiResultRepository;

    @Override
    @Transactional
    public AIResult saveResult(AiAnalysisResponse response, LearningSession session) {
        log.info("Saving for Session: {}", session.getLearningSessionId());

        String keyPoints = (response.getAnalysis() != null && response.getAnalysis().getKeyPoints() != null)
                ? String.join("\n",response.getAnalysis().getKeyPoints())
                : "";

        AIResult aiResult = AIResult.builder()
                .transcript(response.getTranscript())
                .summary(response.getAnalysis().getSummary())
                .keyPoints(keyPoints)
                .learningSession(session)
                .build();

        return aiResultRepository.save(aiResult);
    }


}
