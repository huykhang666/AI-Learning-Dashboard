package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.service.ProcessJobService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcessJobController {
    private final ProcessJobService processJobService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{sessionId}")
    public ApiResponse<ProcessJobResponse> getStatus(@PathVariable Long sessionId) {
        return ApiResponse.<ProcessJobResponse>builder()
                .code(1000)
                .result(processJobService.getJobStatus(sessionId))
                .build();
    }
}
