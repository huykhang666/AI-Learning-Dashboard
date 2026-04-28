package com.ai.learning.backend.payment.controller;

import com.ai.learning.backend.payment.dto.request.PaymentRequest;
import com.ai.learning.backend.payment.dto.response.IpnResponse;
import com.ai.learning.backend.payment.dto.response.MomoResponse;
import com.ai.learning.backend.payment.dto.response.VNPayResponse;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.service.Impl.*;
import com.ai.learning.backend.payment.constant.VNPayParams;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class PaymentController {

    PaymentServiceImpl paymentService;
    VNPayIpnHandlerImpl vnPayIpnHandler;
    MomoIpnHandlerImpl momoIpnHandler;

    // Tạo URL thanh toán — FE gửi lên gateway (VNPAY hoặc MOMO)
    @PostMapping("/create-url")
    public ResponseEntity<?> createPaymentUrl(
            @RequestBody PaymentRequest request,
            HttpServletRequest httpRequest) {

        if (request.gateway() == PaymentGateway.MOMO) {
            MomoResponse response = paymentService.initiateMoMo(request);
            return ResponseEntity.ok(response);
        }

        VNPayResponse response = paymentService.initiateVNPay(request, httpRequest);
        return ResponseEntity.ok(response);
    }

    // VNPay redirect trình duyệt về đây sau khi thanh toán xong
    @GetMapping("/vnpay-return")
    public void vnpayReturn(
            @RequestParam Map<String, String> params,
            HttpServletResponse response) throws IOException {

        String code = params.get(VNPayParams.RESPONSE_CODE);
        response.sendRedirect("00".equals(code)
                ? "http://localhost:3000/payment/success"
                : "http://localhost:3000/payment/failed");
    }

    // VNPay gọi server-to-server để xác nhận giao dịch
    @GetMapping("/vnpay-ipn")
    public ResponseEntity<IpnResponse> vnpayIPN(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(vnPayIpnHandler.handle(params));
    }

    // MoMo gọi server-to-server để xác nhận giao dịch
    @PostMapping("/momo-ipn")
    public ResponseEntity<IpnResponse> momoIPN(@RequestBody Map<String, String> params) {
        return ResponseEntity.ok(momoIpnHandler.handle(params));
    }

    @GetMapping("/subscriptions/me") 
    public ResponseEntity<?> getMySubscription(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(paymentService.getMySubscription(userDetails.getUsername()));
    }
}