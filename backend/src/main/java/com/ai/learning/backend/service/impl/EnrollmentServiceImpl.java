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
    com.ai.learning.backend.repository.CourseTransactionRepository transactionRepository;

    @Override
    public EnrollmentResponse enrollCourse(Long userId, Long courseId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // Admin bypass
        boolean isAdmin = user.getRole() == com.ai.learning.backend.enums.UserRole.ADMIN;
        if (!isAdmin) {
            // If course requires premium, check if user is premium
            if (course.isPremiumRequired()) {
                boolean hasPremiumAccess = user.isPremium() && user.getPremiumExpiredAt() != null
                        && user.getPremiumExpiredAt().isAfter(java.time.LocalDateTime.now());
                if (!hasPremiumAccess) {
                    boolean hasPaid = transactionRepository.existsByUserUserIdAndCourseCourseIdAndStatus(userId, courseId, "COMPLETED");
                    if (!hasPaid) {
                        throw new RuntimeException("Khóa học yêu cầu tài khoản Premium hoặc phải mua khóa học");
                    }
                }
            } else if (course.getPrice() != null && course.getPrice() > 0) {
                // If course has price > 0, check if they have a completed transaction
                boolean hasPaid = transactionRepository.existsByUserUserIdAndCourseCourseIdAndStatus(userId, courseId, "COMPLETED");
                if (!hasPaid) {
                    throw new RuntimeException("Bạn chưa thanh toán cho khóa học này");
                }
            }
        }

        Enrollment enrollment = enrollmentRepository.findByUserUserIdAndCourseCourseId(userId, courseId)
                .orElseGet(() -> enrollmentRepository.save(Enrollment.builder()
                        .user(user)
                        .course(course)
                        .inActive(false)
                        .progress(0)
                        .build()));
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
