package com.ai.learning.backend.service;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.ProcessJob;
import org.springframework.web.multipart.MultipartFile;

public interface AIIntegrationService {
    void processAndSaveAnalysis(String filePath,String videoUrl, Long sessionId);
}
