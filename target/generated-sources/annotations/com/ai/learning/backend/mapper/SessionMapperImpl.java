package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.dto.response.SessionListResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-13T08:45:05+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class SessionMapperImpl implements SessionMapper {

    @Override
    public LearningSession toEntity(SessionRequest request) {
        if ( request == null ) {
            return null;
        }

        LearningSession.LearningSessionBuilder learningSession = LearningSession.builder();

        learningSession.title( request.getTitle() );
        learningSession.description( request.getDescription() );
        learningSession.videoUrl( request.getVideoUrl() );

        return learningSession.build();
    }

    @Override
    public SessionListResponse toListResponse(LearningSession session) {
        if ( session == null ) {
            return null;
        }

        SessionListResponse.SessionListResponseBuilder sessionListResponse = SessionListResponse.builder();

        sessionListResponse.learningSessionId( session.getLearningSessionId() );
        sessionListResponse.title( session.getTitle() );
        sessionListResponse.videoUrl( session.getVideoUrl() );
        sessionListResponse.description( session.getDescription() );
        sessionListResponse.status( session.getStatus() );
        sessionListResponse.createdAt( session.getCreatedAt() );

        return sessionListResponse.build();
    }

    @Override
    public SessionDetailResponse toDetailResponse(LearningSession session, AIResult aiResult) {
        if ( session == null && aiResult == null ) {
            return null;
        }

        SessionDetailResponse.SessionDetailResponseBuilder sessionDetailResponse = SessionDetailResponse.builder();

        if ( session != null ) {
            sessionDetailResponse.learningSessionId( session.getLearningSessionId() );
            sessionDetailResponse.status( session.getStatus() );
            sessionDetailResponse.title( session.getTitle() );
            sessionDetailResponse.videoUrl( session.getVideoUrl() );
        }
        if ( aiResult != null ) {
            sessionDetailResponse.transcript( aiResult.getTranscript() );
            sessionDetailResponse.summary( aiResult.getSummary() );
            sessionDetailResponse.keyPoints( aiResult.getKeyPoints() );
        }

        return sessionDetailResponse.build();
    }
}
