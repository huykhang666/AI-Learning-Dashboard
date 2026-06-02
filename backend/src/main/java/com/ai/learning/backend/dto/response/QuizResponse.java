package com.ai.learning.backend.dto.response;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private Long quizId;
    private String question;
    private String explanation;
    private List<OptionDto> options;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionDto {
        private Long quizOptionId;
        private String content;
    }
}
