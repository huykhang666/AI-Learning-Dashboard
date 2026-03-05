package com.ai.learning.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AiSummaryResponse {
    String summaryContent;
    String videoTitle;
    List<String> keyPoints;
    List<String> keywords;
}
