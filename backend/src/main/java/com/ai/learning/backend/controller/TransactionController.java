package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.TransactionResponse;
import com.ai.learning.backend.service.TransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@PreAuthorize("hasRole('USER')")
@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TransactionController {
    TransactionService transactionService;

    @PreAuthorize("hasRole('USER') and #userId.toString() == authentication.name")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponse>> getHistoryByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getHistoryByUserId(userId));
    }
}