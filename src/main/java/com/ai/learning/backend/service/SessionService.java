package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.dto.response.SessionListResponse;
import java.util.List;

public interface SessionService {
    SessionListResponse create(SessionRequest request);
    SessionDetailResponse getById(Long id);
    List<SessionListResponse> listByUser();
    void delete(Long id);
}
