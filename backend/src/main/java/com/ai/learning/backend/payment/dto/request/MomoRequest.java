package com.ai.learning.backend.payment.dto.request;

public record MomoRequest(
        Long userId,
        Long amount,
        String planType,
        Long courseId
) {}
