package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    //Register
    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @GetMapping("/my-info")
    public UserResponse getMyInfo() {
        return userService.getMyInfo();
    }

    @PutMapping("/{id}")
    public UserResponse updateProfile(@PathVariable Integer id,@RequestBody UpdateUserRequest request) {
        return userService.updateProfileRequest(id,request);
    }

    @GetMapping("/{id}/can-upload")
    public boolean canUpload(@PathVariable Integer id) {
        return userService.canUpload(id);
    }

    @GetMapping("/{id}/update-usage")
    public void updateUsage(@PathVariable Integer id) {
        userService.updateUsage(id);
    }
}
