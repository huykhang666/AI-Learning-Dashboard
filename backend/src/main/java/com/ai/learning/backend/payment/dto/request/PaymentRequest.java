package com.ai.learning.backend.payment.dto.request;

import com.ai.learning.backend.payment.entity.PaymentGateway;

public record PaymentRequest(
        Long userId,
        Long amount,
        String planType,
        PaymentGateway gateway
) {}