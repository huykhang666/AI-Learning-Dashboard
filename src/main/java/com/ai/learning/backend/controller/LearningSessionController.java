package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.service.AIIntegrationService;
import com.ai.learning.backend.service.AIResultService;
import com.ai.learning.backend.service.SessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LearningSessionController {
    final AIIntegrationService aiIntegrationService;
    final SessionService sessionService;
    final AIResultService aiResultService;


}
