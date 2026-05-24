package com.ai.learning.backend.payment.service;

import com.ai.learning.backend.payment.dto.request.PaymentRequest;
import com.ai.learning.backend.payment.dto.response.MomoResponse;
import com.ai.learning.backend.payment.dto.response.VNPayResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.Subscription;
import com.ai.learning.backend.payment.service.Impl.PaymentServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import com.ai.learning.backend.payment.dto.response.SubscriptionResponse;

import java.util.List;
import java.util.Optional;

public interface PaymentService {
    VNPayResponse initiateVNPay(PaymentRequest request, HttpServletRequest httpRequest);
    MomoResponse initiateMoMo(PaymentRequest request);
    SubscriptionResponse getMySubscription(String email);
    List<Payment> getMyTransactionHistory(String username);
}