package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.CourseTransaction;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseTransactionRepository {
    Optional<CourseTransaction> findByVnpTxnRef(String vnpTxnRef);
    List<CourseTransaction> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
}
