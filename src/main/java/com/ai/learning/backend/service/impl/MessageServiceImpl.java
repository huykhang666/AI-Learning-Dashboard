package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.MessageRequest;
import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.entity.Message;
import com.ai.learning.backend.enums.MessageRole;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.MessageMapper;
import com.ai.learning.backend.repository.MessageRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.service.MessageService;
import com.ai.learning.backend.service.logic.ChatBotAsyncTask;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MessageServiceImpl implements MessageService {
    MessageRepository messageRepository;
    SessionRepository sessionRepository;
    MessageMapper messageMapper;
    ChatBotAsyncTask chatBotAsyncTask;

    @Override
    @Transactional
    public MessageResponse sendMessage(MessageRequest request) {
        //Find session
        var session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        //Save question to the database
        Message userMessage = Message.builder()
                .learningSession(session)
                .content(request.getContent())
                .role(MessageRole.USER)
                .build();
        messageRepository.save(userMessage);

        Message aiPendingMessage = Message.builder()
                .learningSession(session)
                .content("...")
                .role(MessageRole.ASSISTANT)
                .build();

        //Get the 5 recent message
        List<Map<String, String>> history = messageRepository
                .findByLearningSession_LearningSessionIdOrderByCreatedAtAsc(
                        request.getSessionId(), PageRequest.of(0, 5))
                .getContent()
                .stream()
                .map(m -> Map.of("role", m.getRole().name().toLowerCase(), "content", m.getContent()))
                .toList();

        Map<String, Object> apiRequest = Map.of(
                "session_id", request.getSessionId().toString(),
                "query", request.getContent(),
                "history", history
        );

        chatBotAsyncTask.callFastApiAndUpdateMessage(apiRequest, aiPendingMessage.getMessageId());

        return messageMapper.toMessageResponse(aiPendingMessage);
    }
}
