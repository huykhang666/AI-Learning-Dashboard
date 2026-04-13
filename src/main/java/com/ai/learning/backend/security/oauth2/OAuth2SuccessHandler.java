package com.ai.learning.backend.security.oauth2;

import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.security.CustomUserDetails;
import com.ai.learning.backend.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        Object principal = authentication.getPrincipal();
        com.ai.learning.backend.entity.User user;

        if (principal instanceof DefaultOidcUser oidcUser) {
            String email = oidcUser.getEmail();

            user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        com.ai.learning.backend.entity.User newUser = new com.ai.learning.backend.entity.User();
                        newUser.setUsername(email);
                        newUser.setEmail(email);
                        newUser.setPassword(java.util.UUID.randomUUID().toString());
                        newUser.setProvider("GOOGLE");
                        return userRepository.save(newUser);
                    });
        } else {
            user = ((CustomUserDetails) principal).getUser();
        }

        String accessToken = jwtUtils.generateToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());

        String targetUrl = "http://localhost:5173/oauth2/callback"
                + "?token=" + accessToken
                + "&refreshToken=" + refreshToken;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
