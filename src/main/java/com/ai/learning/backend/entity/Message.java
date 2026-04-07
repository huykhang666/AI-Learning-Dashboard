package com.ai.learning.backend.entity;

import com.ai.learning.backend.enums.MessageRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    LearningSession learningSession;

    @Enumerated(EnumType.STRING)
    MessageRole role;

    @Column(columnDefinition = "TEXT")
    String content;

    @CreationTimestamp
    LocalDateTime createdAt;
}
