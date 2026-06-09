package com.ai.learning.backend.payment.dto.request;

public record VNPayRequest(
        Long userId,
        Double amount,
        String planType,
        String ipAddress,
        Long courseId
) {}