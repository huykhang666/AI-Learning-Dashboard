package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.Subscription;
import com.ai.learning.backend.payment.repository.SubscriptionRepository;
import com.ai.learning.backend.payment.service.SubscriptionService;
import com.ai.learning.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriptionServiceImpl implements SubscriptionService {
    SubscriptionRepository subScriptionRepository;
    UserRepository userRepository;
    SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void activatePremium(Payment payment) {
        User user = payment.getUser();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = payment.getPlanType() == Subscription.PlanType.PREMIUM_YEARLY
                ? now.plusYears(1)
                : now.plusMonths(1);

        subScriptionRepository.findByUser_userIdAndActiveTrue(user.getUserId())
                .ifPresent((Subscription old) -> {
                    old.setActive(false);
                    subScriptionRepository.save(old);
                });

        // Tạo subscription mới
        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(payment.getPlanType())
                .startDate(now)
                .endDate(endDate)
                .active(true)
                .payment(payment)
                .build();
        subScriptionRepository.save(subscription);

        // Cập nhật User
        user.setPremium(true);
        user.setPremiumExpiredAt(endDate);
        userRepository.save(user);

        try {
            String destination = "/topic/notifications/" + user.getUserId();
            Map<String, Object> payload = Map.of(
                    "type", "PREMIUM_UPGRADE_SUCCESS",
                    "message", "Chúc mừng bạn! Hệ thống đã kích hoạt gói Premium thành công.",
                    "currentUploadCount", 0
            );

            messagingTemplate.convertAndSend(destination, payload);
            System.out.println("======> Đã bắn thành công sự kiện PREMIUM_UPGRADE_SUCCESS qua WebSocket tới user: " + user.getUserId());
        } catch (Exception e) {
            System.err.println("Lỗi bắn WebSocket thông báo nâng cấp Premium thất bại: " + e.getMessage());
        }
    }

    @Override
    public Optional<Subscription> getActiveSubscription(Long userId) {
        return subScriptionRepository.findByUser_userIdAndActiveTrue(userId);
    }

    @Override
    public boolean isPremium(Long userId) {
        return subScriptionRepository
                .existsByUser_userIdAndActiveTrueAndEndDateAfter(userId, LocalDateTime.now());
    }

    @Override
    @Transactional
    public void deactivate(Long userId) {
        subScriptionRepository.findByUser_userIdAndActiveTrue(userId)
                .ifPresent(sub -> {
                    sub.setActive(false);
                    subScriptionRepository.save(sub);
                    User user = sub.getUser();
                    user.setPremium(false);
                    user.setPremiumExpiredAt(null);
                    userRepository.save(user);
                });
    }
}
