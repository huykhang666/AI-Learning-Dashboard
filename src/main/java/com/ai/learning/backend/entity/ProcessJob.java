package com.ai.learning.backend.entity;

import com.ai.learning.backend.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long processJobId;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne
    private FileMetadata fileMetadata;


}
