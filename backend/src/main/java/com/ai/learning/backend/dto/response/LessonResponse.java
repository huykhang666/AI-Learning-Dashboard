package com.ai.learning.backend.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessonResponse {
    Long lessonId;
    String title;
    String videoUrl;
    String thumbnailUrl;
    Integer orderIndex;
    Integer duration;
}
