package com.ai.learning.backend.payment.dto.request;

import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentFilterRequest {
    private PaymentStatus status;
    private PaymentGateway gateway;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer page;
    private Integer pageSize;
}
