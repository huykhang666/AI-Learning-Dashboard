package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.entity.Lesson;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    LessonResponse toLessonResponse(Lesson lesson);
    List<LessonResponse> toLessonResponseList(List<Lesson> lessons);
}
