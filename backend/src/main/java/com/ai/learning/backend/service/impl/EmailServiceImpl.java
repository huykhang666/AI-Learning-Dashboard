package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("6551071010@st.utc2.edu.vn", "AI Learning Dashboard");
            helper.setTo(to);
            helper.setSubject("Đặt lại mật khẩu");
            helper.setText("Nhấn vào link sau để đặt lại mật khẩu:\n\n" + resetLink + "\n\nLink có hiệu lực trong 15 phút.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }
}