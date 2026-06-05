package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.AdminDashboardMetricsResponse;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.payment.dto.response.AdminPaymentResponse;
import com.ai.learning.backend.payment.dto.response.PaymentPageResponse;
import com.ai.learning.backend.payment.dto.response.PaymentStatisticsResponse;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import com.ai.learning.backend.payment.repository.PaymentRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {
    UserRepository userRepository;
    SessionRepository sessionRepository;
    PaymentRepository paymentRepository;

    @GetMapping("/dashboard/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminDashboardMetricsResponse> getDashboardMetrics() {
        long totalUsers = userRepository.count();
        long totalSessions = sessionRepository.count();
        long totalRevenue = paymentRepository.sumSuccessfulRevenue();

        return ApiResponse.<AdminDashboardMetricsResponse>builder()
                .code(1000)
                .result(AdminDashboardMetricsResponse.builder()
                        .totalUsers(totalUsers)
                        .totalSessions(totalSessions)
                        .totalRevenue(totalRevenue)
                        .build())
                .build();
    }

    @GetMapping("/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<AdminPaymentResponse>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        
        List<AdminPaymentResponse> paymentResponses = payments.stream()
                .map(payment -> AdminPaymentResponse.builder()
                        .id(payment.getPaymentId())
                        .userName(payment.getUser().getUsername())
                        .userEmail(payment.getUser().getEmail())
                        .amount(payment.getAmount())
                        .gateway(payment.getGateway())
                        .status(payment.getStatus())
                        .gatewayTransactionId(payment.getGatewayTransactionId())
                        .orderInfo(payment.getOrderInfo())
                        .createdAt(payment.getCreatedAt())
                        .updatedAt(payment.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
        
        return ApiResponse.<List<AdminPaymentResponse>>builder()
                .code(1000)
                .result(paymentResponses)
                .build();
    }

    @GetMapping("/payments/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentPageResponse<AdminPaymentResponse>> getPaymentsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentGateway gateway) {
        
        Pageable pageable = PageRequest.of(page, pageSize);
        Page<Payment> paymentPage;
        
        if (status != null && gateway != null) {
            paymentPage = paymentRepository.findByStatusAndGateway(status, gateway, pageable);
        } else if (status != null) {
            paymentPage = paymentRepository.findByStatus(status, pageable);
        } else if (gateway != null) {
            paymentPage = paymentRepository.findByGateway(gateway, pageable);
        } else {
            paymentPage = paymentRepository.findAll(pageable);
        }

        List<AdminPaymentResponse> content = paymentPage.getContent().stream()
                .map(payment -> AdminPaymentResponse.builder()
                        .id(payment.getPaymentId())
                        .userName(payment.getUser().getUsername())
                        .userEmail(payment.getUser().getEmail())
                        .amount(payment.getAmount())
                        .gateway(payment.getGateway())
                        .status(payment.getStatus())
                        .gatewayTransactionId(payment.getGatewayTransactionId())
                        .orderInfo(payment.getOrderInfo())
                        .createdAt(payment.getCreatedAt())
                        .updatedAt(payment.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        PaymentPageResponse<AdminPaymentResponse> response = PaymentPageResponse.<AdminPaymentResponse>builder()
                .content(content)
                .pageNumber(paymentPage.getNumber())
                .pageSize(paymentPage.getSize())
                .totalElements(paymentPage.getTotalElements())
                .totalPages(paymentPage.getTotalPages())
                .hasNext(paymentPage.hasNext())
                .hasPrevious(paymentPage.hasPrevious())
                .build();

        return ApiResponse.<PaymentPageResponse<AdminPaymentResponse>>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @DeleteMapping("/payments/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deletePayment(@PathVariable String paymentId) {
        try {
            paymentRepository.deleteById(java.util.UUID.fromString(paymentId));
            return ApiResponse.<String>builder()
                    .code(1000)
                    .result("Payment deleted successfully")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .code(9999)
                    .result("Failed to delete payment: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/payments/statistics/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentStatisticsResponse> getPaymentStatistics() {
        long totalRevenue = paymentRepository.sumSuccessfulRevenue();
        long successCount = paymentRepository.countByStatus(PaymentStatus.SUCCESS);
        long pendingCount = paymentRepository.countByStatus(PaymentStatus.PENDING);
        long failedCount = paymentRepository.countByStatus(PaymentStatus.FAILED);
        long cancelledCount = paymentRepository.countByStatus(PaymentStatus.CANCELLED);
        long vnpayRevenue = paymentRepository.sumRevenueByGateway(PaymentGateway.VNPAY);
        long momoRevenue = paymentRepository.sumRevenueByGateway(PaymentGateway.MOMO);
        double avgAmount = paymentRepository.getAverageTransactionAmount();

        PaymentStatisticsResponse response = PaymentStatisticsResponse.builder()
                .totalRevenue(totalRevenue)
                .successCount(successCount)
                .pendingCount(pendingCount)
                .failedCount(failedCount)
                .cancelledCount(cancelledCount)
                .vnpayRevenue(vnpayRevenue)
                .momoRevenue(momoRevenue)
                .avgTransactionAmount(avgAmount)
                .build();

        return ApiResponse.<PaymentStatisticsResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }
}