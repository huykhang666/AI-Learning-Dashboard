package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    //Register
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ApiResponse.<UserResponse>builder()
               .code(1000)
                .message("User has been registered successfully")
                .result(userService.register(request))
                .build();
    }

    @GetMapping("/my-info")
    public UserResponse getMyInfo() {
        return ApiResponse.<UserResponse>builder().
                result(userService.getMyInfo()).build().getResult();
    }

    @PutMapping("/{id}")
    public UserResponse updateProfile(@PathVariable Integer id,@RequestBody UpdateUserRequest request) {
        return ApiResponse.<UserResponse>builder().
                result(userService.updateProfileRequest(id,request)).build().getResult();
    }

    @GetMapping("/{id}/can-upload")
    public boolean canUpload(@PathVariable Integer id) {
        return ApiResponse.<Boolean>builder().
                result(userService.canUpload(id)).build().getResult();
    }

    @GetMapping("/{id}/update-usage")
    public ApiResponse.ApiResponseBuilder<Void> updateUsage(@PathVariable Integer id) {
        userService.updateUsage(id);
        return ApiResponse.<Void>builder().
                message("Update usage successfully");
    }
}
