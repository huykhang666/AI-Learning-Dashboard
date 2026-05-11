package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.NotificationResponse;
import com.ai.learning.backend.enums.NotificationType;
import com.ai.learning.backend.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    @GetMapping("/test-push")
    public ApiResponse<String> testPush() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        notificationService.createNotification(
                null,
                "AI Processing Done",
                "Video bài giảng của bạn đã được tóm tắt xong!",
                NotificationType.AI_COMPLETE,
                "session-test-123"
        );

        return ApiResponse.<String>builder()
                .code(1000)
                .result("Đã kích hoạt gửi thông báo qua WebSocket!")
                .build();
    }

    @GetMapping("/my-notifications")
    public ApiResponse<List<NotificationResponse>> getMyNotification() {
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(1000)
                .result(notificationService.getMyNotification())
                .build();
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> countUnread() {
        return ApiResponse.<Long>builder()
                .code(1000)
                .result(notificationService.countUnread())
                .build();
    }

    @PutMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Notification marked as read")
                .build();
    }
}
