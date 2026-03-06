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
    @Column(name = "ai_result_id")
    private Integer aiResultId;

    @Column(columnDefinition = "TEXT",nullable = false)
    private String transcript;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String keyPoints;

    // One-to-one relationship with LearningSession.
    // Each record is associated with exactly one session.
    // LAZY fetch to avoid unnecessary join queries.
    // session_id is a non-null and unique foreign key.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private LearningSession learningSession;
}
