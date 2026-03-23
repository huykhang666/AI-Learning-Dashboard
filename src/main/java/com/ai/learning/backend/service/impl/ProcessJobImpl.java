package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.FileMetadata;
import com.ai.learning.backend.entity.ProcessJob;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.ProcessJobRepository;
import com.ai.learning.backend.service.ProcessJobService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessJobImpl implements ProcessJobService {
    private final ProcessJobRepository processJobRepository;

    @Override
    @Transactional
    public void createJob(FileMetadata fileMetadata) {
        ProcessJob job = ProcessJob.builder()
                .status(SessionStatus.PENDING)
                .fileMetadata(fileMetadata)
                .build();

        processJobRepository.save(job);
        log.info("Successfully created processing job for file: {}", fileMetadata.getFileName());

        this.startProcessAsync(job.getProcessJobId());
    }

    @Override
    @Async
    @Transactional
    public void startProcessAsync(Long jobId) {
        ProcessJob job = processJobRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));

        try {
            job.setStatus(SessionStatus.PROCESSING);
            processJobRepository.save(job);
            log.info("Starting asynchronous processing for job ID: {}",jobId);

            // Simulate AI Processing delay
            Thread.sleep(10000);

            job.setStatus(SessionStatus.COMPLETED);
            processJobRepository.save(job);
            log.info("Job ID: {} completed successfully!", jobId);
        } catch (Exception e) {
            job.setStatus(SessionStatus.FAILED);
            job.setErrorMessage(e.getMessage());
            processJobRepository.save(job);
            log.error("Error occurred while processing Job {}: {}", jobId, e.getMessage());
        }
    }

    @Override
    public ProcessJobResponse getJobStatus(Long sessionId) {
       return processJobRepository.findByFileMetadata_FileStorageId(sessionId)
               .map(job -> ProcessJobResponse.builder()
                       .processJobId(job.getProcessJobId())
                       .status(job.getStatus().name())
                       .errorMessage(job.getErrorMessage())
                       .build())
               .orElseThrow(() -> new AppException(ErrorCode.JOB_NOT_FOUND));
    }

    @Override
    public void retryJob(Long jobId) {

    }


}
