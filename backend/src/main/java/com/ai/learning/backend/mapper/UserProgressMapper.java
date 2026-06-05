package com.ai.learning.backend.mapper;
import com.ai.learning.backend.dto.response.UserProgressResponse;
import com.ai.learning.backend.entity.UserProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface UserProgressMapper {

    @Mapping(source = "session.learningSessionId", target = "sessionId")
    @Mapping(source = "completed", target = "completed")
    @Mapping(source = "lastAccess", target = "lastAccessed")

    UserProgressResponse toResponse(UserProgress entity);
}