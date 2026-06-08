package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.AuthenticationRequest;
import com.ai.learning.backend.dto.request.IntrospectRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.AuthenticationResponse;
import com.ai.learning.backend.dto.response.IntrospectResponse;
import com.ai.learning.backend.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ai.learning.backend.dto.request.ForgotPasswordRequest;
import com.ai.learning.backend.dto.request.ResetPasswordRequest;
import java.text.ParseException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }
    @PostMapping("/forgot-password")
    ApiResponse<Void> forgotPassword(
            @RequestBody ForgotPasswordRequest request,
            @org.springframework.web.bind.annotation.RequestHeader(value = "Origin", required = false) String origin) {
        authenticationService.forgotPassword(request.getEmail(), origin);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Email đặt lại mật khẩu đã được gửi!")
                .build();
    }

    @PostMapping("/reset-password")
    ApiResponse<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request.getToken(), request.getNewPassword());
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Đặt lại mật khẩu thành công!")
                .build();
    }
}
