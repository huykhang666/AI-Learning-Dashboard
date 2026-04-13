package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.TopKeywordResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.TopKeyword;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-13T23:44:53+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class TopKeywordMapperImpl implements TopKeywordMapper {

    @Override
    public TopKeywordResponse toResponse(TopKeyword entity) {
        if ( entity == null ) {
            return null;
        }

        TopKeywordResponse.TopKeywordResponseBuilder topKeywordResponse = TopKeywordResponse.builder();

        topKeywordResponse.sessionId( entitySessionLearningSessionId( entity ) );
        topKeywordResponse.keyword( entity.getKeyword() );
        topKeywordResponse.searchCount( entity.getSearchCount() );
        topKeywordResponse.relevanceScore( entity.getRelevanceScore() );

        return topKeywordResponse.build();
    }

    private Long entitySessionLearningSessionId(TopKeyword topKeyword) {
        if ( topKeyword == null ) {
            return null;
        }
        LearningSession session = topKeyword.getSession();
        if ( session == null ) {
            return null;
        }
        Long learningSessionId = session.getLearningSessionId();
        if ( learningSessionId == null ) {
            return null;
        }
        return learningSessionId;
    }
}
