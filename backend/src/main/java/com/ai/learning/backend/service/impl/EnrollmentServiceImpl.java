package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.UpdateProgressRequest;
import com.ai.learning.backend.dto.response.MyCourseResponse;
import com.ai.learning.backend.entity.Enrollment;
import com.ai.learning.backend.mapper.EnrollmentMapper;
import com.ai.learning.backend.repository.EnrollmentRepository;
import com.ai.learning.backend.service.EnrollmentService;
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
public class EnrollmentServiceImpl implements EnrollmentService {
    EnrollmentRepository enrollmentRepository;
    EnrollmentMapper enrollmentMapper;

    @Override
    public List<MyCourseResponse> getMyCourses(Long userId) {
        return enrollmentRepository.findByUser_UserId(userId).stream()
                .map(enrollmentMapper::toMyCourseResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateProgress(UpdateProgressRequest request) {
        Enrollment enrollment = enrollmentRepository
                .findByUser_UserIdAndCourse_CourseId(request.getUserId(), request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course registration not found!"));

        enrollment.setProgress(request.getProgress());
        enrollmentRepository.save(enrollment);
    }
}
