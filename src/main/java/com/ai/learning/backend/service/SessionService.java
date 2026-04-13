package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.PageResponse;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.dto.response.SessionListResponse;
import java.util.List;

public interface SessionService {
    SessionListResponse create(SessionRequest request);
    SessionDetailResponse getById(Long id);
    PageResponse<SessionListResponse> listByUser(int page, int size);
    String getStatus(Long id);
    void delete(Long id);
}
