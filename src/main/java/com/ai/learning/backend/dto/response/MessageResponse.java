package com.ai.learning.backend.dto.response;

import com.ai.learning.backend.entity.Message;
import com.ai.learning.backend.enums.MessageRole;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
    Long messageId;
    Long sessionId;
    MessageRole role;
    String content;
    LocalDateTime createdAt;
}
