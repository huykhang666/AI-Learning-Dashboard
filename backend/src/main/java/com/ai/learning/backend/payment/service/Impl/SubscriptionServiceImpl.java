package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.entity.CourseTransaction;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.Subscription;
import com.ai.learning.backend.payment.repository.SubscriptionRepository;
import com.ai.learning.backend.payment.service.SubscriptionService;
import com.ai.learning.backend.repository.CourseTransactionRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.EnrollmentService;
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
    CourseTransactionRepository courseTransactionRepository;
    EnrollmentService enrollmentService;
    SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void activatePremium(Payment payment) {
        User user = payment.getUser();

        if (payment.getPlanType() == Subscription.PlanType.COURSE) {
            activateCoursePurchase(payment, user);
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = payment.getPlanType() == Subscription.PlanType.PREMIUM_YEARLY
                ? now.plusYears(1)
                : now.plusMonths(1);

        subScriptionRepository.findByUser_userIdAndActiveTrue(user.getUserId())
                .ifPresent((Subscription old) -> {
                    old.setActive(false);
                    subScriptionRepository.save(old);
                });

        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(payment.getPlanType())
                .startDate(now)
                .endDate(endDate)
                .active(true)
                .payment(payment)
                .build();
        subScriptionRepository.save(subscription);

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

    private void activateCoursePurchase(Payment payment, User user) {
        if (payment.getCourse() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Long userId = user.getUserId();
        Long courseId = payment.getCourse().getCourseId();

        if (!courseTransactionRepository.existsByUserUserIdAndCourseCourseIdAndStatus(
                userId, courseId, "COMPLETED")) {
            CourseTransaction transaction = CourseTransaction.builder()
                    .user(user)
                    .course(payment.getCourse())
                    .amount(payment.getAmount().doubleValue())
                    .status("COMPLETED")
                    .vnpTxnRef(payment.getPaymentId().toString())
                    .build();
            courseTransactionRepository.save(transaction);
        }

        enrollmentService.enrollCourse(userId, courseId);

        try {
            String destination = "/topic/notifications/" + user.getUserId();
            Map<String, Object> payload = Map.of(
                    "type", "COURSE_PURCHASE_SUCCESS",
                    "message", "Chúc mừng! Bạn đã mở khóa khóa học thành công.",
                    "courseId", courseId
            );
            messagingTemplate.convertAndSend(destination, payload);
        } catch (Exception e) {
            System.err.println("Lỗi bắn WebSocket thông báo mua khóa học thất bại: " + e.getMessage());
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
