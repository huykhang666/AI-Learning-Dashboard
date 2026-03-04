package com.ai.learning.backend.dto.request;


import com.ai.learning.backend.entity.enums.SessionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateSessionRequest {
    private String title;
    private String videoUrl;
    private String description;
}
