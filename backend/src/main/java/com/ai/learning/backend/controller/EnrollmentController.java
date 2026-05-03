package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.EnrollmentResponse;
import com.ai.learning.backend.service.EnrollmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentController {
    EnrollmentService enrollmentService;

    @PostMapping("/enroll")
    public ResponseEntity<EnrollmentResponse> enrollCourse(
            @RequestParam Long userId,
            @RequestParam Long courseId) {
        return ResponseEntity.ok(enrollmentService.enrollCourse(userId, courseId));
    }

    @PatchMapping("/progress")
    public ResponseEntity<String> updateProgress(
            @RequestParam Long userId,
            @RequestParam Long courseId,
            @RequestParam Integer progress) {
        enrollmentService.updateProgress(userId, courseId, progress);
        return ResponseEntity.ok("Cập nhật tiến độ thành công");
    }
}
