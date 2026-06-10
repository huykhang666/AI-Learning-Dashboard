package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.payment.config.VnPayConfig;
import com.ai.learning.backend.payment.constant.VNPayParams;
import com.ai.learning.backend.payment.constant.VnpIpnResponseConst;
import com.ai.learning.backend.payment.dto.response.IpnResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import com.ai.learning.backend.payment.repository.PaymentRepository;
import com.ai.learning.backend.payment.service.IpnHandlerService;
import com.ai.learning.backend.payment.service.SubscriptionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VNPayIpnHandlerImpl implements IpnHandlerService {

    VnPayConfig vnPayConfig;
    PaymentRepository paymentRepository;
    SubscriptionService subscriptionService;

    @Override
    public IpnResponse handle(Map<String, String> params) {
        String receivedHash = params.get(VNPayParams.SECURE_HASH);
        if(receivedHash == null)
            return new IpnResponse(VnpIpnResponseConst.UNKNOWN_ERROR, "Missing signature");

        params.remove("vnp_SecureHashType");
        params.remove(VNPayParams.SECURE_HASH);

        // Build hash data
        String hashData = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.US_ASCII))
                .collect(Collectors.joining("&"));

        String checkSum = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData);

        if (!checkSum.equals(receivedHash))
            return new IpnResponse(VnpIpnResponseConst.INVALID_CHECKSUM, "Invalid checksum");

        if (!"00".equals(params.get(VNPayParams.RESPONSE_CODE)))
                return new IpnResponse(VnpIpnResponseConst.SUCCESS_CODE, "Transaction failed but IPN received");

        UUID paymentId = UUID.fromString(params.get(VNPayParams.TXN_REF));
        Payment payment = paymentRepository.findById(paymentId)
                .orElse(null);

        if (payment == null)
            return new IpnResponse(VnpIpnResponseConst.ORDER_NOT_FOUND, "Order not found");

        if (!PaymentStatus.PENDING.equals(payment.getStatus()))
            return new IpnResponse(VnpIpnResponseConst.ALREADY_CONFIRMED, "Already confirmed");

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setGatewayTransactionId(params.get(VNPayParams.TRANSACTION_NO));
        paymentRepository.save(payment);

        // Kích hoạt Premium
        subscriptionService.activatePremium(payment);

        return new IpnResponse(VnpIpnResponseConst.SUCCESS_CODE, "Confirm success");
    }
}