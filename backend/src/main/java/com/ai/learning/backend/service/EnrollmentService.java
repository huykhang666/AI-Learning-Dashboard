package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.UpdateProgressRequest;
import com.ai.learning.backend.dto.response.MyCourseResponse;

import java.util.List;

public interface EnrollmentService {
    List<MyCourseResponse> getMyCourses(Long userId);
    void updateProgress(UpdateProgressRequest request);
}
