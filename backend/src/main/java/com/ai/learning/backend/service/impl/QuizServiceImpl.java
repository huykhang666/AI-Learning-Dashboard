package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.QuizSubmitRequest;
import com.ai.learning.backend.dto.response.QuizResponse;
import com.ai.learning.backend.entity.Quiz;
import com.ai.learning.backend.entity.QuizOption;
import com.ai.learning.backend.repository.QuizRepository;
import com.ai.learning.backend.service.QuizService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final WebClient aiWebClient;

    @Autowired
    public QuizServiceImpl(
            QuizRepository quizRepository,
            @Qualifier("aiWebClient") WebClient aiWebClient) {
        this.quizRepository = quizRepository;
        this.aiWebClient = aiWebClient;
    }

    @Override
    @Transactional
    public List<QuizResponse> getOrCreateQuizzes(String courseId, String transcriptText) {
        try {
            log.info("[QuizService] Đang tìm kiếm bộ câu hỏi cho courseId: {}", courseId);
            List<Quiz> existingQuizzes = quizRepository.findByCourseId(courseId);

            if (!existingQuizzes.isEmpty()) {
                log.info("[QuizService] Tìm thấy bộ câu hỏi có sẵn trong DB cho courseId: {}", courseId);
                return existingQuizzes.stream().map(this::mapToResponse).collect(Collectors.toList());
            }

            if (transcriptText != null && !transcriptText.isBlank()) {
                log.info("[QuizService] DB trống. Đang bắn transcript sang AI Service qua WebClient cho courseId: {}", courseId);
                return generateAndSaveQuizzes(courseId, transcriptText);
            }

            return Collections.emptyList();
        } catch (Exception e) {
            log.error("[QuizService] Lỗi nghiêm trọng tại getOrCreateQuizzes: ", e);
            throw new RuntimeException("Lỗi hệ thống khi xử lý câu hỏi trắc nghiệm.", e);
        }
    }

    private List<QuizResponse> generateAndSaveQuizzes(String courseId, String transcriptText) {
        try {
            Map<String, String> requestBody = Map.of("transcript", transcriptText);

            List<Map<String, Object>> aiResponse = aiWebClient.post()
                    .uri("/ai/generate-quiz")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (aiResponse == null || aiResponse.isEmpty()) {
                log.warn("[QuizService] AI Service trả về danh sách câu hỏi rỗng.");
                return Collections.emptyList();
            }

            List<Quiz> savedQuizzes = new ArrayList<>();

            for (Map<String, Object> quizMap : aiResponse) {
                Quiz quiz = Quiz.builder()
                        .courseId(courseId)
                        .question((String) quizMap.get("question"))
                        .explanation((String) quizMap.get("explanation"))
                        .build();

                List<String> optionsStr = (List<String>) quizMap.get("options");
                int correctIdx = (Integer) quizMap.get("correct_index");

                List<QuizOption> options = new ArrayList<>();
                for (int i = 0; i < optionsStr.size(); i++) {
                    options.add(QuizOption.builder()
                            .quiz(quiz)
                            .content(optionsStr.get(i))
                            .isCorrect(i == correctIdx)
                            .build());
                }
                quiz.setOptions(options);
                savedQuizzes.add(quizRepository.save(quiz));
            }

            log.info("[QuizService] Tạo và lưu thành công {} câu hỏi từ AI.", savedQuizzes.size());
            return savedQuizzes.stream().map(this::mapToResponse).collect(Collectors.toList());

        } catch (Exception e) {
            log.error("[QuizService] Lỗi khi gọi AI Service qua WebClient: ", e);
            return Collections.emptyList();
        }
    }

    @Override
    public Map<String, Object> gradeQuiz(String courseId, QuizSubmitRequest request) {
        try {
            List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
            int totalQuestions = quizzes.size();
            int correctCount = 0;

            Map<Long, Long> correctAnswersMap = new HashMap<>();

            for (Quiz q : quizzes) {
                Long correctOptionId = q.getOptions().stream()
                        .filter(QuizOption::isCorrect)
                        .map(QuizOption::getId)
                        .findFirst()
                        .orElse(null);

                correctAnswersMap.put(q.getId(), correctOptionId);

                Long userChosenOptionId = request.getAnswers().get(q.getId());
                if (userChosenOptionId != null && userChosenOptionId.equals(correctOptionId)) {
                    correctCount++;
                }
            }

            double score = totalQuestions > 0 ? ((double) correctCount / totalQuestions) * 10 : 0;

            return Map.of(
                    "score", String.format("%.1f", score),
                    "correctCount", correctCount,
                    "wrongCount", (totalQuestions - correctCount),
                    "correctAnswers", correctAnswersMap
            );
        } catch (Exception e) {
            log.error("[QuizService] Lỗi khi chấm điểm bài làm: ", e);
            throw new RuntimeException("Không thể hoàn tất chấm điểm lúc này.", e);
        }
    }

    private QuizResponse mapToResponse(Quiz quiz) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .question(quiz.getQuestion())
                .explanation(quiz.getExplanation())
                .options(quiz.getOptions().stream()
                        .map(o -> QuizResponse.OptionDto.builder()
                                .id(o.getId())
                                .content(o.getContent())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}