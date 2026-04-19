package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.AnalyticsResponse;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.service.AnalyticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/analytics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnalyticsController {
    AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ApiResponse<AnalyticsResponse> getDashboardStats() {
        return ApiResponse.<AnalyticsResponse>builder()
                .code(1000)
                .result(analyticsService.getDashBoardStats())
                .build();
    }


}
