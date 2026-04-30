package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.UserProgressRequest;
import com.ai.learning.backend.dto.response.UserProgressResponse;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.entity.UserProgress;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.UserProgressMapper;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.UserProgressRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.UserProgressService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserProgressServiceImpl implements UserProgressService {
    UserProgressRepository repository;
    UserProgressMapper mapper;
    UserRepository userRepository;
    SessionRepository sessionRepository;

    @Override
    @Transactional
    public UserProgressResponse updateProgress(String username, UserProgressRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserProgress progress = repository
                .findByUser_UserIdAndSession_LearningSessionId(user.getUserId(), request.getSessionId())
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress();
                    newProgress.setUser(user);
                    newProgress.setSession(sessionRepository.findById(request.getSessionId())
                            .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND)));
                    newProgress.setTimeSpent(0L);
                    newProgress.setLastWatchedSecond(0);
                    newProgress.setCompletionRate(0.0);
                    newProgress.setCompleted(false);
                    return newProgress;
                });

        Integer current = request.getCurrentSecond();
        Integer last = progress.getLastWatchedSecond();

        if (current != null) {
            progress.setLastWatchedSecond(current);
        }

        long delta = 0;
        if (last != null && current != null && current > last) {
            delta = current - last;
        }

        long updatedTimeSpent = (progress.getTimeSpent() == null ? 0 : progress.getTimeSpent()) + delta;
        progress.setTimeSpent(updatedTimeSpent);

        Integer duration = progress.getSession().getDuration();
        if (duration != null && duration > 0 && current != null) {
            double rate = ((double) current / duration) * 100;
            progress.setCompletionRate(Math.min(rate, 100.0));

            if (rate >= 70) {
                progress.setCompleted(true);
            }
        }

        return mapper.toResponse(repository.save(progress));
    }
}
