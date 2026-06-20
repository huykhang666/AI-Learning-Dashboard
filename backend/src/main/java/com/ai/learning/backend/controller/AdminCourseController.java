package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.service.CourseService;
import com.ai.learning.backend.service.LessonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class AdminCourseController {
    CourseService courseService;
    LessonService lessonService;

    @PostMapping(value = "/courses", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CourseResponse> createCourse(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "isPremiumRequired", defaultValue = "false") boolean isPremiumRequired,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
    ) {
        CourseResponse response = courseService.createCourse(title, description, price, isPremiumRequired, thumbnail);
        return ApiResponse.<CourseResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @PutMapping(value = "/courses/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CourseResponse> updateCourse(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "isPremiumRequired", defaultValue = "false") boolean isPremiumRequired,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
    ) {
        CourseResponse response = courseService.updateCourse(id, title, description, price, isPremiumRequired, thumbnail);
        return ApiResponse.<CourseResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @DeleteMapping("/courses/{id}")
    public ApiResponse<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Xóa khóa học thành công!")
                .build();
    }

    @PostMapping(value = "/courses/{courseId}/lessons", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<LessonResponse> createLesson(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("orderIndex") Integer orderIndex,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestPart(value = "video", required = false) MultipartFile video,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "document", required = false) MultipartFile document
    ) {
        LessonResponse response = lessonService.createLesson(courseId, title, orderIndex, chapter, video, thumbnail, document);
        return ApiResponse.<LessonResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @PutMapping(value = "/lessons/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<LessonResponse> updateLesson(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("orderIndex") Integer orderIndex,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestPart(value = "video", required = false) MultipartFile video,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "document", required = false) MultipartFile document
    ) {
        LessonResponse response = lessonService.updateLesson(id, title, orderIndex, chapter, video, thumbnail, document);
        return ApiResponse.<LessonResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @DeleteMapping("/lessons/{id}")
    public ApiResponse<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Xóa bài học thành công!")
                .build();
    }
}
