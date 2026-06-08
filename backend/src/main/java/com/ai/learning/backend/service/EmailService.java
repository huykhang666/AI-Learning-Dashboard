package com.ai.learning.backend.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String resetLink);
}