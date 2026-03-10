package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.AuthenticationRequest;
import com.ai.learning.backend.dto.response.AuthenticationResponse;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
}
