package com.ai.learning.backend.payment.dto.response;

import java.time.LocalDateTime;

public record SubscriptionResponse(
        String plan,           // FREE, PREMIUM_MONTHLY, PREMIUM_YEARLY
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active,
        boolean isPremium
) {
}
