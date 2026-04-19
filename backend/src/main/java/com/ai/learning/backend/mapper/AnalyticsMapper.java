package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.AnalyticsResponse;
import com.ai.learning.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnalyticsMapper {

    @Mapping(target = "weekGoal", source = "weeklyGoal") // Khớp: weeklyGoal -> weekGoal
    @Mapping(target = "totalHours", ignore = true)     // Những cái này lấy từ Repo khác nên ignore
    @Mapping(target = "totalLectures", ignore = true)
    @Mapping(target = "weeklyProgress", ignore = true)
    @Mapping(target = "topKeywords", ignore = true)
    AnalyticsResponse toAnalyticsResponse(User user);
}
