package com.ai.learning.backend.dto.response;

import com.ai.learning.backend.entity.Notification;
import com.ai.learning.backend.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    String notificationId;
    String title;
    String message;
    NotificationType type;
    String sessionId;
    boolean isRead;
    LocalDateTime createdAt;

}
