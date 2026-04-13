package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.UserProgressRequest;
import com.ai.learning.backend.dto.response.UserProgressResponse;
import com.ai.learning.backend.entity.UserProgress;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-13T08:45:06+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class UserProgressMapperImpl implements UserProgressMapper {

    @Override
    public UserProgress toEntity(UserProgressRequest request) {
        if ( request == null ) {
            return null;
        }

        UserProgress userProgress = new UserProgress();

        return userProgress;
    }

    @Override
    public UserProgressResponse toResponse(UserProgress entity) {
        if ( entity == null ) {
            return null;
        }

        UserProgressResponse.UserProgressResponseBuilder userProgressResponse = UserProgressResponse.builder();

        userProgressResponse.completionRate( entity.getCompletionRate() );
        userProgressResponse.timeSpent( entity.getTimeSpent() );
        userProgressResponse.lastWatchedSecond( entity.getLastWatchedSecond() );

        return userProgressResponse.build();
    }
}
