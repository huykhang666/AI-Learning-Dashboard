package com.ai.learning.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID paymentId;

    private Long userId;
    private Integer amount;
    private String status;
    private String paymentMethod;

    // Các trường khác (gatewayTransactionId, rawResponse, createdAt)
}