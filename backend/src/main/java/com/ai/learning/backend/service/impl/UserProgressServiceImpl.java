package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.UserProgressRequest;
import com.ai.learning.backend.dto.response.UserProgressResponse;
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
    public UserProgressResponse updateProgress(Long userId, UserProgressRequest request) {
        // Tìm bản ghi cũ, nếu không có thì khởi tạo một đối tượng mới hoàn toàn
        UserProgress progress = repository.findByUser_UserIdAndSession_LearningSessionId(userId,request.getSessionId())
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress();
                    newProgress.setUser(userRepository.findById(userId)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));

                    newProgress.setSession(sessionRepository.findById(request.getSessionId())
                            .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND)));
                    newProgress.setTimeSpent(0L);
                    return  newProgress;
                });
        //Cập nhật dữ liệu
        progress.setLastWatchedSecond(request.getCurrentSecond());

        //Cộng dồn thời gian học
        long updatedTimeSpent = (progress.getTimeSpent() != null ? progress.getTimeSpent() : 0)
                + request.getAdditionalTime();
        progress.setTimeSpent(updatedTimeSpent);

        //Tính toán tiến độ
        Integer duration = progress.getSession().getDuration();
        if(duration != null && duration > 0) {
            double rate = ((double) request.getCurrentSecond() / duration) * 100;
            progress.setCompletionRate(Math.min(rate,100.0));

            if(progress.getCompletionRate() >= 90) {
                progress.setCompleted(true);
            }
        } else {
            progress.setCompletionRate(0.0);
        }
        return mapper.toResponse(repository.save(progress));
    }
}
