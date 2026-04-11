package com.ai.learning.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProgressResponse {
    Long sessionId;
    Double completionRate;
    Long timeSpent;
    Integer lastWatchedSecond;
    Boolean isCompleted;
    LocalDateTime lastAccessed;

}
