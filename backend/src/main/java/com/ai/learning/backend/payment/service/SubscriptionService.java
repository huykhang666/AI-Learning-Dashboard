package com.ai.learning.backend.payment.service;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.Subscription;

import java.util.Optional;

public interface SubscriptionService {
    void activatePremium(Payment payment);
    Optional<Subscription> getActiveSubscription(Long userId);
    boolean isPremium(Long userId);
    void deactivate(Long userId);
}
