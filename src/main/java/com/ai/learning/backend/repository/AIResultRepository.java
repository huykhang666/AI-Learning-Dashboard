package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.AIResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIResultRepository extends JpaRepository<AIResult,Long> {
}
