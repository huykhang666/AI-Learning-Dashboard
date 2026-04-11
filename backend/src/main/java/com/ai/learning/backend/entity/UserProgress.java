package com.ai.learning.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userProgressId;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private LearningSession session;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double completionRate;
    private Long timeSpent;
    private boolean isCompleted;
    private LocalDateTime lassAccess;

    private Integer lastWatchedSecond;

    @PreUpdate
    @PrePersist
    public void updateTimestamp() {
        this.lassAccess = LocalDateTime.now();
    }
}
