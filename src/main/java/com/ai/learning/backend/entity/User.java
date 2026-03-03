package com.ai.learning.backend.entity;

import com.ai.learning.backend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", unique = true,nullable = false,length = 50)
    private String username;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "fistname",length = 20)
    private String firstName;

    @Column(name = "lastname", length = 20)
    private String lastName;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    //Tuần 7 làm
    @Column(name = "provider_id")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "creat_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    //Get time the automatically
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.provider == null) {
            this.provider = "LOCAL";
        }

        if (this.role == null) {
            this.role = Role.USER;
        }
    }
}
