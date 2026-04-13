package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.MessageRequest;
import com.ai.learning.backend.dto.response.MessageResponse;

public interface MessageService {
    MessageResponse sendMessage(MessageRequest request);
}
