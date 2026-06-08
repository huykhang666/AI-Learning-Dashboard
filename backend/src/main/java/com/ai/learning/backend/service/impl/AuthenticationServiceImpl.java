package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.AuthenticationRequest;
import com.ai.learning.backend.dto.request.IntrospectRequest;
import com.ai.learning.backend.dto.response.AuthenticationResponse;
import com.ai.learning.backend.dto.response.IntrospectResponse;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.security.jwt.JwtUtils;
import com.ai.learning.backend.service.AuthenticationService;
import com.nimbusds.jose.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.text.ParseException;
import java.util.concurrent.TimeUnit;
import com.ai.learning.backend.entity.PasswordResetToken;
import com.ai.learning.backend.repository.PasswordResetTokenRepository;
import com.ai.learning.backend.service.EmailService;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    PasswordResetTokenRepository passwordResetTokenRepository;
    EmailService emailService;
    JwtUtils jwtUtils;
    RedisTemplate<String, Object> redisTemplate;

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var isValid = jwtUtils.validateToken(request.getToken());
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        //Find User
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        //Password match
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        var token = jwtUtils.generateToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user);

        String redisKey = "auth:refresh_token:" + refreshToken;

        redisTemplate.opsForValue().set(
                redisKey,
                user.getUsername(),
                7,
                TimeUnit.DAYS
        );

        return AuthenticationResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }
    @Override
    public void forgotPassword(String email) {
        log.info("Forgot password request for email: {}", email);
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        log.info("User found: {}", user.getUsername());

        passwordResetTokenRepository.deleteByEmail(email);
        log.info("Deleted old tokens for email: {}", email);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .email(email)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();
        passwordResetTokenRepository.save(resetToken);
        log.info("Saved new token: {}", token);

        String resetLink = "http://192.168.1.13:5173/reset-password?token=" + token;
        log.info("Sending email to: {} with link: {}", email, resetLink);
        emailService.sendPasswordResetEmail(email, resetLink);
        log.info("Email sent successfully!");
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        var user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
