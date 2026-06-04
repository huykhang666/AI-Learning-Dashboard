package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.QuizExportDto;
import com.ai.learning.backend.payment.entity.Payment;
import java.util.List;
import java.io.ByteArrayInputStream;

public interface PdfService {
    ByteArrayInputStream exportSummaryToPdf(String title, String content);
    ByteArrayInputStream exportInvoiceToPdf(Payment payment);
    ByteArrayInputStream exportQuizToPdf(String videoTitle, List<QuizExportDto> quizzes);

}