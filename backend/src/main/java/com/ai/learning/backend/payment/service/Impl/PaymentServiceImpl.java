package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.payment.dto.request.MomoRequest;
import com.ai.learning.backend.payment.dto.request.PaymentRequest;
import com.ai.learning.backend.payment.dto.request.VNPayRequest;
import com.ai.learning.backend.payment.dto.response.MomoResponse;
import com.ai.learning.backend.payment.dto.response.SubscriptionResponse;
import com.ai.learning.backend.payment.dto.response.VNPayResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.repository.PaymentRepository;
import com.ai.learning.backend.payment.repository.SubscriptionRepository;
import com.ai.learning.backend.payment.service.MomoService;
import com.ai.learning.backend.payment.service.PaymentService;
import com.ai.learning.backend.payment.service.SubscriptionService;
import com.ai.learning.backend.payment.service.VNPayService;
import com.ai.learning.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentServiceImpl implements PaymentService {
    VNPayService vnPayService;
    MomoService momoService;
    SubscriptionService subscriptionService;
    SubscriptionRepository subscriptionRepository;
    PaymentRepository paymentRepository;
    UserRepository userRepository;
    @Override
    public VNPayResponse initiateVNPay(PaymentRequest request, HttpServletRequest httpRequest) {
        try {
            VNPayRequest vnPayRequest = new VNPayRequest(
                    request.userId(),
                    request.amount(),
                    request.planType(),
                    null,
                    request.courseId()
            );
            String paymentUrl = vnPayService.createPaymentUrl(vnPayRequest, httpRequest);
            return new VNPayResponse("00", "Tạo URL thành công", paymentUrl);

        } catch (Exception e) {
            return new VNPayResponse("9999", "System error: " + e.getMessage(), null);
        }
    }

    @Override
    public MomoResponse initiateMoMo(PaymentRequest request) {
        try {
            MomoRequest moMoRequest = new MomoRequest(
                    request.userId(),
                    request.amount(),
                    request.planType(),
                    request.courseId()
            );
            return momoService.createPayment(moMoRequest);

        } catch (Exception e) {
            return new MomoResponse(null, null, "Lỗi hệ thống: " + e.getMessage(), 99);
        }
    }

    @Override
    public SubscriptionResponse getMySubscription(String email) {
        return subscriptionRepository.findByUser_EmailAndActiveTrue(email)
                .map(sub -> new SubscriptionResponse(
                        sub.getPlan().name(),
                        sub.getStartDate(),
                        sub.getEndDate(),
                        sub.isActive(),
                        subscriptionService.isPremium(sub.getUser().getUserId())
                ))
                .orElse(new SubscriptionResponse("FREE", null, null, false, false));
    }

    @Override
    public List<Payment> getMyTransactionHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return paymentRepository.findByUser(user);
    }
}