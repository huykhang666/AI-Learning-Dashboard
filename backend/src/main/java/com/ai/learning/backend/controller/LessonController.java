package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.LessonRequest;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.service.LessonService;
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

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonResponse> getLessonDetails(@PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getLessonDetails(lessonId));
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
