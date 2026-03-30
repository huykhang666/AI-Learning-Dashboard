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
import com.ai.learning.backend.service.AIResultService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AIIntegrationServiceImpl implements AIIntegrationService {
    final WebClient aiWebClient;
    final AIResultService aiResultService;
    final SessionRepository sessionRepository;
    final ProcessJobRepository processJobRepository;

    @Override
    @Async("taskExecutor")
    public void processAndSaveAnalysis(MultipartFile file, Long sessionId) {
            log.info("Initializing AI analysis for Session ID: {}",sessionId);

            LearningSession session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

            //Init or Update Job to Processing
            ProcessJob job = getOrCreateJob(session);
            job.setStatus(SessionStatus.PROCESSING);
            processJobRepository.save(job);
            try {
                //Prepare Multipart Request
                MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
                bodyBuilder.part("file", file.getResource());

                log.info("Sending video payload to FastAPI for Session");

                //Call FastAPI and block for result
                AiAnalysisResponse response = aiWebClient.post()
                        .uri("/ai/process-video")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                        .retrieve()
                        .bodyToMono(AiAnalysisResponse.class)
                        .block();

                if(response != null && response.getAnalysis() != null) {
                    aiResultService.saveResult(response,session);

                    //Finalize status
                    updateJobStatus(job, SessionStatus.COMPLETED,null);
                    updateSessionStatus(session,SessionStatus.COMPLETED);
                    log.info("Success - Session: {}",sessionId);
                }
            } catch (Exception e) {
              log.error("Failed - Session: {}", sessionId);
              updateJobStatus(job, SessionStatus.FAILED,e.getMessage());
              updateSessionStatus(session,SessionStatus.FAILED);
            }
    }

    private ProcessJob getOrCreateJob(LearningSession session) {
        ProcessJob job = session.getProcessJob();
        return (job != null)
                ? job
                : ProcessJob.builder()
                .learningSession(session)
                .build();
    }

    private void updateJobStatus(ProcessJob job, SessionStatus status, String error) {
        job.setStatus(status);
        job.setErrorMessage(error);
        job.setUpdatedAt(LocalDateTime.now());
        processJobRepository.save(job);
    }

    private void updateSessionStatus(LearningSession session, SessionStatus status) {
        session.setStatus(status);
        sessionRepository.save(session);
    }
}


