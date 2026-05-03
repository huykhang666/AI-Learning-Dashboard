package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.CourseDetailResponse;
import com.ai.learning.backend.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {
    List<CourseResponse> getAllCourses(Long userId);
    CourseDetailResponse getCourseDetail(Long userId, Long courseId);
}
