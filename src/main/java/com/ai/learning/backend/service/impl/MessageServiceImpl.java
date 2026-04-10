package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.MessageRequest;
import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.entity.Message;
import com.ai.learning.backend.enums.MessageRole;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.MessageRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.service.MessageService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MessageServiceImpl implements MessageService {
    MessageRepository messageRepository;
    SessionRepository sessionRepository;
    WebClient webClient;

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

        //Get the 5 most recent message
        List<Map<String,String>> history = messageRepository
                .findByLearningSession_LearningSessionIdOrderByCreatedAtAsc(
                        request.getSessionId(), PageRequest.of(0,5))
                .getContent()
                .stream()
                .map(m -> Map.of("role", m.getRole().name().toLowerCase(), "content",m.getContent()))
                .toList();
        //Call API
        Map<String,Object> apiRequest = Map.of(
                "session_id", request.getSessionId().toString(),
                "query", request.getContent(),
                "history", history
        );

        log.info("Calling AI Service for Session: {}", request.getSessionId());

        Map<String,String> aiRawResponse = webClient.post()
                .uri("http://localhost:8000/ai/chat")
                .bodyValue(apiRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String,String>>() {})
                .block();

        assert aiRawResponse != null;
        String aiContent = aiRawResponse.get("answer");

        //Save message AI to the database
        Message aiMessage = Message.builder()
                .learningSession(session)
                .content(aiContent)
                .role(MessageRole.ASSISTANT)
                .build();
        messageRepository.save(aiMessage);

        //Return DTO
        return MessageResponse.builder()
                .messageId(aiMessage.getMessageId())
                .content(aiContent)
                .role(aiMessage.getRole())
                .createdAt(aiMessage.getCreatedAt())
                .build();
    }
}
