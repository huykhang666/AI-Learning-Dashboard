package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.CourseTransactionResponse;
import com.ai.learning.backend.entity.CourseTransaction;
import org.mapstruct.Mapping;

public interface CourseTransactionMapper {
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "userId", source = "user.userId")
    CourseTransactionResponse toTransactionResponse(CourseTransaction transaction);
}
