package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.MyCourseResponse;
import com.ai.learning.backend.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    @Mapping(target = "courseId", source = "course.courseId")
    @Mapping(target = "title", source = "course.title")
    @Mapping(target = "thumbnailUrl", source = "course.thumbnailUrl")
    @Mapping(target = "totalLessons", expression = "java(enrollment.getCourse().getLessons() != null ? enrollment.getCourse().getLessons().size() : 0)")
    MyCourseResponse toMyCourseResponse(Enrollment enrollment);
}
