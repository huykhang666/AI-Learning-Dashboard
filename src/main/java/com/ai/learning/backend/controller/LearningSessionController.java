package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.*;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.service.AIIntegrationService;
import com.ai.learning.backend.service.AIResultService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LearningSessionController {
    final AIIntegrationService aiIntegrationService;
    final SessionService sessionService;
    final AIResultService aiResultService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<SessionListResponse> create(
            @RequestPart("data") SessionRequest request,
            @RequestPart("file")MultipartFile file
            ) {
        log.info("Creating session: {}", request.getTitle());
        SessionListResponse session = sessionService.create(request);
        aiIntegrationService.processAndSaveAnalysis(file, session.getLearningSessionId().longValue());

        return ApiResponse.<SessionListResponse>builder()
                .code(1000)
                .result(session)
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public ApiResponse<PageResponse<SessionListResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<SessionListResponse>>builder()
                .result(sessionService.listByUser(page,size))
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ApiResponse<SessionDetailResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.<SessionDetailResponse>builder()
                .result(sessionService.getById(id))
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("{id}/result")
    public ApiResponse<AIResultResponse> getAiResult(@PathVariable Long id) {
        return ApiResponse.<AIResultResponse>builder()
                .result(aiResultService.getResultById(id))
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("{id}/status")
    public ApiResponse<String> getStatus(@PathVariable Long id) {
        return ApiResponse.<String>builder()
                .result(sessionService.getStatus(id))
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        sessionService.delete(id);
        return ApiResponse.<Void>builder().build();
    }
}
