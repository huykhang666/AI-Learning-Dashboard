package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.payment.config.MoMoConfig;
import com.ai.learning.backend.payment.constant.MomoIpnResponseConst;
import com.ai.learning.backend.payment.constant.MomoParams;
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

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MomoIpnHandlerImpl implements IpnHandlerService {
    MoMoConfig moMoConfig;
    PaymentRepository paymentRepository;
    SubscriptionService subscriptionService;
    @Override
    public IpnResponse handle(Map<String, String> params) {
        String rawSignature = "accessKey=" + moMoConfig.getAccessKey()
                + "&amount=" + params.get(MomoParams.AMOUNT)
                + "&orderId=" + params.get(MomoParams.ORDER_ID)
                + "&partnerCode=" + moMoConfig.getPartnerCode()
                + "&requestId=" + params.get(MomoParams.REQUEST_ID)
                + "&resultCode=" + params.get(MomoParams.RESULT_CODE);

        try {
            String checkSig = moMoConfig.hmacSHA256(rawSignature);
            if (!checkSig.equals(params.get(MomoParams.SIGNATURE)))
                return new IpnResponse(String.valueOf(MomoIpnResponseConst.INVALID_SIG), "Invalid signature");
        } catch (Exception e) {
            return new IpnResponse(String.valueOf(MomoIpnResponseConst.UNKNOWN_ERROR), "Signature error");
        }

        if (!"0".equals(params.get(MomoParams.RESULT_CODE)))
            return new IpnResponse(String.valueOf(MomoIpnResponseConst.SUCCESS), "Transaction failed but received");

        UUID paymentId = UUID.fromString(params.get(MomoParams.ORDER_ID));
        Payment payment = paymentRepository.findById(paymentId).orElse(null);

        if (payment == null)
            return new IpnResponse(String.valueOf(MomoIpnResponseConst.ORDER_NOT_FOUND), "Order not found");

        if (!PaymentStatus.PENDING.equals(payment.getStatus()))
            return new IpnResponse(String.valueOf(MomoIpnResponseConst.ALREADY_UPDATED), "Already updated");

        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);
        subscriptionService.activatePremium(payment);

        return new IpnResponse(String.valueOf(MomoIpnResponseConst.SUCCESS), "Success");
    }
}
