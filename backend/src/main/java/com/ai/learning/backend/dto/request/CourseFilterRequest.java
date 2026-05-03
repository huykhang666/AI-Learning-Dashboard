package com.ai.learning.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseFilterRequest {
    String keyword;
    Double minPrice;
    Double maxPrice;
    Boolean isPremium;
}
