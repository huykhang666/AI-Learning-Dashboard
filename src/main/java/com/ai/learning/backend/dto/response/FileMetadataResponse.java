package com.ai.learning.backend.dto.response;

import com.ai.learning.backend.enums.StorageProvider;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileMetadataResponse {
    Long learningSessionId;
    Long fileMetadataId;
    String title;
    String url;
    String contentType;
    Long size;
    String friendlySize;
    StorageProvider storageProvider;
    LocalDateTime createdAt;
    String ownerName;
}
