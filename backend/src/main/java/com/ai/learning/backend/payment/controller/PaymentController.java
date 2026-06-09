package com.ai.learning.backend.payment.controller;

import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.payment.dto.request.PaymentRequest;
import com.ai.learning.backend.payment.dto.response.IpnResponse;
import com.ai.learning.backend.payment.dto.response.MomoResponse;
import com.ai.learning.backend.payment.dto.response.VNPayResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.service.Impl.*;
import com.ai.learning.backend.payment.repository.PaymentRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.PdfService;
import com.ai.learning.backend.payment.constant.VNPayParams;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentServiceImpl paymentService;
    VNPayIpnHandlerImpl vnPayIpnHandler;
    MomoIpnHandlerImpl momoIpnHandler;
    PaymentRepository paymentRepository;
    PdfService pdfService;
    UserRepository userRepository;

    @lombok.experimental.NonFinal
    @Value("${app.frontend.url:http://localhost:5173}")
    String frontendUrl;

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

    @GetMapping("/vnpay-return")
    public void vnpayReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        try {
            vnPayIpnHandler.handle(params);
            System.out.println("=== [VNPay Return] Đã gọi handler xử lý cập nhật Database thành công ===");
        } catch (Exception e) {
            System.out.println("=== [VNPay Return] Lỗi khi xử lý cập nhật DB: " + e.getMessage() + " ===");
        }

        String code = params.get(VNPayParams.RESPONSE_CODE);
        String redirectUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        if ("00".equals(code)) {
            response.sendRedirect(redirectUrl + "/payment/success");
        } else {
            response.sendRedirect(redirectUrl + "/payment/failed");
        }
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<IpnResponse> vnpayIPN(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(vnPayIpnHandler.handle(params));
    }

    @PostMapping("/momo-ipn")
    public ResponseEntity<IpnResponse> momoIPN(@RequestBody Map<String, String> params) {
        return ResponseEntity.ok(momoIpnHandler.handle(params));
    }

    @GetMapping("/subscriptions/me")
    public ResponseEntity<?> getMySubscription(@AuthenticationPrincipal Jwt jwt) {
        User user = userRepository.findByUsername(jwt.getSubject())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ResponseEntity.ok(paymentService.getMySubscription(user.getEmail()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> getTransactionHistory(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(401).build();
        }
        String username = jwt.getSubject(); // lấy từ "sub" claim
        return ResponseEntity.ok(paymentService.getMyTransactionHistory(username));
    }

    @GetMapping("/invoice/{paymentId}")
    public ResponseEntity<?> downloadInvoice(@PathVariable UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã: " + paymentId));

        ByteArrayInputStream pdfStream = pdfService.exportInvoiceToPdf(payment);

        System.out.println("=== PDF Stream size: " + pdfStream.available() + " bytes ===");

        InputStreamResource resource = new InputStreamResource(pdfStream);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=invoice_" + paymentId.toString().substring(0, 8) + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}