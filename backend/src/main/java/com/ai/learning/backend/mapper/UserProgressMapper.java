package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.UserProgressRequest;
import com.ai.learning.backend.dto.response.UserProgressResponse;
import com.ai.learning.backend.entity.UserProgress;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProgressMapper {
    UserProgress toEntity(UserProgressRequest request);
    UserProgressResponse toResponse(UserProgress entity);
}
