package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.dto.response.SessionListResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface SessionMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    LearningSession toEntity(SessionRequest request);

    SessionListResponse toListResponse(LearningSession session);

    @Mapping(target = "learningSessionId", source = "session.learningSessionId")
    @Mapping(target = "status", source = "session.status")
    @Mapping(target = "transcript", source = "aiResult.transcript")
    @Mapping(target = "summary", source = "aiResult.summary")
    @Mapping(target = "keyPoints", source = "aiResult.keyPoints")
    SessionDetailResponse toDetailResponse(LearningSession session, AIResult aiResult);
}
