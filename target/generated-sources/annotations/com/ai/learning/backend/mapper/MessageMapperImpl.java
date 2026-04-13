package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.Message;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-13T08:45:05+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class MessageMapperImpl implements MessageMapper {

    @Override
    public MessageResponse toMessageResponse(Message message) {
        if ( message == null ) {
            return null;
        }

        MessageResponse.MessageResponseBuilder messageResponse = MessageResponse.builder();

        messageResponse.sessionId( messageLearningSessionLearningSessionId( message ) );
        messageResponse.messageId( message.getMessageId() );
        messageResponse.role( message.getRole() );
        messageResponse.content( message.getContent() );
        messageResponse.createdAt( message.getCreatedAt() );

        return messageResponse.build();
    }

    @Override
    public List<MessageResponse> toMessageResponseList(List<Message> messages) {
        if ( messages == null ) {
            return null;
        }

        List<MessageResponse> list = new ArrayList<MessageResponse>( messages.size() );
        for ( Message message : messages ) {
            list.add( toMessageResponse( message ) );
        }

        return list;
    }

    private Long messageLearningSessionLearningSessionId(Message message) {
        if ( message == null ) {
            return null;
        }
        LearningSession learningSession = message.getLearningSession();
        if ( learningSession == null ) {
            return null;
        }
        Long learningSessionId = learningSession.getLearningSessionId();
        if ( learningSessionId == null ) {
            return null;
        }
        return learningSessionId;
    }
}
