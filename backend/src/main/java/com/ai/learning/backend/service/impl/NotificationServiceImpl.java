package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.NotificationResponse;
import com.ai.learning.backend.entity.Notification;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.NotificationType;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.NotificationMapper;
import com.ai.learning.backend.repository.NotificationRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.NotificationService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;
    UserRepository userRepository;
    SimpMessagingTemplate messagingTemplate;

    @Override
    public Notification createNotification(User user, String title, String message, NotificationType type, String sessionId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .targetId(sessionId)
                .isRead(false)
                .build();

        Notification savedNote = notificationRepository.save(notification);

        // Kiểm tra an toàn trước khi bắn WebSocket
        if (savedNote.getUser() != null) {
            String destination = "/queue/notifications";

            // Dùng username làm định danh để gửi (thường STOMP dùng Principal là username)
            String receiver = savedNote.getUser().getUsername();

            messagingTemplate.convertAndSendToUser(
                    receiver,
                    destination,
                    notificationMapper.toNotificationResponse(savedNote)
            );
        }

        return savedNote;
    }

    @Override
    public List<NotificationResponse> getMyNotification() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(notificationMapper::toNotificationResponse)
                .toList();
    }

    @Override
    @Transactional
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public long countUnread() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return notificationRepository.countByUserAndIsReadFalse(user);
    }
}
