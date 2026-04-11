package com.ai.learning.backend.security.oauth2;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.UserRole;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    final private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(userRequest, oAuth2User);
        }catch (Exception e) {
            throw new InternalAuthenticationServiceException(e.getMessage(),e.getCause());
        }

    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest,OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        if(email == null) throw new OAuth2AuthenticationException("Email not found from Google");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if(userOptional.isPresent()) {
            user = updateExistingUser(userOptional.get(), oAuth2User);
        } else {
            user = registerNewUser(userRequest, oAuth2User);
        }

        return CustomUserDetails.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        User user = User.builder()
                .email((String) oAuth2User.getAttribute("email"))
                .firstName((String) oAuth2User.getAttribute("given_name"))
                .lastName((String) oAuth2User.getAttribute("family_name"))
                .username((String) oAuth2User.getAttribute("email"))
                .provider(userRequest.getClientRegistration().getRegistrationId())
                .providerId(oAuth2User.getName())
                .role(UserRole.USER)
                .password("")
                .build();
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2User oAuth2User) {
        existingUser.setFirstName((String) oAuth2User.getAttribute("given_name"));
        existingUser.setLastName((String) oAuth2User.getAttribute("family_name"));
        return userRepository.save(existingUser);
    }

}
