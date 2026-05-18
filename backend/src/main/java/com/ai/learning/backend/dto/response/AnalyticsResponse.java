package com.ai.learning.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnalyticsResponse {
    String fullname;
    double totalHours;
    long totalLectures;
    Integer weekGoal;
    List<DailyProgress> weeklyProgress;
    List<String> topKeywords;
    int uploadCount;
    String role;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DailyProgress {
        public String day;
        public double hours;
    }
}
