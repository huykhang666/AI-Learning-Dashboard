package com.ai.learning.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProgressRequest {
    @NotNull
    Long sessionId;
    
    Long timeSpent;

    @NotNull
    Integer currentSecond;
}
