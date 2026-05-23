package com.ai.learning.backend.security.oauth2;

import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.security.CustomUserDetails;
import com.ai.learning.backend.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Value("${OAUTH2_REDIRECT_URI:http://localhost:5173/oauth2/callback}")
    private String oauth2RedirectUri;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        Object principal = authentication.getPrincipal();

        User user;

        // =========================
        // LOGIN THƯỜNG
        // =========================
        if (principal instanceof CustomUserDetails customUserDetails) {

            user = customUserDetails.getUser();

        }

        // =========================
        // LOGIN GOOGLE OAUTH2
        // =========================
        else if (principal instanceof DefaultOidcUser oidcUser) {

            String email = oidcUser.getEmail();

            System.out.println("Google Login Email: " + email);

            user = userRepository.findByEmail(email)
                    .orElseGet(() -> {

                        User newUser = new User();

                        // =========================
                        // THÔNG TIN CƠ BẢN
                        // =========================
                        newUser.setEmail(email);

                        newUser.setFirstName(
                                oidcUser.getGivenName() != null
                                        ? oidcUser.getGivenName()
                                        : "Google"
                        );

                        newUser.setLastName(
                                oidcUser.getFamilyName() != null
                                        ? oidcUser.getFamilyName()
                                        : "User"
                        );

                        // =========================
                        // USERNAME
                        // =========================
                        newUser.setUsername(email);

                        // =========================
                        // PASSWORD RANDOM
                        // GOOGLE ACCOUNT KHÔNG LOGIN PASSWORD
                        // =========================
                        newUser.setPassword(
                                new BCryptPasswordEncoder()
                                        .encode(UUID.randomUUID().toString())
                        );

                        // =========================
                        // OAUTH2 INFO
                        // =========================
                        newUser.setProvider("GOOGLE");

                        newUser.setProviderId(
                                oidcUser.getSubject()
                        );

                        // =========================
                        // DEFAULT VALUE
                        // =========================
                        newUser.setCreatedAt(LocalDateTime.now());

                        newUser.setPremium(false);

                        newUser.setWeeklyGoal(10);

                        System.out.println("Creating new Google user: " + email);

                        return userRepository.save(newUser);
                    });

        }

        // =========================
        // PRINCIPAL KHÔNG HỖ TRỢ
        // =========================
        else {

            throw new RuntimeException(
                    "Authentication principal is not supported: "
                            + principal.getClass()
            );
        }

        // =========================
        // GENERATE JWT
        // =========================
        String accessToken = jwtUtils.generateToken(user);

        String refreshToken = jwtUtils.generateRefreshToken(user);

        // =========================
        // REDIRECT FRONTEND 
        // =========================

        String baseRedirectUrl = oauth2RedirectUri;
        if (!baseRedirectUrl.contains("/callback") && baseRedirectUrl.endsWith("/redirect")) {
            baseRedirectUrl = baseRedirectUrl.replace("/redirect", "/callback");
        } else if (!baseRedirectUrl.contains("/callback")) {
            baseRedirectUrl = baseRedirectUrl + "/callback";
        }

        String targetUrl = baseRedirectUrl
                + "?token=" + accessToken
                + "&refreshToken=" + refreshToken
                + "&userId=" + user.getUserId();


        getRedirectStrategy().sendRedirect(
                request,
                response,
                targetUrl
        );
    }
}