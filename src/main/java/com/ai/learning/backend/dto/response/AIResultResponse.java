package com.ai.learning.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AIResultResponse {
    String transcript;
    String summary;
    @JsonProperty("key_points")
    List<String> keyPoints;
    @JsonProperty("keywords")
    List<String> keywords;
}
