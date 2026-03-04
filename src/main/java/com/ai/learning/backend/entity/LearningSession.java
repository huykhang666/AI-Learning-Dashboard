package com.ai.learning.backend.entity;

import com.ai.learning.backend.entity.enums.SessionStatus;
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
    private long userId;

    @Column(nullable = false)
    private String title;

    @Column(name = "video_url")
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    // Many-to-one relationship with User.
    // Multiple records can belong to a single user.
    // LAZY fetch to prevent unnecessary joins.
    // user_id is a mandatory foreign key.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = SessionStatus.PENDING;
    }
}
