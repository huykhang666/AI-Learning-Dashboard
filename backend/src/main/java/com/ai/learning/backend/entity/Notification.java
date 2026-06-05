package com.ai.learning.backend.entity;

import com.ai.learning.backend.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    String title;

    @Column(columnDefinition = "TEXT")
    String message;

    @Enumerated(EnumType.STRING)
    NotificationType type;

    @Column(name = "target_id")
    String targetId;

    @Column(name = "is_read")
    @Builder.Default
    boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at")
    LocalDateTime createdAt;

}
