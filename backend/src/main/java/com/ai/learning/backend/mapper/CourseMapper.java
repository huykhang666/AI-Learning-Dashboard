package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.CourseDetailResponse;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.dto.response.LessonResponse;
import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface CourseMapper {
    LessonResponse toLessonResponse(Lesson lesson);
    @Mapping(target = "isFree", expression = "java(course.getPrice() == null || course.getPrice() <= 0)")
    @Mapping(target = "isUnlocked", ignore = true)
    CourseResponse toCourseResponse(Course course);
    @Mapping(target = "canAccess", ignore = true)
    CourseDetailResponse toCourseDetailResponse(Course course);
    List<LessonResponse> toLessonResponseList(List<Lesson> lessons);
}
