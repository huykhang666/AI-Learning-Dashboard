package com.ai.learning.backend.entity;

import com.ai.learning.backend.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "learning_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class LearningSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "learning_session_id")
    private Long learningSessionId;

    @Column(nullable = false)
    private String title;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;
    // Many-to-one relationship with User.
    // Multiple records can belong to a single user.
    // LAZY fetch to prevent unnecessary joins.
    // user_id is a mandatory foreign key.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "video_url", columnDefinition = "TEXT")
    String videoUrl;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = SessionStatus.PENDING;
    }

    @OneToOne(mappedBy = "learningSession", cascade = CascadeType.ALL)
    private AIResult aiResult;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "process_job_id")
    private ProcessJob processJob;

    @OneToOne
    @JoinColumn(name = "file_metadata_id")
    private FileMetadata fileMetadata;
}
