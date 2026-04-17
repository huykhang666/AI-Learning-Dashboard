package com.ai.learning.backend.service;


import com.ai.learning.backend.dto.response.NotificationResponse;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message, NotificationType type, String sessionId);
    List<NotificationResponse> getMyNotification();
    void markAsRead(String notificationId);
    long countUnread();
}
