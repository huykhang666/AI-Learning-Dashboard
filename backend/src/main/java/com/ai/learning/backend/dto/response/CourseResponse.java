package com.ai.learning.backend.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseResponse {
    Long courseId;
    String title;
    String thumbnailUrl;
    Double price;
    boolean isPremiumRequired;
    boolean isFree;
    boolean isUnlocked; 

}
