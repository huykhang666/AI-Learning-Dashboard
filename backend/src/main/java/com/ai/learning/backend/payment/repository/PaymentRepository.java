package com.ai.learning.backend.payment.repository;

import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,UUID> {
    List<Payment> findByUser_userIdOrderByCreatedAtDesc(Long userId);
    Optional<Payment> findByUser_userIdAndStatus(Long userId, PaymentStatus status);
    Optional<Payment> findByGatewayTransactionId(String gatewayTransactionId);
    List<Payment> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<Payment> findByUser_UsernameOrderByCreatedAtDesc(String username);
}
