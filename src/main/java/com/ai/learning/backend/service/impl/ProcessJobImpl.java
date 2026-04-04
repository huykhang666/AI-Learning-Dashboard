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
                .createdAt(LocalDateTime.now())
                .build();

        processJobRepository.save(job);
        selfProvider.startProcessAsync(job.getProcessJobId());
    }

    //Run AI analysis and save result async
    @Override
    @Async("taskExecutor")
    @Transactional
    public void startProcessAsync(Long jobId) {
        // Chỉ tìm Job và gán trạng thái bắt đầu
        ProcessJob job = processJobRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        // Kiểm tra an toàn để tránh lỗi Null khi gọi sang Integration
        if (job.getLearningSession() == null) {
            log.error("❌ Job ID {} không có LearningSession gắn kèm!", jobId);
            return;
        }

        // Gọi sang AIIntegrationService để xử lý tập trung ở một chỗ
        aiIntegrationService.processAndSaveAnalysis(
                job.getFileMetadata().getFileUrl(),
                job.getLearningSession().getLearningSessionId()
        );
    }

    //Get job status by session ID
    @Override
    public ProcessJobResponse getJobStatus(Long SessionId) {
        return processJobRepository.findByFileMetadata_FileMetadataId(SessionId)
                .map(job -> ProcessJobResponse.builder()
                        .processJobId(job.getProcessJobId())
                        .status(job.getStatus().name())
                        .updateAt(job.getUpdatedAt())
                        .errorMessage(job.getStatus() == SessionStatus.COMPLETED ? "Complete Video" : job.getErrorMessage())
                        .build())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));
    }


    @Override
    public void retryJob(Long jobId) {
        log.info("Retrying Job ID: {}", jobId);
        selfProvider.startProcessAsync(jobId);
    }
}