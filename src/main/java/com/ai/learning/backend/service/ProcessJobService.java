package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.FileMetadata;

public interface ProcessJobService {
    void createJob(FileMetadata fileMetadata);

    void startProcessAsync(Long jobId);
    //Tuần 4 (thứ 5)
    ProcessJobResponse getJobStatus(Long sessionId);

    //Tuần 5 thứ 5
    void retryJob(Long jobId);
}
