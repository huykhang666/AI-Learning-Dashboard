package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.mapper.LessonMapper;
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
}
