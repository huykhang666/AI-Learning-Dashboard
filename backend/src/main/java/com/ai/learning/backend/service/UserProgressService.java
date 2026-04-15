package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.UserProgressRequest;
import com.ai.learning.backend.dto.response.UserProgressResponse;

public interface UserProgressService {
    UserProgressResponse updateProgress(String username,UserProgressRequest request);

}
