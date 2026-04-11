package com.ai.learning.backend.dto.response;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcessJobResponse {
    Long processJobId;
    String status;
    String errorMessage;
    int progress;
    LocalDateTime updateAt;
}
