package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.LessonRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.service.LessonService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LessonController {
    LessonService lessonService;
    SessionService sessionService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonResponse> getLessonDetails(@PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getLessonDetails(lessonId));
    }

    @GetMapping("/{lessonId}/session")
    public ApiResponse<SessionDetailResponse> getLessonSession(@PathVariable Long lessonId) {
        return ApiResponse.<SessionDetailResponse>builder()
                .code(1000)
                .result(sessionService.getLessonSession(lessonId))
                .build();
    }
    @PostMapping("/course/{courseId}")
    public ResponseEntity<LessonResponse> createLesson(
            @PathVariable Long courseId,
            @RequestBody LessonRequest request) {
        return ResponseEntity.ok(lessonService.createLesson(courseId, request));
    }
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.ok().build();
    }
}
