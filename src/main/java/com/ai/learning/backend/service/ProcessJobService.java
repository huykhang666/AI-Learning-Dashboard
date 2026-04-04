package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.FileMetadata;

public interface ProcessJobService {
    void createJob(FileMetadata fileMetadata);

    void startProcessAsync(Long jobId);
    ProcessJobResponse getJobStatus(Long sessionId);
    void retryJob(Long jobId);
}
