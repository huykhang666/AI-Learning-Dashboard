package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.dto.response.SessionListResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.SessionMapper;
import com.ai.learning.backend.repository.AIResultRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.SessionService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionServiceImpl implements SessionService {
    final SessionRepository sessionRepository;
    final AIResultRepository aiResultRepository;
    final SessionMapper sessionMapper;
    final UserRepository userRepository;

    @Override
    @Transactional
    public SessionListResponse create(SessionRequest request) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        LearningSession session = sessionMapper.toEntity(request);
        session.setUser(user);
        session.setStatus(SessionStatus.PENDING);

        return  sessionMapper.toListResponse(sessionRepository.save(session));
    }

    @Override
    public SessionDetailResponse getById(Long id) {
        LearningSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AIResult aiResult = aiResultRepository.findByLearningSession_LearningSessionId(id)
                .orElse(null);
        return sessionMapper.toDetailResponse(session, aiResult);
    }

    @Override
    public List<SessionListResponse> listByUser() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return sessionRepository.findByUserOrderByCreatedAtDesc(username)
                .stream()
                .map(sessionMapper::toListResponse)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if(!sessionRepository.existsById(id)) {
            throw new AppException(ErrorCode.LESSON_NOT_EXISTED);
        }
        sessionRepository.deleteById(id);
    }

}
