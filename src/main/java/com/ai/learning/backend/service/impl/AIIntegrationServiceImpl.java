package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.dto.response.AiAnalysisResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.ProcessJob;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.AIResultRepository;
import com.ai.learning.backend.repository.ProcessJobRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.service.AIIntegrationService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;


@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AIIntegrationServiceImpl implements AIIntegrationService {
    WebClient aiWebClient;
    SessionRepository sessionRepository;
    ProcessJobRepository processJobRepository;
    AIResultRepository aiResultRepository;

    //Process video using AI and save analysis results
    @Override
    @Async("taskExecutor")
    @Transactional
    public void processAndSaveAnalysis(String filePath,String videoUrl, Long sessionId) {
        if ((filePath == null || filePath.isEmpty()) && (videoUrl == null || videoUrl.isEmpty())) {
            return;
        }

        LearningSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_EXISTED));

        ProcessJob job = getJob(session);

        try {
            updateJobStatus(session, job, SessionStatus.PROCESSING, null);

            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();

            if (filePath != null && !filePath.isEmpty() && !filePath.startsWith("http")) {
                bodyBuilder.part("file", new org.springframework.core.io.FileSystemResource(new java.io.File(filePath)));
            }

            AiAnalysisResponse response = aiWebClient.post()
                    .uri(uriBuilder -> {
                        uriBuilder.path("/ai/process-video")
                                .queryParam("job_id", job.getProcessJobId());

                        if (videoUrl != null && !videoUrl.isEmpty()) {
                            uriBuilder.queryParam("youtube_url", videoUrl);
                        }

                        return uriBuilder.build();
                    })
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(AiAnalysisResponse.class)
                    .block();


            if (response != null && "success".equals(response.getStatus())) {
                saveAiResult(session, response);
                updateJobStatus(session, job, SessionStatus.COMPLETED, "Analysis successful");
            }
        } catch (Exception e) {
            log.error("AI Workflow Error for Session {}: {}", sessionId, e.getMessage());
            updateJobStatus(session, job, SessionStatus.FAILED, e.getMessage());
        }
    }

    private void saveAiResult(LearningSession session, AiAnalysisResponse response) {
        var analysis = response.getAnalysis();

        String keyPointsStr = (analysis.getKey_points() != null) ? String.join("\n", analysis.getKey_points()) : "";
        String keywordsStr = "";
        if (analysis.getKeywords() != null && !analysis.getKeywords().isEmpty()) {
            keywordsStr = String.join(", ", analysis.getKeywords());
        } else {
            keywordsStr = "No Keywords";
        }
        AIResult aiResult = AIResult.builder()
                .learningSession(session)
                .transcript(response.getTranscript())
                .summary(analysis.getSummary())
                .keyPoints(keyPointsStr)
                .keywords(keywordsStr)
                .build();
        aiResultRepository.save(aiResult);
    }

    private ProcessJob getJob(LearningSession session) {
        ProcessJob job = session.getProcessJob();

        if (job == null) {
            job = processJobRepository.findByLearningSession_LearningSessionId(session.getLearningSessionId())
                    .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));
        }
        return job;
    }

    private void updateJobStatus(LearningSession session, ProcessJob job, SessionStatus status, String error) {
        if (status == SessionStatus.COMPLETED) {
            processJobRepository.markJobAsCompleted(job.getProcessJobId());
        } else {
            processJobRepository.updateStatusOnly(job.getProcessJobId(), status, error);
        }

        session.setStatus(status);
        sessionRepository.save(session);
    }
}


