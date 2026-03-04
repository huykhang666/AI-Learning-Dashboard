package com.ai.learning.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(columnDefinition = "LONGTEXT",nullable = false)
    private String transcript;

    @Column(columnDefinition = "LONGTEXT")
    private String summary;

    // One-to-one relationship with LearningSession.
    // Each record is associated with exactly one session.
    // LAZY fetch to avoid unnecessary join queries.
    // session_id is a non-null and unique foreign key.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private LearningSession learningSession;
}
