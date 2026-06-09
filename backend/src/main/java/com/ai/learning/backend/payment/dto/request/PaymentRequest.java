package com.ai.learning.backend.payment.dto.request;

import com.ai.learning.backend.payment.entity.PaymentGateway;

public record PaymentRequest(
        Long userId,
        Double amount,
        String planType,
        PaymentGateway gateway,
        Long courseId
) {}