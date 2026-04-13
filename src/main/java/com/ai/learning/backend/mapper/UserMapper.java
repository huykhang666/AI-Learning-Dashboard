package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(RegisterRequest request);


    @Mapping(target = "firstname", source = "firstName")
    @Mapping(target = "lastname", source = "lastName")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    UserResponse toUserResponse(User user);

    @Mapping(target = "firstName", source = "firstname")
    @Mapping(target = "lastName", source = "lastname")
    void updateUser(@MappingTarget User user, UpdateUserRequest request);
}
