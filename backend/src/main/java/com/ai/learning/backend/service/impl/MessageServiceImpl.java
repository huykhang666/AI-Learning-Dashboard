package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.MessageRequest;
import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.entity.Message;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.enums.MessageRole;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.MessageMapper;
import com.ai.learning.backend.repository.MessageRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.repository.LessonRepository;
import com.ai.learning.backend.service.MessageService;
import com.ai.learning.backend.service.logic.ChatBotAsyncTask;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
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
    UserRepository userRepository;
    LessonRepository lessonRepository;

    @Override
    @Transactional
    public MessageResponse sendMessage(MessageRequest request) {
        Long sessionId = request.getSessionId();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (lessonRepository.existsById(sessionId)) {
            Lesson lesson = lessonRepository.findById(sessionId).orElseThrow();
            LearningSession session = sessionRepository.findByUserIdAndVideoUrl(user.getUserId(), lesson.getVideoUrl())
                    .orElseGet(() -> {
                        LearningSession newSession = LearningSession.builder()
                                .title(lesson.getTitle())
                                .videoUrl(lesson.getVideoUrl())
                                .status(SessionStatus.COMPLETED)
                                .user(user)
                                .duration(lesson.getDuration() != null ? lesson.getDuration() : 600)
                                .build();
                        return sessionRepository.save(newSession);
                    });
            sessionId = session.getLearningSessionId();
        }

        //Find session
        var session = sessionRepository.findById(sessionId)
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
        messageRepository.save(aiPendingMessage);


        //Get the 5 recent message
        List<Map<String, String>> history = messageRepository
                .findByLearningSession_LearningSessionIdOrderByCreatedAtAsc(
                        sessionId, PageRequest.of(0, 5))
                .getContent()
                .stream()
                .map(m -> Map.of("role", m.getRole().name().toLowerCase(), "content", m.getContent()))
                .toList();

        Map<String, Object> apiRequest = Map.of(
                "session_id", sessionId.toString(),
                "query", request.getContent(),
                "history", history
        );

        chatBotAsyncTask.callFastApiAndUpdateMessage(apiRequest, aiPendingMessage.getMessageId());

        return messageMapper.toMessageResponse(aiPendingMessage);
    }
}
