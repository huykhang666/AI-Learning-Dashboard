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
    com.ai.learning.backend.repository.LessonRepository lessonRepository;
    com.ai.learning.backend.repository.CommentRepository commentRepository;

    @lombok.experimental.NonFinal
    @org.springframework.beans.factory.annotation.Value("${app.upload.dir:uploads}")
    String uploadDir;

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
        response.setUnlocked(canAccess);

        if (response.getLessons() != null) {
            response.getLessons().sort((l1, l2) -> {
                Integer o1 = l1.getOrderIndex();
                Integer o2 = l2.getOrderIndex();
                if (o1 == null) return (o2 == null) ? 0 : 1;
                if (o2 == null) return -1;
                return o1.compareTo(o2);
            });
        }

        return response;
    }

    private boolean checkAccess(User user, Course course) {
        if (user == null) return false;

        // Admin bypass
        if (user.getRole() == com.ai.learning.backend.enums.UserRole.ADMIN) {
            return true;
        }

        // If course is premium required, premium users have access
        if (course.isPremiumRequired()) {
            if (user.isPremium() && user.getPremiumExpiredAt() != null
                    && user.getPremiumExpiredAt().isAfter(LocalDateTime.now())) {
                return true;
            }
        }

        // If course is paid (price > 0), require completed transaction
        if (course.getPrice() != null && course.getPrice() > 0) {
            return transactionRepository.existsByUserUserIdAndCourseCourseIdAndStatus(
                    user.getUserId(), course.getCourseId(), "COMPLETED"
            );
        }

        // For free courses, require enrollment
        return enrollmentRepository.existsByUserUserIdAndCourseCourseIdAndInActiveFalse(
                user.getUserId(), course.getCourseId()
        );
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public CourseResponse createCourse(String title, String description, Double price, boolean isPremiumRequired, org.springframework.web.multipart.MultipartFile thumbnail) {
        Course course = Course.builder()
                .title(title)
                .description(description)
                .price(price)
                .isPremiumRequired(isPremiumRequired)
                .build();

        // Save first to get courseId (which computes slug too)
        course = courseRepository.saveAndFlush(course);

        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String slug = course.getSlug();
                String folderName = slug + "_" + course.getCourseId();
                java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", folderName);
                java.nio.file.Files.createDirectories(targetDir);

                String originalFilename = thumbnail.getOriginalFilename();
                String ext = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".png";

                String filename = "thumbnail" + ext;
                java.nio.file.Path targetFile = targetDir.resolve(filename);
                java.nio.file.Files.copy(thumbnail.getInputStream(), targetFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String thumbnailUrl = "/uploads/courses/" + folderName + "/" + filename;
                course.setThumbnailUrl(thumbnailUrl);
                course = courseRepository.save(course);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload thumbnail: " + e.getMessage());
            }
        }

        return courseMapper.toCourseResponse(course);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public CourseResponse updateCourse(Long courseId, String title, String description, Double price, boolean isPremiumRequired, org.springframework.web.multipart.MultipartFile thumbnail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        course.setTitle(title);
        course.setDescription(description);
        course.setPrice(price);
        course.setPremiumRequired(isPremiumRequired);

        // Save to update fields and trigger PreUpdate (updating slug)
        course = courseRepository.saveAndFlush(course);

        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String slug = course.getSlug();
                String folderName = slug + "_" + course.getCourseId();
                java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", folderName);
                java.nio.file.Files.createDirectories(targetDir);

                String originalFilename = thumbnail.getOriginalFilename();
                String ext = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".png";

                String filename = "thumbnail" + ext;
                java.nio.file.Path targetFile = targetDir.resolve(filename);
                java.nio.file.Files.copy(thumbnail.getInputStream(), targetFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String thumbnailUrl = "/uploads/courses/" + folderName + "/" + filename;
                course.setThumbnailUrl(thumbnailUrl);
                course = courseRepository.save(course);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload thumbnail: " + e.getMessage());
            }
        }

        return courseMapper.toCourseResponse(course);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // Delete physical files first
        String slug = course.getSlug();
        String folderName = (slug != null ? slug : "course") + "_" + course.getCourseId();
        java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", folderName);
        if (java.nio.file.Files.exists(targetDir)) {
            try {
                java.nio.file.Files.walk(targetDir)
                        .sorted(java.util.Comparator.reverseOrder())
                        .map(java.nio.file.Path::toFile)
                        .forEach(java.io.File::delete);
            } catch (java.io.IOException e) {
                System.err.println("Failed to delete physical files for course " + courseId + ": " + e.getMessage());
            }
        }

        // Delete comments for lessons in this course
        List<Lesson> lessons = course.getLessons();
        if (lessons != null) {
            for (Lesson lesson : lessons) {
                commentRepository.deleteByLessonLessonId(lesson.getLessonId());
            }
        }

        // Delete enrollments and transactions
        enrollmentRepository.deleteByCourseCourseId(courseId);
        transactionRepository.deleteByCourseCourseId(courseId);

        // Delete course
        courseRepository.delete(course);
    }
}
