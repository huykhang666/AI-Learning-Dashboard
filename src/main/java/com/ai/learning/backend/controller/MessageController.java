package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.MessageRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.MessageResponse;
import com.ai.learning.backend.dto.response.PageResponse;
import com.ai.learning.backend.mapper.MessageMapper;
import com.ai.learning.backend.repository.MessageRepository;
import com.ai.learning.backend.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
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
        Pageable pageable = PageRequest.of(page - 1, size);

        var messagePage = messageRepository.findByLearningSession_LearningSessionIdOrderByCreatedAtAsc(sessionId,pageable);

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
