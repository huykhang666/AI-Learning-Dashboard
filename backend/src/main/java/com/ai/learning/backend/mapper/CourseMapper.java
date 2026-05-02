package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.CourseRequest;
import com.ai.learning.backend.dto.response.CourseResponse;
import com.ai.learning.backend.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    CourseResponse toCourseResponse(Course course);

    @Mapping(target = "totalLessons", expression = "java(course.getLessons() != null ? course.getLessons().size() : 0)")
    CourseResponse toCourseResponseWithCount(Course course);

    void updateCourse(@MappingTarget Course course, CourseRequest request);
}
