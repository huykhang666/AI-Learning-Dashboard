package com.ai.learning.backend.dto.request;

import com.ai.learning.backend.enums.StorageProvider;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileMetadataRequest {
    @NotBlank(message = "TITLE_REQUIRED")
    String title;

    String youtubeUrl;

    StorageProvider storageProvider;
}
