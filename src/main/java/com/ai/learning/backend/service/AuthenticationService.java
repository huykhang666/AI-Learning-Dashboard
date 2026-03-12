package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.AuthenticationRequest;
import com.ai.learning.backend.dto.request.IntrospectRequest;
import com.ai.learning.backend.dto.response.AuthenticationResponse;
import com.ai.learning.backend.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
}
