package com.ai.learning.backend.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionRequest {
    private String title;
    private String videoUrl;
    private String description;
}
