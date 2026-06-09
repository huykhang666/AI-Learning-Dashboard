package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.payment.config.VnPayConfig;
import com.ai.learning.backend.payment.constant.VNPayParams;
import com.ai.learning.backend.payment.constant.VnpIpnResponseConst;
import com.ai.learning.backend.payment.dto.request.VNPayRequest;
import com.ai.learning.backend.payment.dto.response.IpnResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import com.ai.learning.backend.payment.entity.Subscription;
import com.ai.learning.backend.payment.repository.PaymentRepository;
import com.ai.learning.backend.payment.service.SubscriptionService;
import com.ai.learning.backend.payment.service.VNPayService;
import com.ai.learning.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VNPayServiceImpl implements VNPayService {

    VnPayConfig vnPayConfig;
    PaymentRepository paymentRepository;
    SubscriptionService subscriptionService;
    UserRepository userRepository;

    @Override
    @Transactional
    public String createPaymentUrl(VNPayRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Payment newPayment = Payment.builder()
                .amount((long) request.amount())
                .user(user)
                .status(PaymentStatus.PENDING)
                .gateway(PaymentGateway.VNPAY)
                .planType(Subscription.PlanType.valueOf(request.planType()))
                .orderInfo("Thanh toan goi " + request.planType())
                .build();

        Payment savedPayment = paymentRepository.save(newPayment);
        String txnRef = savedPayment.getPaymentId().toString();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put(VNPayParams.VERSION,    vnPayConfig.vnp_Version);
        vnpParams.put(VNPayParams.COMMAND,    vnPayConfig.vnp_Command);
        vnpParams.put(VNPayParams.TMN_CODE,   vnPayConfig.getVnp_TmnCode());
        vnpParams.put(VNPayParams.AMOUNT,     String.valueOf(request.amount() * 100));
        vnpParams.put(VNPayParams.CURR_CODE,  "VND");
        vnpParams.put(VNPayParams.TXN_REF,    txnRef);
        vnpParams.put(VNPayParams.ORDER_INFO, "Thanh toan don hang: " + txnRef);
        vnpParams.put(VNPayParams.ORDER_TYPE, "other");
        vnpParams.put(VNPayParams.LOCALE,     "vn");
        vnpParams.put(VNPayParams.RETURN_URL, vnPayConfig.getVnp_ReturnUrl());
        vnpParams.put(VNPayParams.IP_ADDR,    vnPayConfig.getIpAddress(httpRequest));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        vnpParams.put(VNPayParams.CREATE_DATE, formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnpParams.put(VNPayParams.EXPIRE_DATE, formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query    = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName  = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8);
                hashData.append(fieldName).append('=').append(encodedValue);
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append('=').append(encodedValue);
                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String secureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        return vnPayConfig.getVnp_PayUrl() + "?" + query + "&" + VNPayParams.SECURE_HASH + "=" + secureHash;
    }

    @Override
    @Transactional
    public IpnResponse processIpn(Map<String, String> params) {

        String receivedHash = params.get(VNPayParams.SECURE_HASH);
        if (receivedHash == null)
            return new IpnResponse(VnpIpnResponseConst.UNKNOWN_ERROR, "Missing signature");

        params.remove("vnp_SecureHashType");
        params.remove(VNPayParams.SECURE_HASH);


        String hashData = params.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        String checkSum = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData);

        if (!checkSum.equals(receivedHash))
            return new IpnResponse(VnpIpnResponseConst.INVALID_CHECKSUM, "Invalid checksum");

        if (!"00".equals(params.get(VNPayParams.RESPONSE_CODE))) {
            return new IpnResponse(VnpIpnResponseConst.SUCCESS_CODE, "Transaction failed but IPN received");
        }

        UUID paymentId;
        try {
            paymentId = UUID.fromString(params.get(VNPayParams.TXN_REF));
        } catch (IllegalArgumentException e) {
            return new IpnResponse(VnpIpnResponseConst.ORDER_NOT_FOUND, "Invalid order ID");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElse(null);

        if (payment == null)
            return new IpnResponse(VnpIpnResponseConst.ORDER_NOT_FOUND, "Order not found");

        if (!PaymentStatus.PENDING.equals(payment.getStatus()))
            return new IpnResponse(VnpIpnResponseConst.ALREADY_CONFIRMED, "Order already confirmed");

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setGatewayTransactionId(params.get(VNPayParams.TRANSACTION_NO));
        paymentRepository.save(payment);

        subscriptionService.activatePremium(payment);

        return new IpnResponse(VnpIpnResponseConst.SUCCESS_CODE, "Confirm success");
    }
}