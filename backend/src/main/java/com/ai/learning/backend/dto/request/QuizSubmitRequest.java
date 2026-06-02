package com.ai.learning.backend.dto.request;
import lombok.Data;
import java.util.Map;

@Data
public class QuizSubmitRequest {
    private Map<Long, Long> answers;
}
