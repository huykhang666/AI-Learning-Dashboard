package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.entity.enums.UserRole;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.UserMapper;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserResponse register(RegisterRequest request) {
        //Check if the email address already exists.
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        //Check if the username already exists.
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setDailyUploadCount(0);
        user.setPremium(false);

        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public UserResponse getMyInfo() {
        //Retrieve the username of the currently logged-in user from the security system
        var context = org.springframework.security.core.context.SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        //Find a user in the database by username.
        User user = userRepository.findByUsername(name)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateProfileRequest(Integer id, UpdateUserRequest request) {
        //Find the old user in the database
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        //Update the fields that the User has submitted.
       userMapper.updateUser(user,request);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public boolean canUpload(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND)) ;
        if(user.isPremium())
            return true;
        return user.getDailyUploadCount() < 10;
    }

    @Override
    public void updateUsage(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setDailyUploadCount(user.getDailyUploadCount() + 1);
        userRepository.save(user);
    }
}
