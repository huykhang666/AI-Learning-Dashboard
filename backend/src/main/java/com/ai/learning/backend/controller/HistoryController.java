package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.HistoryResponse;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.service.HistoryService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class HistoryController {
    HistoryService historyService;
    SessionService sessionService;
    SessionRepository sessionRepository;
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

    @PatchMapping("/{id}/duration")
    public ApiResponse<?> saveDuration(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {

        LearningSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getDuration() == null || session.getDuration() == 0) {
            session.setDuration(body.get("duration"));
            sessionRepository.save(session);
        }

        return ApiResponse.builder().code(1000).message("Duration saved").build();
    }

}
