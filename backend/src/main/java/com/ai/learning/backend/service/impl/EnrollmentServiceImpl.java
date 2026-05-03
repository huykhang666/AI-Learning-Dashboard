package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.EnrollmentResponse;
import com.ai.learning.backend.entity.Enrollment;
import com.ai.learning.backend.mapper.EnrollmentMapper;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.repository.EnrollmentRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.EnrollmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentServiceImpl implements EnrollmentService {
    EnrollmentRepository enrollmentRepository;
    UserRepository userRepository;
    CourseRepository courseRepository;
    EnrollmentMapper enrollmentMapper;

    @Override
    public EnrollmentResponse enrollCourse(Long userId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByUserUserIdAndCourseCourseId(userId, courseId)
                .orElseGet(() -> {
                    var user = userRepository.findById(userId).orElseThrow();
                    var course = courseRepository.findById(courseId).orElseThrow();
                    return enrollmentRepository.save(Enrollment.builder()
                            .user(user)
                            .course(course)
                            .inActive(false)
                            .progress(0)
                            .build());
                });
        return enrollmentMapper.toEnrollmentResponse(enrollment);
    }

    @Override
    public void updateProgress(Long userId, Long courseId, Integer progress) {
        Enrollment enrollment = enrollmentRepository.findByUserUserIdAndCourseCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Chưa ghi danh khóa học"));
        enrollment.setProgress(progress);
        enrollmentRepository.save(enrollment);
    }
}
