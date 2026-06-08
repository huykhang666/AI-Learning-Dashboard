package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.dto.request.LessonRequest;
import com.ai.learning.backend.dto.response.CourseDetailResponse;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.mapper.CourseMapper;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.repository.CourseTransactionRepository;
import com.ai.learning.backend.repository.EnrollmentRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import com.ai.learning.backend.entity.Lesson;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseServiceImpl implements CourseService {
    CourseRepository courseRepository;
    CourseTransactionRepository transactionRepository;
    EnrollmentRepository enrollmentRepository;
    UserRepository userRepository;
    CourseMapper courseMapper;

    @Override
    public List<CourseResponse> getAllCourses(Long userId) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;

        return courseRepository.findAll().stream().map(course -> {
            CourseResponse response = courseMapper.toCourseResponse(course);
            response.setUnlocked(checkAccess(user, course));
            List<Lesson> lessons = course.getLessons();
            if (lessons != null && !lessons.isEmpty()) {
                lessons.sort(Comparator.comparing(Lesson::getOrderIndex,
                        Comparator.nullsLast(Comparator.naturalOrder())));
                response.setLatestLessonId(lessons.get(0).getLessonId());
                response.setLessonsCount(lessons.size());
            } else {
                response.setLessonsCount(0);
            }
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public CourseDetailResponse getCourseDetail(Long userId, Long courseId) {
        Course course = courseRepository.findByIdWithLessons(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        boolean canAccess = checkAccess(user, course);

        CourseDetailResponse response = courseMapper.toCourseDetailResponse(course);
        response.setCanAccess(canAccess);

        return response;
    }

    private boolean checkAccess(User user, Course course) {
        if (user == null) return false;
        boolean isEnrolled = enrollmentRepository
                .existsByUserUserIdAndCourseCourseIdAndInActiveFalse(
                        user.getUserId(), course.getCourseId()
                );
        if (isEnrolled) return true;
        if (course.isPremiumRequired() && user.isPremium()) {
            if (user.getPremiumExpiredAt() != null
                    && user.getPremiumExpiredAt().isAfter(LocalDateTime.now())) {
                return true;
            }
        }
        return transactionRepository
                .existsByUserUserIdAndCourseCourseIdAndStatus(
                        user.getUserId(), course.getCourseId(), "COMPLETED"
                );
    }
}
