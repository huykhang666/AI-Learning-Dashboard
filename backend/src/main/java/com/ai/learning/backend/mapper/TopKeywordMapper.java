package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.TopKeywordResponse;
import com.ai.learning.backend.entity.TopKeyword;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopKeywordMapper {
    @Mapping(source = "session.learningSessionId", target = "sessionId")
    TopKeywordResponse toResponse(TopKeyword entity);
}
