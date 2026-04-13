package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.ProcessJobResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.service.ProcessJobService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
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

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/retry/{jobId}")
    public ApiResponse<String> retryJob(@PathVariable Long jobId) {
        processJobService.retryJob(jobId);
        return ApiResponse.<String>builder()
                .code(1000)
                .result("Retry request submitted successfully")
                .build();
    }


    @PreAuthorize("permitAll()")
    @PatchMapping("/update-progress/{jobId}")
    public ApiResponse<String> updateProgress(
            @PathVariable Long jobId,
            @RequestParam("value") int value
    ) {
        processJobService.updateProgress(jobId, value);
        return ApiResponse.<String>builder()
                .code(1000)
                .result("Update progress success")
                .build();
    }
}
