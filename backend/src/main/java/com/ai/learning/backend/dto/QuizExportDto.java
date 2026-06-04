package com.ai.learning.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizExportDto {
    private String question;
    private List<String> options;
    private int correctIndex;
    private String explanation;
}
