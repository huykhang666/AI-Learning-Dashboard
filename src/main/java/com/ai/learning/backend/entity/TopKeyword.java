package com.ai.learning.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "top_keywords")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TopKeyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long topKeywordsId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "learning_session_id")
    private LearningSession session;

    private String keyword;

    private Integer searchCount;

    private Double relevanceScore;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if(this.searchCount == null)
            this.searchCount = 1;
    }
}
