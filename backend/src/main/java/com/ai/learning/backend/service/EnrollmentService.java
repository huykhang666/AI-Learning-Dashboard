package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.EnrollmentResponse;

public interface EnrollmentService {
    EnrollmentResponse enrollCourse(Long userId, Long courseId);
    void updateProgress(Long userId, Long courseId, Integer progress);
}
