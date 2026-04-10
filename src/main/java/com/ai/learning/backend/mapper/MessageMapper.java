package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "sessionId", source = "learningSession.learningSessionId")
    MessageResponse toMessageResponse(Message message);
    List<MessageResponse> toMessageResponseList(List<Message> messages);
}
