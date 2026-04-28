package com.ai.learning.backend.payment.dto.response;

public record IpnResponse(
        String respCode,
        String message
) {
}
