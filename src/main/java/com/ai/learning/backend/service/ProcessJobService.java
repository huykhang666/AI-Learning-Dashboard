package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.FileMetadata;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ProcessJobService {
    void createJob(FileMetadata fileMetadata);

    void startProcessAsync(Long jobId);
    ProcessJobResponse getJobStatus(Long sessionId);
    void retryJob(Long jobId);


    void updateProgress(Long jobId, int value);
}
