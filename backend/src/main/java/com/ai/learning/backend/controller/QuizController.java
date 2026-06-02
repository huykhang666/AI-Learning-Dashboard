package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.QuizSubmitRequest;
import com.ai.learning.backend.dto.response.QuizResponse;
import com.ai.learning.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses/{courseId}/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {
    private final QuizService quizService;

    @PostMapping("/fetch")
    public ResponseEntity<List<QuizResponse>> getQuizzes(
            @PathVariable String courseId,
            @RequestBody(required = false) Map<String, String> body) {

        String transcript = (body != null) ? body.get("transcript") : null;
        List<QuizResponse> quizzes = quizService.getOrCreateQuizzes(courseId, transcript);
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(
            @PathVariable String courseId,
            @RequestBody QuizSubmitRequest request) {

        Map<String, Object> result = quizService.gradeQuiz(courseId, request);
        return ResponseEntity.ok(result);
    }
}
