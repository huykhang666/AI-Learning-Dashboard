package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.FileMetadataRequest;
import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.*;
import com.ai.learning.backend.enums.StorageProvider;
import com.ai.learning.backend.service.AIIntegrationService;
import com.ai.learning.backend.service.AIResultService;
import com.ai.learning.backend.service.FileStorageService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LearningSessionController {
    SessionService sessionService;
    AIResultService aiResultService;
    FileStorageService fileStorageService;

    //Create session, store video file, and trigger async AI analysis
    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Object> create(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "videoUrl", required = false) String videoUrl,
            @RequestPart(value = "file", required = false) MultipartFile file
    )  {
        SessionRequest request = SessionRequest.builder()
                .title(title)
                .description(description)
                .videoUrl(videoUrl)
                .build();

        StorageProvider provider = (videoUrl != null && !videoUrl.isEmpty())
                ? StorageProvider.YOUTUBE
                : StorageProvider.LOCAL;

        FileMetadataRequest fileMRequest = FileMetadataRequest.builder()
                .title(title)
                .description(description)
                .storageProvider(provider)
                .videoUrl(videoUrl)
                .build();

        FileMetadataResponse fileResponse = fileStorageService.storeFile(file,fileMRequest);

        Long sessionId = fileResponse.getLearningSessionId();

        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("sessionId", sessionId);
        result.put("status", "PROCESSING");

        return ApiResponse.builder()
                .code(1000)
                .result(result)
                .build();
    }

    //Get paginated list of sessions for current user

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

    //Get detail of a specific session
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ApiResponse<SessionDetailResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.<SessionDetailResponse>builder()
                .result(sessionService.getById(id))
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("{sessionId}/result")
    public ApiResponse<AIResultResponse> getAiResult(@PathVariable Long sessionId) {
        return ApiResponse.<AIResultResponse>builder()
                .code(1000)
                .result(aiResultService.getResultById(sessionId))
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
        return ApiResponse.<Void>builder()
                .code(1000)
                .build();
    }
}
