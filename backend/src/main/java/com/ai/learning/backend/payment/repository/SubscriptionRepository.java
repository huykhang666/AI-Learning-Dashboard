package com.ai.learning.backend.payment.repository;

import com.ai.learning.backend.payment.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByUser_userIdAndActiveTrue(Long userId);
    List<Subscription> findByUser_userIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUser_userIdAndActiveTrueAndEndDateAfter(Long userId, LocalDateTime now);
    Optional<Subscription> findByUser_EmailAndActiveTrue(String email);


}
