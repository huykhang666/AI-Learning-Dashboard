package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.FileMetadata;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.ProcessJob;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.ProcessJobRepository;
import com.ai.learning.backend.service.AIIntegrationService;
import com.ai.learning.backend.service.ProcessJobService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProcessJobImpl implements ProcessJobService {
    ProcessJobRepository processJobRepository;
    AIIntegrationService aiIntegrationService;

    @NonFinal
    @Autowired
    @Lazy
    ProcessJobService selfProvider;

    //Create a new processing job
    @Override
    @Transactional
    public void createJob(FileMetadata fileMetadata) {
        LearningSession session = fileMetadata.getLearningSession();
        ProcessJob job = ProcessJob.builder()
                .status(SessionStatus.PENDING)
                .fileMetadata(fileMetadata)
                .learningSession(session)
                .progress(0)
                .createdAt(LocalDateTime.now())
                .build();

        ProcessJob savedJob = processJobRepository.saveAndFlush(job);
        selfProvider.startProcessAsync(savedJob.getProcessJobId());
    }

    //Run AI analysis and save result async
    @Override
    @Async("taskExecutor")
    @Transactional
    public void startProcessAsync(Long jobId) {
        try {
            Thread.sleep(500);

            ProcessJob job = processJobRepository.findById(jobId)
                    .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

            if (job.getLearningSession() == null) {
                log.error("Job ID {} has no associated learning session!", jobId);
                return;
            }

            aiIntegrationService.processAndSaveAnalysis(
                    job.getFileMetadata() != null ? job.getFileMetadata().getFileUrl() : null,
                    job.getLearningSession().getVideoUrl(),
                    job.getLearningSession().getLearningSessionId()
            );

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Async process interrupted", e);
        } catch (Exception e) {
            log.error("Lỗi khi xử lý Async Job ID {}: {}", jobId, e.getMessage());
        }
    }

    //Get job status by session ID
    @Override
    public ProcessJobResponse getJobStatus(Long sessionId) {
        return processJobRepository.findByLearningSession_LearningSessionId(sessionId)
                .map(job -> ProcessJobResponse.builder()
                        .processJobId(job.getProcessJobId())
                        .status(job.getStatus().name())
                        .progress(job.getProgress())
                        .updateAt(job.getUpdatedAt())
                        .build())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));
    }


    @Override
    public void retryJob(Long jobId) {
        log.info("Retrying Job ID: {}", jobId);
        selfProvider.startProcessAsync(jobId);
    }

    @Override
    @Transactional
    public void updateProgress(Long jobId, int value) {
        processJobRepository.updateProgressOnly(jobId, value);
        log.info("Job ID: {} updated progress to {}%", jobId, value);
    }

}