package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.CourseDetailResponse;
import com.ai.learning.backend.dto.response.CourseResponse;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface CourseService {
    List<CourseResponse> getAllCourses(Long userId);
    CourseDetailResponse getCourseDetail(Long userId, Long courseId);
    
    CourseResponse createCourse(String title, String description, Double price, boolean isPremiumRequired, MultipartFile thumbnail);
    CourseResponse updateCourse(Long courseId, String title, String description, Double price, boolean isPremiumRequired, MultipartFile thumbnail);
    void deleteCourse(Long courseId);
}
