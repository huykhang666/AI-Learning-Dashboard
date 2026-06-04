package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.QuizExportDto;
import com.ai.learning.backend.dto.request.QuizSubmitRequest;
import com.ai.learning.backend.dto.response.QuizResponse;
import com.ai.learning.backend.entity.Quiz;
import com.ai.learning.backend.entity.QuizOption;
import com.ai.learning.backend.repository.QuizRepository;
import com.ai.learning.backend.service.PdfService;
import com.ai.learning.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final QuizRepository quizRepository;
    private final PdfService pdfService;

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

    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportQuizPdf(
            @PathVariable String courseId,
            @RequestParam(required = false, defaultValue = "") String videoTitle) {

        try {
            List<Quiz> quizzes = quizRepository.findByCourseId(courseId);

            if (quizzes.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<QuizExportDto> dtoList = quizzes.stream().map(q -> {
                // Giữ đúng thứ tự options như lúc lưu vào DB
                List<QuizOption> opts = q.getOptions();
                List<String> optContents = opts.stream()
                        .map(QuizOption::getContent)
                        .collect(Collectors.toList());
                int correctIdx = IntStream.range(0, opts.size())
                        .filter(i -> opts.get(i).isCorrect())
                        .findFirst()
                        .orElse(0);
                return QuizExportDto.builder()
                        .question(q.getQuestion())
                        .options(optContents)
                        .correctIndex(correctIdx)
                        .explanation(q.getExplanation())
                        .build();
            }).collect(Collectors.toList());

            String title = (videoTitle == null || videoTitle.isBlank())
                    ? "Bài giảng #" + courseId
                    : videoTitle;

            ByteArrayInputStream pdf = pdfService.exportQuizToPdf(title, dtoList);
            byte[] pdfBytes = pdf.readAllBytes();

            return ResponseEntity.ok()
                    .header("Content-Disposition",
                            "attachment; filename=\"quiz_" + courseId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}