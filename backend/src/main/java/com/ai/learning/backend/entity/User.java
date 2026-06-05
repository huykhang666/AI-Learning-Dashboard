package com.ai.learning.backend.entity;

import com.ai.learning.backend.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "firstname", length = 20)
    private String firstName;

    @Column(name = "lastname", length = 20)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    //User permissions (USER, ADMIN, Premium)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role_name")
    private Set<String> roles;

    @Builder.Default
    private boolean isPremium = false;

    private LocalDateTime premiumExpiredAt;

    @Builder.Default
    private int dailyUploadCount = 0;

    @Builder.Default
    private LocalDate lastUploadDate = LocalDate.now();

    private String paymentCustomerId;

    @Column(name = "provider")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Builder.Default
    @Column(name = "weekly_goal")
    private Integer weeklyGoal = 10; // Đã thêm chữ private cho chuẩn OOP

    //Get time the automatically
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.provider == null) {
            this.provider = "LOCAL";
        }

        if (this.role == null) {
            this.role = UserRole.USER;
        }
    }
}