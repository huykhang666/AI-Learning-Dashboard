package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.UserRole;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.UserMapper;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.FetchProfile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;
    StringRedisTemplate redisTemplate;


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

        Set<String> roles = new HashSet<>();
        roles.add(UserRole.USER.name());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public UserResponse getMyInfo() {
        var context = org.springframework.security.core.context.SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        try {
            this.canUpload(user.getUserId());
        } catch (AppException e) {
            log.info("User {} đã hết lượt upload hôm nay", name);
        }

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateProfileRequest(Long id, UpdateUserRequest request) {
        //Find the old user in the database
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        //Update the fields that the User has submitted.
       userMapper.updateUser(user,request);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public boolean canUpload(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.isPremium())
            return true;

        String today = LocalDate.now().toString();
        String redisKey = "upload:count:" + userId + ":" + today;

        String currentCountStr = redisTemplate.opsForValue().get(redisKey);

        if (currentCountStr != null) {
            int currentCount = Integer.parseInt(currentCountStr);
            if (currentCount >= 4) {
                throw new AppException(ErrorCode.UPLOAD_LIMIT_EXCEEDED);
            }
        }
        return true;
    }

    @Override
    @Transactional
    public void updateUsage(Long userId) {
        String today = LocalDate.now().toString();
        String redisKey = "upload:count:" + userId + ":" + today;

        Long newCount = redisTemplate.opsForValue().increment(redisKey);
        if(newCount != null && newCount == 1) {
            redisTemplate.expire(redisKey, Duration.ofDays(1));
        }
    }

    @Override
    public void deleteUser(Long userId) {
        if(!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        userRepository.deleteById(userId);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse togglePremium(Long userId, boolean premium) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setPremium(premium);
        if (!premium) {
            user.setPremiumExpiredAt(null);
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get users");
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
}
