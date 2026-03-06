package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.entity.enums.UserRole;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse register(RegisterRequest request) {
        //Check if the email address already exists.
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        //Creating a User Object from a Request
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .role(UserRole.USER)
                .isPremium(false)
                .dailyUploadCount(0)
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse getMyInfo() {
        //Retrieve the username of the currently logged-in user from the security system
        var context = org.springframework.security.core.context.SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        //Find a user in the database by username.
        User user = userRepository.findByUsername(name)
                .orElseThrow(()-> new RuntimeException("Không tìm thấy thông tin người dùng")) ;
        return mapToResponse(user);
    }

    @Override
    public UserResponse updateProfileRequest(Integer id, UpdateUserRequest request) {
        //Find the old user in the database
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng để cập nhật"));

        //Update the fields that the User has submitted.
        if(request.getFirstname() != null) user.setFirstName(request.getFirstname());
        if(request.getLastname() != null) user.setLastName(request.getLastname());
        if(request.getDateOfBirth() != null) user.setDateOfBirth(LocalDate.from(request.getDateOfBirth()));

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public boolean canUpload(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("Không tìm thấy  người dùng")) ;
        if(user.isPremium())
            return true;
        return user.getDailyUploadCount() < 10;
    }

    @Override
    public void updateUsage(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setDailyUploadCount(user.getDailyUploadCount() + 1);
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .dateOfBirth(user.getDateOfBirth().atStartOfDay())
                .build();
    }
}
