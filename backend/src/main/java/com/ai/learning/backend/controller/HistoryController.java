package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.HistoryResponse;
import com.ai.learning.backend.service.HistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class HistoryController {
    HistoryService historyService;

    @GetMapping
    public ApiResponse<List<HistoryResponse>> getUserHistory() {
        return ApiResponse.<List<HistoryResponse>>builder()
                .code(1000)
                .result(historyService.getUserHistory())
                .build();
    }

}
