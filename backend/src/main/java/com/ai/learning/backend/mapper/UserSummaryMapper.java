package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.UserSummaryDTO;
import com.ai.learning.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserSummaryMapper {
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "isPremium", source = "premium") 
    @Mapping(target = "fullName", expression = "java(user.getFirstName() + \" \" + user.getLastName())")
    UserSummaryDTO toUserSummaryDTO(User user);
}
