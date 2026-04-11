package com.ai.learning.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AiAnalysisResponse {
    String status;
    String transcript;
    AnalysisData analysis;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class AnalysisData {
        String summary;
        @JsonProperty("key_points")
        List<String> key_points;
        @JsonProperty("keywords")
        private List<String> keywords;
    }
}
