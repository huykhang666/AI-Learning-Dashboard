package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.QuizSubmitRequest;
import com.ai.learning.backend.dto.response.QuizResponse;

import java.util.List;
import java.util.Map;

public interface QuizService {
    List<QuizResponse> getOrCreateQuizzes(String courseId, String transcriptText);
    Map<String, Object> gradeQuiz(String courseId, QuizSubmitRequest request);
}
