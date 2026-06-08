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
    public LessonResponse createLesson(Long courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .videoId(request.getVideoId())
                .orderIndex(request.getOrderIndex())
                .course(course)
                .build();

        return lessonMapper.toLessonResponse(lessonRepository.save(lesson));
    }
    @Override
    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }
}
