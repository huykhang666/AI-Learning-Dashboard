package com.ai.learning.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AiAnalysisResponse {
    String transcript;
    AnalysisData analysis;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class AnalysisData {
        String summary;
        List<String> keyPoints;
    }
}
