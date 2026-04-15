package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.UserProgressRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.UserProgressResponse;
import com.ai.learning.backend.service.UserProgressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProgressController {

    UserProgressService progressService;

    @PostMapping("/update")
    public ApiResponse<UserProgressResponse> updateProgress(@RequestBody UserProgressRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        UserProgressResponse response = progressService.updateProgress(currentUsername, request);
        return ApiResponse.<UserProgressResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }
}
