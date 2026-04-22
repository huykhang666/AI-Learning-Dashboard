package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.HistoryResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.UserProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")

public interface HistoryMapper {
    @Mapping(target = "sessionId", source = "session.learningSessionId")
    @Mapping(target = "title", source = "session.title")
    @Mapping(target = "videoUrl", source = "session.videoUrl")
    @Mapping(target = "createdAt", source = "session.createdAt")
    @Mapping(target = "duration", source = "session.duration")
    @Mapping(target = "progress", source = "userProgress.completionRate")
    @Mapping(target = "status", source = "session.status")
    HistoryResponse toHistoryResponse(LearningSession session, UserProgress userProgress);
}
