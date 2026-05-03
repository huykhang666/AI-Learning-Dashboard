package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.TransactionResponse;
import com.ai.learning.backend.mapper.TransactionMapper;
import com.ai.learning.backend.repository.CourseTransactionRepository;
import com.ai.learning.backend.service.TransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TransactionServiceImpl implements TransactionService {
    CourseTransactionRepository transactionRepository;
    TransactionMapper transactionMapper;

    @Override
    public List<TransactionResponse> getHistoryByUserId(Long userId) {
        var transactions = transactionRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        return transactionMapper.toTransactionResponseList(transactions);
    }
}