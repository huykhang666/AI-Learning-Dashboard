package com.ai.learning.backend.payment.service.Impl;

import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.payment.config.MoMoConfig;
import com.ai.learning.backend.payment.constant.MomoParams;
import com.ai.learning.backend.payment.dto.request.MomoRequest;
import com.ai.learning.backend.payment.dto.response.MomoResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import com.ai.learning.backend.payment.entity.Subscription;
import com.ai.learning.backend.payment.repository.PaymentRepository;
import com.ai.learning.backend.payment.service.MomoService;
import com.ai.learning.backend.repository.CourseRepository;
import com.ai.learning.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MomoServiceImpl implements MomoService {
    MoMoConfig moMoConfig;
    PaymentRepository paymentRepository;
    UserRepository userRepository;
    CourseRepository courseRepository;
    @Override
    @Transactional
    public MomoResponse createPayment(MomoRequest request) {
        try {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            Course course = null;
            String orderInfo = "Thanh toan goi " + request.planType();
            if (request.courseId() != null) {
                course = courseRepository.findById(request.courseId())
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
                orderInfo = "Thanh toan khoa hoc: " + course.getTitle();
            }

            Payment payment = Payment.builder()
                    .amount(request.amount())
                    .user(user)
                    .status(PaymentStatus.PENDING)
                    .gateway(PaymentGateway.MOMO)
                    .planType(Subscription.PlanType.valueOf(request.planType()))
                    .course(course)
                    .orderInfo(orderInfo)
                    .build();

            Payment savedPayment = paymentRepository.save(payment);
            String orderId  = savedPayment.getPaymentId().toString();
            String requestId = UUID.randomUUID().toString();

            // 2. Build raw signature
            String rawSignature = "accessKey=" + moMoConfig.getAccessKey()
                    + "&amount=" + request.amount()
                    + "&extraData="
                    + "&ipnUrl=" + moMoConfig.getNotifyUrl()
                    + "&orderId=" + orderId
                    + "&orderInfo=" + savedPayment.getOrderInfo()
                    + "&partnerCode=" + moMoConfig.getPartnerCode()
                    + "&redirectUrl=" + moMoConfig.getReturnUrl()
                    + "&requestId=" + requestId
                    + "&requestType=payWithATM";

            String signature = moMoConfig.hmacSHA256(rawSignature);

            // 3. Build request body gửi MoMo
            Map<String, Object> body = new HashMap<>();
            body.put(MomoParams.PARTNER_CODE, moMoConfig.getPartnerCode());
            body.put(MomoParams.REQUEST_ID,   requestId);
            body.put(MomoParams.AMOUNT,       request.amount());
            body.put(MomoParams.ORDER_ID,     orderId);
            body.put(MomoParams.ORDER_INFO,   savedPayment.getOrderInfo());
            body.put(MomoParams.REDIRECT_URL, moMoConfig.getReturnUrl());
            body.put(MomoParams.IPN_URL,      moMoConfig.getNotifyUrl());
            body.put(MomoParams.REQUEST_TYPE, "payWithATM");
            body.put(MomoParams.SIGNATURE,    signature);
            body.put(MomoParams.LANG,         "vi");
            body.put("extraData",             "");

            // 4. Gọi MoMo API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            RestTemplate restTemplate = new RestTemplate();
            Map momoResult = restTemplate.postForObject(
                    moMoConfig.getEndpoint(),
                    new HttpEntity<>(body, headers),
                    Map.class
            );

            if (momoResult == null)
                return new MomoResponse(null, orderId, "Không nhận được phản hồi từ MoMo", 99);

            int resultCode = (int) momoResult.get(MomoParams.RESULT_CODE);
            String payUrl  = (String) momoResult.get("payUrl");
            String message = (String) momoResult.get("message");

            return new MomoResponse(payUrl, orderId, message, resultCode);

        } catch (Exception e) {
            return new MomoResponse(null, null, "Lỗi hệ thống: " + e.getMessage(), 99);
        }
    }
}
