package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.SessionRequest;
import com.ai.learning.backend.dto.response.PageResponse;
import com.ai.learning.backend.dto.response.SessionDetailResponse;
import com.ai.learning.backend.dto.response.SessionListResponse;
import com.ai.learning.backend.entity.AIResult;
import com.ai.learning.backend.entity.Course;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.SessionMapper;
import com.ai.learning.backend.repository.*;
import com.ai.learning.backend.service.SessionService;
import com.ai.learning.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class SessionServiceImpl implements SessionService {
    SessionRepository sessionRepository;
    SessionMapper sessionMapper;
    UserRepository userRepository;
    UserService userService;
    TopKeywordRepository topKeywordRepository;
    UserProgressRepository userProgressRepository;
    com.ai.learning.backend.repository.LessonRepository lessonRepository;
    com.ai.learning.backend.repository.EnrollmentRepository enrollmentRepository;
    com.ai.learning.backend.repository.CourseTransactionRepository transactionRepository;

    //Create a new learning session for current user
    @Override
    @Transactional
    public SessionListResponse create(SessionRequest request) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userService.canUpload(user.getUserId());

        LearningSession session = sessionMapper.toEntity(request);
        session.setVideoUrl(request.getVideoUrl());
        session.setUser(user);
        session.setStatus(SessionStatus.PENDING);

        LearningSession savedSession = sessionRepository.save(session);

        userService.updateUsage(user.getUserId());

        return sessionMapper.toListResponse(savedSession);
    }

    //Retrieve session details including AI analysis results
    @Override
    public SessionDetailResponse getById(Long id) {
        LearningSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AIResult aiResult = session.getAiResult();
        return sessionMapper.toDetailResponse(session, aiResult);
    }

    @Override
    public SessionDetailResponse getLessonSession(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học"));
        Course course = lesson.getCourse();

        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if course requires paywall
        boolean isPremium = course.isPremiumRequired() || (course.getPrice() != null && course.getPrice() > 0);
        if (isPremium) {
            // Admin bypass
            boolean isAdmin = user.getRole() == com.ai.learning.backend.enums.UserRole.ADMIN;
            if (!isAdmin) {
                // Check if this lesson is a preview lesson (first 2 lessons sorted by orderIndex)
                boolean isPreviewLesson = false;
                if (course.getLessons() != null && !course.getLessons().isEmpty()) {
                    java.util.List<Lesson> sortedLessons = new java.util.ArrayList<>(course.getLessons());
                    sortedLessons.sort(java.util.Comparator.comparing(Lesson::getOrderIndex, 
                            java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())));
                    
                    for (int i = 0; i < Math.min(2, sortedLessons.size()); i++) {
                        if (sortedLessons.get(i).getLessonId().equals(lessonId)) {
                            isPreviewLesson = true;
                            break;
                        }
                    }
                }

                if (!isPreviewLesson) {
                    // Check successful transaction
                    boolean hasPaid = transactionRepository.existsByUserUserIdAndCourseCourseIdAndStatus(
                            user.getUserId(), course.getCourseId(), "COMPLETED"
                    );

                    // Check premium status if isPremiumRequired is true
                    boolean hasPremiumAccess = false;
                    if (course.isPremiumRequired() && user.isPremium()) {
                        if (user.getPremiumExpiredAt() != null && user.getPremiumExpiredAt().isAfter(java.time.LocalDateTime.now())) {
                            hasPremiumAccess = true;
                        }
                    }

                    if (!hasPaid && !hasPremiumAccess) {
                        throw new AppException(ErrorCode.FORBIDDEN);
                    }
                }
            }
        }

        // Find or create LearningSession for this user & lesson
        LearningSession session = sessionRepository.findByUserIdAndVideoUrl(user.getUserId(), lesson.getVideoUrl())
                .orElseGet(() -> {
                    LearningSession newSession = LearningSession.builder()
                            .title(lesson.getTitle())
                            .videoUrl(lesson.getVideoUrl())
                            .status(SessionStatus.COMPLETED)
                            .user(user)
                            .duration(lesson.getDuration() != null ? lesson.getDuration() : 600)
                            .build();
                    return sessionRepository.save(newSession);
                });

        AIResult aiResult = session.getAiResult();
        SessionDetailResponse response = sessionMapper.toDetailResponse(session, aiResult);
        // Crucial: keep the learningSessionId as the input id (lessonId) so frontend routes/actions map correctly!
        response.setLearningSessionId(lessonId);
        response.setCourseId(course.getCourseId());
        response.setChapter(lesson.getChapter());
        response.setDocumentUrl(lesson.getDocumentUrl());
        response.setDocumentName(lesson.getDocumentName());

        return response;
    }

    @Override
    public PageResponse<SessionListResponse> listByUser(int page, int size) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<LearningSession> sessionPage = sessionRepository.findByUserUsername(username,pageable);

        return PageResponse.<SessionListResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalElements(sessionPage.getTotalElements())
                .totalPages(sessionPage.getTotalPages())
                .data(sessionPage.getContent().stream()
                        .map(sessionMapper::toListResponse)
                        .toList())
                .build();
    }

    //Get current processing status of the session
    @Override
    public String getStatus(Long id) {
        LearningSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return session.getStatus().name();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if(!sessionRepository.existsById(id)) {
            throw new AppException(ErrorCode.LESSON_NOT_EXISTED);
        }

        topKeywordRepository.deleteBySession_LearningSessionId(id);

        userProgressRepository.deleteBySession_LearningSessionId(id);

        sessionRepository.deleteById(id);
        log.info("Deleted session ID: {}", id);
    }

}
