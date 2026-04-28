package com.ai.learning.backend.payment.dto.response;

public record MomoResponse(
        String payUrl,
        String oderId,
        String message,
        int resultCode
) {
}
