package com.ai.learning.backend.integration.ai;

import com.ai.learning.backend.dto.response.AiAnalysisResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AiClient {
    WebClient aiWebClient;

    //Send video to Python service for AI analysis
    public AiAnalysisResponse processVideo(File videoFile) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", new FileSystemResource(videoFile));

        log.info("Sending video analysis request to Python AI service for file: {}", videoFile.getName());

        try {
            return  aiWebClient.post()
                    .uri("/ai/process-video")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .bodyToMono(AiAnalysisResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("AI Service communication failed: {}", e.getMessage());
            throw  e;
        }
    }
}
