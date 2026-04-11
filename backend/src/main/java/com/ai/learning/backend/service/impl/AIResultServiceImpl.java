package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.AIResultResponse;
import com.ai.learning.backend.dto.response.AiAnalysisResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.AIResultRepository;
import com.ai.learning.backend.service.AIResultService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AIResultServiceImpl implements AIResultService {
    final AIResultRepository aiResultRepository;

    @Override
    @Transactional
    public void saveResult(AiAnalysisResponse response, LearningSession session) {
        log.info("Saving for Session: {}", session.getLearningSessionId());

        var analysis = response.getAnalysis();

        String keyPoints = (response.getAnalysis() != null && response.getAnalysis().getKey_points() != null)
                ? String.join("\n",response.getAnalysis().getKey_points())
                : "";
        String keywords = (analysis != null && analysis.getKeywords() != null)
                ? String.join(", ", analysis.getKeywords())
                : "";

        AIResult aiResult = AIResult.builder()
                .transcript(response.getTranscript())
                .summary(response.getAnalysis().getSummary())
                .keyPoints(keyPoints)
                .keywords(keywords)
                .learningSession(session)
                .build();

        aiResultRepository.save(aiResult);
    }

    //Get AI analysis results by session ID
    @Override
    public AIResultResponse getResultById(Long sessionId) {
        log.info("AI Result for session: {}", sessionId);
        AIResult aiResult = aiResultRepository.findByLearningSession_LearningSessionId((long) sessionId.intValue())
                .orElseThrow(() -> new AppException(ErrorCode.RESULT_NOT_FOUND));

        return AIResultResponse.builder()
                .transcript(aiResult.getTranscript())
                .summary(aiResult.getSummary())

                .keyPoints(aiResult.getKeyPoints() != null
                        ? Arrays.asList(aiResult.getKeyPoints().split("\n"))
                        : Collections.emptyList())
                .keywords(aiResult.getKeywords() != null
                        ? Arrays.asList(aiResult.getKeywords().split(", "))
                        : Collections.emptyList())
                .build();
    }


}
