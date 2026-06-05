package com.ai.learning.backend.payment.dto.response;

import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentResponse {
    private UUID id;
    private String userName;
    private String userEmail;
    private Long amount;
    private PaymentGateway gateway;
    private PaymentStatus status;
    private String gatewayTransactionId;
    private String orderInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
