package com.ai.learning.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AiLearningApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiLearningApplication.class, args);
	}

}
