package com.ai.learning.backend.service;

import java.io.ByteArrayInputStream;

public interface PdfService {
    ByteArrayInputStream exportSummaryToPdf(String title, String content);
}