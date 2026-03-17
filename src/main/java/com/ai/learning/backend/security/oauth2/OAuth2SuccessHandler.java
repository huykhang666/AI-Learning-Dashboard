package com.ai.learning.backend.security.oauth2;

import com.ai.learning.backend.security.CustomUserDetails;
import com.ai.learning.backend.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        //Retrieve the information of the recently logged-in user.
        CustomUserDetails userDetails = (CustomUserDetails)  authentication.getPrincipal();

        //Generate a "key" token.
        String token = jwtUtils.generateRefreshToken(userDetails.getUsername());

        String targetUrl = "http://localhost:5174/oauth2/callback?token=" + token;

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
