package com.ai.learning.backend.entity;

import com.ai.learning.backend.enums.StorageProvider;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long fileMetadataId;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(columnDefinition = "TEXT", nullable = false)
    String fileUrl;

    String fileType;

    Long size;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_provider")
    StorageProvider storageProvider;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @OneToOne(mappedBy = "fileMetadata")
    LearningSession learningSession;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
