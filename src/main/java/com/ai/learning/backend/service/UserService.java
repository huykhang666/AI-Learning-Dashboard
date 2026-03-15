package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;

import java.util.List;


public interface UserService {
        //Register a new account
        UserResponse register(RegisterRequest request);

        //Get information of the currently logged-in user
        UserResponse getMyInfo();

        //Update profile information of a user
        UserResponse updateProfileRequest(Integer id, UpdateUserRequest request);

        // Check if the user is allowed to upload (based on quota/premium)
        boolean canUpload(Integer userId);

        //Update user upload
        void updateUsage(Integer userId);

        //Delete User
        void deleteUser(Integer userId);

        //Get list user
        public List<UserResponse> getUsers();
}
