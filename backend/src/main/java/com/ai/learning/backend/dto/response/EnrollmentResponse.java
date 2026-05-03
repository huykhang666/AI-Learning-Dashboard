package com.ai.learning.backend.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnrollmentResponse {
    Long enrollmentId;
    Long courseId;
    Integer progress;
    LocalDateTime enrolledAt;
}
