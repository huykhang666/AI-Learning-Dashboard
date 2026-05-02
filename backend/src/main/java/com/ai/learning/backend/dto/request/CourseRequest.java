package com.ai.learning.backend.dto.request;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseRequest {
    String title;
    String description;
    String thumbnailUrl;
    Double price;
    String youtubePlaylistId;
    boolean isPremiumRequired;
}
