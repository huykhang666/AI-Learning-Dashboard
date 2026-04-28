package com.ai.learning.backend.payment.dto.response;

public record VNPayResponse(
        String code,
        String message,
        String paymentUrl
) { }
