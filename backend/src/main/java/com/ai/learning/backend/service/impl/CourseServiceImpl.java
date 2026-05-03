package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.CourseDetailResponse;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.mapper.CourseMapper;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.repository.CourseTransactionRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseServiceImpl implements CourseService {
    CourseRepository courseRepository;
    CourseTransactionRepository transactionRepository;
    UserRepository userRepository;
    CourseMapper courseMapper;

    @Override
    public List<CourseResponse> getAllCourses(Long userId) {
        User user = userRepository.findById(userId).orElse(null);

        return courseRepository.findAll().stream().map(course -> {
            CourseResponse response = courseMapper.toCourseResponse(course);
            response.setUnlocked(checkAccess(user, course));
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public CourseDetailResponse getCourseDetail(Long userId, Long courseId) {
        Course course = courseRepository.findByIdWithLessons(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        User user = userRepository.findById(userId).orElse(null);
        boolean canAccess = checkAccess(user, course);

        CourseDetailResponse response = courseMapper.toCourseDetailResponse(course);
        response.setCanAccess(canAccess);

        return response;
    }

    private boolean checkAccess(User user, Course course) {
        if (user == null) return false;

        if (!course.isPremiumRequired() && (course.getPrice() == null || course.getPrice() <= 0)) {
            return true;
        }

        if (course.isPremiumRequired() && user.isPremium()) {
            if (user.getPremiumExpiredAt() != null && user.getPremiumExpiredAt().isAfter(LocalDateTime.now())) {
                return true;
            }
        }

        return transactionRepository.existsByUserUserIdAndCourseCourseIdAndStatus(
                user.getUserId(), course.getCourseId(), "COMPLETED");
    }
}
