package com.ai.learning.backend.payment.controller;

import com.ai.learning.backend.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Sử dụng Java Record để định nghĩa nhanh dữ liệu Frontend gửi lên (cho Java 14+)
    public record PaymentRequest(Long userId, Integer amount) {}

    @PostMapping("/create-url")
    public ResponseEntity<Map<String, String>> createPaymentUrl(
            @RequestBody PaymentRequest requestBody,
            HttpServletRequest request) {

        try {
            // 1. Gọi Service để sinh ra URL thanh toán VNPay
            String paymentUrl = paymentService.createPaymentUrl(
                    requestBody.userId(),
                    requestBody.amount(),
                    request
            );

            // 2. Đóng gói kết quả thành JSON trả về cho Frontend
            Map<String, String> response = new HashMap<>();
            response.put("code", "00");
            response.put("message", "Tạo URL thành công");
            response.put("paymentUrl", paymentUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("code", "99");
            errorResponse.put("message", "Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> vnpayIPN(@RequestParam Map<String, String> params) {
        // Chuyển toàn bộ dữ liệu VNPay gửi về sang Service xử lý
        Map<String, String> response = paymentService.processIpn(params);
        return ResponseEntity.ok(response);
    }
}
