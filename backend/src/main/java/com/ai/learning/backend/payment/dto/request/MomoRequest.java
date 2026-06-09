package com.ai.learning.backend.payment.dto.request;

public record MomoRequest(
        Long userId,
        Double amount,
        String planType,
        Long courseId
) {}
