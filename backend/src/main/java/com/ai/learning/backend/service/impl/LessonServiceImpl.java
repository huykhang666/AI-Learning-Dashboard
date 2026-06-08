package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.dto.request.LessonRequest;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.mapper.LessonMapper;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.repository.LessonRepository;
import com.ai.learning.backend.service.LessonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LessonServiceImpl implements LessonService {
    LessonRepository lessonRepository;
    LessonMapper lessonMapper;
    CourseRepository courseRepository;
    com.ai.learning.backend.repository.CommentRepository commentRepository;

    @lombok.experimental.NonFinal
    @org.springframework.beans.factory.annotation.Value("${app.upload.dir:uploads}")
    String uploadDir;

    @Override
    public List<LessonResponse> getLessonsByCourse(Long courseId) {
        // Lấy danh sách video sắp xếp theo thứ tự hiển thị
        return lessonMapper.toLessonResponseList(
                lessonRepository.findByCourseCourseIdOrderByOrderIndexAsc(courseId)
        );
    }

    @Override
    public LessonResponse getLessonDetails(Long lessonId) {
        var lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học"));
        return lessonMapper.toLessonResponse(lesson);
    }
    @Override
    @org.springframework.transaction.annotation.Transactional
    public LessonResponse createLesson(Long courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .orderIndex(request.getOrderIndex())
                .videoUrl(request.getVideoUrl())
                .course(course)
                .build();

        return lessonMapper.toLessonResponse(lessonRepository.save(lesson));
    }
    @Override
    @org.springframework.transaction.annotation.Transactional
    public LessonResponse createLesson(Long courseId, String title, Integer orderIndex, org.springframework.web.multipart.MultipartFile video, org.springframework.web.multipart.MultipartFile thumbnail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        Lesson lesson = Lesson.builder()
                .title(title)
                .orderIndex(orderIndex)
                .course(course)
                .build();

        // Save to generate lessonId
        lesson = lessonRepository.saveAndFlush(lesson);

        if (video != null && !video.isEmpty()) {
            try {
                String courseSlug = course.getSlug();
                String courseFolder = (courseSlug != null ? courseSlug : "course") + "_" + course.getCourseId();
                java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", courseFolder);
                java.nio.file.Files.createDirectories(targetDir);

                String lessonSlug = com.ai.learning.backend.util.SlugUtils.makeSlug(title);
                String originalFilename = video.getOriginalFilename();
                String ext = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".mp4";

                String filename = lessonSlug + "_" + lesson.getLessonId() + ext;
                java.nio.file.Path targetFile = targetDir.resolve(filename);
                java.nio.file.Files.copy(video.getInputStream(), targetFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String videoUrl = "/uploads/courses/" + courseFolder + "/" + filename;
                lesson.setVideoUrl(videoUrl);
                lesson = lessonRepository.save(lesson);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload lesson video: " + e.getMessage());
            }
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String courseSlug = course.getSlug();
                String courseFolder = (courseSlug != null ? courseSlug : "course") + "_" + course.getCourseId();
                java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", courseFolder);
                java.nio.file.Files.createDirectories(targetDir);

                String lessonSlug = com.ai.learning.backend.util.SlugUtils.makeSlug(title);
                String originalFilename = thumbnail.getOriginalFilename();
                String ext = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";

                String filename = lessonSlug + "_" + lesson.getLessonId() + "_thumb" + ext;
                java.nio.file.Path targetFile = targetDir.resolve(filename);
                java.nio.file.Files.copy(thumbnail.getInputStream(), targetFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String thumbnailUrl = "/uploads/courses/" + courseFolder + "/" + filename;
                lesson.setThumbnailUrl(thumbnailUrl);
                lesson = lessonRepository.save(lesson);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload lesson thumbnail: " + e.getMessage());
            }
        }

        return lessonMapper.toLessonResponse(lesson);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public LessonResponse updateLesson(Long lessonId, String title, Integer orderIndex, org.springframework.web.multipart.MultipartFile video, org.springframework.web.multipart.MultipartFile thumbnail) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học"));

        lesson.setTitle(title);
        lesson.setOrderIndex(orderIndex);

        if (video != null && !video.isEmpty()) {
            // Delete old physical video if exists
            if (lesson.getVideoUrl() != null) {
                java.nio.file.Path oldPath = java.nio.file.Paths.get(uploadDir, lesson.getVideoUrl().replace("/uploads/", ""));
                try {
                    java.nio.file.Files.deleteIfExists(oldPath);
                } catch (java.io.IOException e) {
                    System.err.println("Failed to delete old video file: " + e.getMessage());
                }
            }

            try {
                Course course = lesson.getCourse();
                String courseSlug = course.getSlug();
                String courseFolder = (courseSlug != null ? courseSlug : "course") + "_" + course.getCourseId();
                java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", courseFolder);
                java.nio.file.Files.createDirectories(targetDir);

                String lessonSlug = com.ai.learning.backend.util.SlugUtils.makeSlug(title);
                String originalFilename = video.getOriginalFilename();
                String ext = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".mp4";

                String filename = lessonSlug + "_" + lesson.getLessonId() + ext;
                java.nio.file.Path targetFile = targetDir.resolve(filename);
                java.nio.file.Files.copy(video.getInputStream(), targetFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String videoUrl = "/uploads/courses/" + courseFolder + "/" + filename;
                lesson.setVideoUrl(videoUrl);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload lesson video: " + e.getMessage());
            }
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            // Delete old physical thumbnail if exists
            if (lesson.getThumbnailUrl() != null) {
                java.nio.file.Path oldPath = java.nio.file.Paths.get(uploadDir, lesson.getThumbnailUrl().replace("/uploads/", ""));
                try {
                    java.nio.file.Files.deleteIfExists(oldPath);
                } catch (java.io.IOException e) {
                    System.err.println("Failed to delete old thumbnail file: " + e.getMessage());
                }
            }

            try {
                Course course = lesson.getCourse();
                String courseSlug = course.getSlug();
                String courseFolder = (courseSlug != null ? courseSlug : "course") + "_" + course.getCourseId();
                java.nio.file.Path targetDir = java.nio.file.Paths.get(uploadDir, "courses", courseFolder);
                java.nio.file.Files.createDirectories(targetDir);

                String lessonSlug = com.ai.learning.backend.util.SlugUtils.makeSlug(title);
                String originalFilename = thumbnail.getOriginalFilename();
                String ext = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";

                String filename = lessonSlug + "_" + lesson.getLessonId() + "_thumb" + ext;
                java.nio.file.Path targetFile = targetDir.resolve(filename);
                java.nio.file.Files.copy(thumbnail.getInputStream(), targetFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String thumbnailUrl = "/uploads/courses/" + courseFolder + "/" + filename;
                lesson.setThumbnailUrl(thumbnailUrl);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload lesson thumbnail: " + e.getMessage());
            }
        }

        return lessonMapper.toLessonResponse(lessonRepository.save(lesson));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học"));

        // Delete physical video file first
        if (lesson.getVideoUrl() != null) {
            java.nio.file.Path videoPath = java.nio.file.Paths.get(uploadDir, lesson.getVideoUrl().replace("/uploads/", ""));
            try {
                java.nio.file.Files.deleteIfExists(videoPath);
            } catch (java.io.IOException e) {
                System.err.println("Failed to delete physical video for lesson " + lessonId + ": " + e.getMessage());
            }
        }

        // Delete physical thumbnail file if exists
        if (lesson.getThumbnailUrl() != null) {
            java.nio.file.Path thumbPath = java.nio.file.Paths.get(uploadDir, lesson.getThumbnailUrl().replace("/uploads/", ""));
            try {
                java.nio.file.Files.deleteIfExists(thumbPath);
            } catch (java.io.IOException e) {
                System.err.println("Failed to delete physical thumbnail for lesson " + lessonId + ": " + e.getMessage());
            }
        }

        // Delete comments
        commentRepository.deleteByLessonLessonId(lessonId);

        // Delete from database
        lessonRepository.delete(lesson);
    }
}
