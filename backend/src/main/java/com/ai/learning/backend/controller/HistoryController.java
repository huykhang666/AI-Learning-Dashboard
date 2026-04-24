package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.HistoryResponse;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.service.HistoryService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class HistoryController {
    HistoryService historyService;
    SessionService sessionService;
    @GetMapping
    public ApiResponse<List<HistoryResponse>> getUserHistory() {
        return ApiResponse.<List<HistoryResponse>>builder()
                .code(1000)
                .result(historyService.getUserHistory())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SessionDetailResponse> getHistoryDetail(@PathVariable Long id) {
        return ApiResponse.<SessionDetailResponse>builder()
                .code(1000)
                .result(sessionService.getById(id))
                .build();
    }

}
