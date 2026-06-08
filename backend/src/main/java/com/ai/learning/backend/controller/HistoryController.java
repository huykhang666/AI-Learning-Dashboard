package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.HistoryResponse;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.LessonRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.HistoryService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
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
    LessonRepository lessonRepository;
    UserRepository userRepository;
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

        Long resolvedId = id;
        if (lessonRepository.existsById(id)) {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Lesson lesson = lessonRepository.findById(id).orElseThrow();
            LearningSession session = sessionRepository.findByUserIdAndVideoUrl(user.getUserId(), lesson.getVideoUrl())
                    .orElseGet(() -> {
                        LearningSession newSession = LearningSession.builder()
                                .title(lesson.getTitle())
                                .videoUrl(lesson.getVideoUrl())
                                .status(SessionStatus.COMPLETED)
                                .user(user)
                                .duration(body.get("duration"))
                                .build();
                        return sessionRepository.save(newSession);
                    });
            resolvedId = session.getLearningSessionId();
        }

        LearningSession session = sessionRepository.findById(resolvedId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getDuration() == null || session.getDuration() == 0) {
            session.setDuration(body.get("duration"));
            sessionRepository.save(session);
        }

        return ApiResponse.builder().code(1000).message("Duration saved").build();
    }

}
