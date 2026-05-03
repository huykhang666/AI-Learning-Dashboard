package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getHistoryByUserId(Long userId);
}
