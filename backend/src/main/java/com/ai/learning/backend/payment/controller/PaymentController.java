package com.ai.learning.backend.payment.controller;

import com.ai.learning.backend.payment.dto.request.PaymentRequest;
import com.ai.learning.backend.payment.dto.response.IpnResponse;
import com.ai.learning.backend.payment.dto.response.MomoResponse;
import com.ai.learning.backend.payment.dto.response.VNPayResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.service.Impl.*;
import com.ai.learning.backend.payment.repository.PaymentRepository;
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
    public void vnpayReturn(
            @RequestParam Map<String, String> params,
            HttpServletResponse response) throws IOException {

        String code = params.get(VNPayParams.RESPONSE_CODE);
        response.sendRedirect("00".equals(code)
                ? "http://localhost:3000/payment/success"
                : "http://localhost:3000/payment/failed");
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
    public ResponseEntity<?> getMySubscription(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(paymentService.getMySubscription(userDetails.getUsername()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> getTransactionHistory() {
        return ResponseEntity.ok(paymentService.getMyTransactionHistory());
    }

    @GetMapping("/invoice/{paymentId}")
    public ResponseEntity<?> downloadInvoice(@PathVariable UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã: " + paymentId));

        ByteArrayInputStream pdfStream = pdfService.exportInvoiceToPdf(payment);
        InputStreamResource resource = new InputStreamResource(pdfStream);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=invoice_" + paymentId.toString().substring(0, 8) + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}