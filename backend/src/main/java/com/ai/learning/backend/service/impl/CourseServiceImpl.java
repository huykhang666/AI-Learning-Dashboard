package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.CourseRequest;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.mapper.CourseMapper;
import com.ai.learning.backend.mapper.LessonMapper;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.repository.LessonRepository;
import com.ai.learning.backend.service.logic.CourseService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseServiceImpl implements CourseService {
    CourseRepository courseRepository;
    LessonRepository lessonRepository;
    CourseMapper courseMapper;
    LessonMapper lessonMapper;

    @Override
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(courseMapper::toCourseResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LessonResponse> getLessonsByCourse(Long courseId) {
        return lessonMapper.toLessonResponseList(
                lessonRepository.findByCourse_CourseIdOrderByOrderIndexAsc(courseId)
        );
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        courseMapper.updateCourse(course, request);
        return courseMapper.toCourseResponse(courseRepository.save(course));
    }
}
