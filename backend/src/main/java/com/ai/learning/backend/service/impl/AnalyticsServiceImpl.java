package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.response.AnalyticsResponse;
import com.ai.learning.backend.entity.TopKeyword;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.AnalyticsMapper;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.TopKeywordRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.AnalyticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AnalyticsServiceImpl implements AnalyticsService {
    UserRepository userRepository;
    SessionRepository sessionRepository;
    TopKeywordRepository keywordRepository;


    @Override
    public AnalyticsResponse getDashBoardStats() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<String> keywords = keywordRepository.findTop5ByUser(user.getUserId())
                .stream()
                .map(TopKeyword::getKeyword)
                .toList();

        Object rawHours = sessionRepository.getTotalStudyHours(user.getUserId());
        double totalHours = (rawHours != null) ? Double.parseDouble(rawHours.toString()) : 0.0;
        long totalLectures = sessionRepository.countByUserId(user.getUserId());

        List<Object[]> rawProgress = sessionRepository.getWeeklyProgress(user.getUserId());

        List<String> fullWeek = List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");

        java.util.Map<String, Double> dataMap = (rawProgress == null) ? new java.util.HashMap<>() :
                rawProgress.stream().collect(java.util.stream.Collectors.toMap(
                        row -> String.valueOf(row[0]),
                        row -> row[1] != null ? Double.parseDouble(row[1].toString()) : 0.0,
                        (existing, replacement) -> existing
                ));

        List<AnalyticsResponse.DailyProgress> weeklyProgress = fullWeek.stream()
                .map(day -> new AnalyticsResponse.DailyProgress(
                        day,
                        dataMap.getOrDefault(day, 0.0)
                ))
                .toList();

        String fullname = user.getFirstName() + " " + user.getLastName();
        return AnalyticsResponse.builder()
                .weekGoal(user.getWeeklyGoal() != null ? user.getWeeklyGoal() : 10)
                .totalHours(totalHours)
                .totalLectures(totalLectures)
                .weeklyProgress(weeklyProgress)
                .topKeywords(keywords)
                .fullname(fullname)
                .build();
    }
}
