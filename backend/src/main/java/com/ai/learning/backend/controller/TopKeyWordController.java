package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.TopKeywordResponse;
import com.ai.learning.backend.service.TopKeywordService;
import com.ai.learning.backend.service.impl.TopKeywordServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/keywords")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TopKeyWordController {
    TopKeywordServiceImpl topKeywordService;

    @GetMapping("/session/{sessionId}")
    public ApiResponse<List<TopKeywordResponse>> getKeywordsBySession(@PathVariable Long sessionId) {
        return ApiResponse.<List<TopKeywordResponse>>builder()
                .code(1000)
                .result(topKeywordService.getKeywordsBySession(sessionId))
                .build();
    }

    @GetMapping("/top-trending")
    public ApiResponse<List<TopKeywordResponse>> getTopTrending() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<List<TopKeywordResponse>>builder()
                .code(1000)
                .result(topKeywordService.getTopKeywords(username))
                .build();
    }
}
