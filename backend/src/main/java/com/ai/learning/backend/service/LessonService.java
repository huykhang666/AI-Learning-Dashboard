package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.LessonResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface LessonService {
    List<LessonResponse> getLessonsByCourse(Long courseId);
    LessonResponse getLessonDetails(Long lessonId);
    LessonResponse createLesson(Long courseId, com.ai.learning.backend.dto.request.LessonRequest request);
    LessonResponse createLesson(Long courseId, String title, Integer orderIndex, String chapter, MultipartFile video, MultipartFile thumbnail, MultipartFile document);
    LessonResponse updateLesson(Long lessonId, String title, Integer orderIndex, String chapter, MultipartFile video, MultipartFile thumbnail, MultipartFile document);
    void deleteLesson(Long lessonId);
}
