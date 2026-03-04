package com.ai.learning.backend.entity;

import com.ai.learning.backend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
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

    @Column(name = "firstname",length = 20)
    private String firstName;

    @Column(name = "lastname", length = 20)
    private String lastName;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    //Phân loại tài khoản
    private boolean isPremium = false;

    // Số video đã xử lý trong ngày hôm nay
    private int dailyUploadCount = 0;

    // Ngày cuối cùng thực hiện upload (để biết khi nào cần reset dailyUploadCount về 0)
    private LocalDate lastUploadDate = LocalDate.now();

    //Mã khách hàng trên hệ thống thanh toán nếu cần
    private String paymentCustomerId;

    //Tuần 7 làm
    @Column(name = "provider")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "created_at", updatable = false)
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
