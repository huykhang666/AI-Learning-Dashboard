package com.ai.learning.backend.payment.dto.response;

import com.ai.learning.backend.payment.entity.PaymentGateway;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatisticsResponse {
    private long totalRevenue;
    private long successCount;
    private long pendingCount;
    private long failedCount;
    private long cancelledCount;
    private long vnpayRevenue;
    private long momoRevenue;
    private double avgTransactionAmount;
}
