package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    @Mapping(target = "lessonId", source = "lessonId")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "videoUrl", source = "videoUrl")
    @Mapping(target = "thumbnailUrl", source = "thumbnailUrl")
    @Mapping(target = "orderIndex", source = "orderIndex")
    LessonResponse toLessonResponse(Lesson lesson);

    List<LessonResponse> toLessonResponseList(List<Lesson> lessons);
}
