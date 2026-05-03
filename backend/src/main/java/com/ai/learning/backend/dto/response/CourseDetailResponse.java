package com.ai.learning.backend.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseDetailResponse {
    Long courseId;
    String title;
    String description;
    List<LessonResponse> lessons;
    boolean canAccess;
}
