package com.ai.learning.backend.service.logic;

import com.ai.learning.backend.repository.MessageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ChatBotAsyncTask {
    WebClient webClient;
    MessageRepository messageRepository;

    @Async("taskExecutor")
    public void callFastApiAndUpdateMessage(Map<String,Object> apiRequest, Long aiMessageId) {
        try {
            Map<String,String> response = webClient.post()
                    .uri("http://localhost:8000/ai/chat")
                    .bodyValue(apiRequest)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String,String>>() {})
                    .block();

            if(response != null && response.containsKey("answer")) {
                String aiAnswer = response.get("answer");

                //Update Message to the database
                messageRepository.findById(aiMessageId).ifPresent(msg -> {
                    msg.setContent(aiAnswer);
                    messageRepository.save(msg);

                });
            }
        } catch (Exception e) {
            messageRepository.findById(aiMessageId).ifPresent(msg -> {
                msg.setContent("I can't connect to AI service right now.");
                messageRepository.save(msg);
            });
        }
    }
}
