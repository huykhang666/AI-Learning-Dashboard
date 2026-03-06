package com.ai.learning.backend.dto.response;

import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.enums.SessionStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionDetailResponse {
    Integer learningSessionId;
    String title;
    String videoUrl;
    String transcript;
    String summary;
    String keyPoints;
    SessionStatus staus;
}
