package com.ai.learning.backend.service.logic;

import com.ai.learning.backend.dto.request.CourseRequest;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.dto.response.LessonResponse;

import java.util.List;

public interface CourseService {
    List<CourseResponse> getAllCourses();
    List<LessonResponse> getLessonsByCourse(Long courseId);
    CourseResponse createCourse(CourseRequest request);
}
