package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.response.HistoryResponse;

import java.util.List;

public interface HistoryService {
    List<HistoryResponse> getUserHistory();
}
