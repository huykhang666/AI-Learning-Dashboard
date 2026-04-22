package com.ai.learning.backend.dto.response;

import com.ai.learning.backend.enums.SessionStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HistoryResponse {
    Long sessionId;
    String title;
    String videoUrl;
    SessionStatus status;
    Double progress;
    LocalDateTime createdAt;
    String duration;
}
