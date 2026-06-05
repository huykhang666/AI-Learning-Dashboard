package com.ai.learning.backend.payment.repository;

import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.payment.entity.PaymentGateway;
import com.ai.learning.backend.payment.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
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
    List<Payment> findByUser(User user);

    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM payment WHERE status = 'SUCCESS'", nativeQuery = true)
    long sumSuccessfulRevenue();

    Page<Payment> findAll(Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<Payment> findByStatus(@Param("status") PaymentStatus status, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.gateway = :gateway ORDER BY p.createdAt DESC")
    Page<Payment> findByGateway(@Param("gateway") PaymentGateway gateway, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.gateway = :gateway ORDER BY p.createdAt DESC")
    Page<Payment> findByStatusAndGateway(@Param("status") PaymentStatus status, @Param("gateway") PaymentGateway gateway, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate ORDER BY p.createdAt DESC")
    Page<Payment> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS' AND p.gateway = :gateway")
    long sumRevenueByGateway(@Param("gateway") PaymentGateway gateway);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(@Param("status") PaymentStatus status);

    @Query("SELECT COALESCE(AVG(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
    double getAverageTransactionAmount();
}
