package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.HistoryResponse;
import com.ai.learning.backend.entity.UserProgress;
import com.ai.learning.backend.mapper.HistoryMapper;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.UserProgressRepository;
import com.ai.learning.backend.service.HistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HistoryServiceImpl implements HistoryService {
    SessionRepository sessionRepository;
    HistoryMapper historyMapper;
    UserProgressRepository userProgressRepository;
    @Override
    public List<HistoryResponse> getUserHistory() {
        var sessions = sessionRepository.findAll();

        return sessions.stream()
                .map(session -> {
                    UserProgress progress = userProgressRepository
                            .findBySession(session)
                            .orElse(null);

                    return historyMapper.toHistoryResponse(session, progress);
                })
                .toList();
    }
}
