package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.NotificationResponse;
import com.ai.learning.backend.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "notificationId", target = "notificationId")
    @Mapping(source = "targetId", target = "sessionId")
    NotificationResponse toNotificationResponse(Notification notification);
}
