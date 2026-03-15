package com.ai.learning.backend.dto.response;

import com.ai.learning.backend.enums.SessionStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionListResponse {
    Integer learningSessionId;
    String title;
    String videoUrl;
    String description;
    SessionStatus status;
    LocalDateTime createdAt;
}
