package com.ai.learning.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyCourseResponse {
    Long courseId;
    String title;
    String thumbnailUrl;
    Integer progress; 
    Integer totalLessons;
    boolean isActive;
}
