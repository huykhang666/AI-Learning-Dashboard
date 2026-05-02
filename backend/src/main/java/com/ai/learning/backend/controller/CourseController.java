package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.UpdateProgressRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.dto.response.MyCourseResponse;
import com.ai.learning.backend.service.EnrollmentService;
import com.ai.learning.backend.service.logic.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin("*")
public class CourseController {
    CourseService courseService;
    EnrollmentService enrollmentService;

    @GetMapping("/all")
    public ApiResponse<List<CourseResponse>> getAll() {
        return ApiResponse.<List<CourseResponse>>builder()
                .code(1000)
                .result(courseService.getAllCourses())
                .build();
    }

    @GetMapping("/{courseId}/lessons")
    public ApiResponse<List<LessonResponse>> getLessons(@PathVariable Long courseId) {
        return ApiResponse.<List<LessonResponse>>builder()
                .code(1000)
                .result(courseService.getLessonsByCourse(courseId))
                .build();
    }

    // --- Quản lý Cá nhân hóa (Enrollment & Progress) ---
    @GetMapping("/my-courses/{userId}")
    public ApiResponse<List<MyCourseResponse>> getMyCourses(@PathVariable Long userId) {
        return ApiResponse.<List<MyCourseResponse>>builder()
                .code(1000)
                .result(enrollmentService.getMyCourses(userId))
                .build();
    }

    @PostMapping("/progress")
    public ApiResponse<Void> updateProgress(@RequestBody UpdateProgressRequest request) {
        enrollmentService.updateProgress(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Updated")
                .build();
    }
}
