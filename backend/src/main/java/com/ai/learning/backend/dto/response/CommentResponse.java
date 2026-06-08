package com.ai.learning.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long commentId;
    String content;
    String username;
    String userFullName;
    LocalDateTime createdAt;
    int likes;
    int dislikes;
}
