package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.LessonRequest;
import com.ai.learning.backend.dto.response.LessonResponse;

import java.util.List;

public interface LessonService {
    List<LessonResponse> getLessonsByCourse(Long courseId);
    LessonResponse getLessonDetails(Long lessonId);
    LessonResponse createLesson(Long courseId, LessonRequest request);
    void deleteLesson(Long lessonId);
}
