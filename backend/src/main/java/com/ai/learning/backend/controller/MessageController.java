package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.MessageRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.dto.response.PageResponse;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.mapper.MessageMapper;
import com.ai.learning.backend.repository.MessageRepository;
import com.ai.learning.backend.repository.LessonRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MessageController {
    MessageService messageService;
    MessageRepository messageRepository;
    MessageMapper messageMapper;
    LessonRepository lessonRepository;
    UserRepository userRepository;
    SessionRepository sessionRepository;

    @PostMapping
    public ApiResponse<MessageResponse> sendMessage(@RequestBody MessageRequest request) {
        return ApiResponse.<MessageResponse>builder()
                .code(1000)
                .result(messageService.sendMessage(request))
                .build();
    }

    @GetMapping("/{sessionId}")
    public ApiResponse<PageResponse<MessageResponse>> getChatHistory(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long resolvedId = sessionId;
        if (lessonRepository.existsById(sessionId)) {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
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
            resolvedId = session.getLearningSessionId();
        }

        Pageable pageable = PageRequest.of(page - 1, size);

        var messagePage = messageRepository.findByLearningSession_LearningSessionIdOrderByCreatedAtAsc(resolvedId,pageable);

        List<MessageResponse> responses = messageMapper.toMessageResponseList(messagePage.getContent());

        return ApiResponse.<PageResponse<MessageResponse>>builder()
                .code(1000)
                .result(PageResponse.<MessageResponse>builder()
                        .currentPage(page)
                        .totalPages(messagePage.getTotalPages())
                        .pageSize(messagePage.getSize())
                        .totalElements(messagePage.getTotalElements())
                        .data(responses)
                        .build()
                )
                .build();
    }
}
