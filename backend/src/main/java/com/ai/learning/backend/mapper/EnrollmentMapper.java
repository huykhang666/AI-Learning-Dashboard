package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.EnrollmentResponse;
import com.ai.learning.backend.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    @Mapping(target = "courseId", source = "course.courseId")
    @Mapping(target = "progress", source = "progress")
    @Mapping(target = "enrolledAt", source = "enrolledAt")
    EnrollmentResponse toEnrollmentResponse(Enrollment enrollment);
}
