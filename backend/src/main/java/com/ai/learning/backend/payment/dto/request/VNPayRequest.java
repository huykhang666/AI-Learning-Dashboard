package com.ai.learning.backend.payment.dto.request;

public record VNPayRequest(
        Long userId,
        Long amount,
        String planType,
        String ipAddress
) {}