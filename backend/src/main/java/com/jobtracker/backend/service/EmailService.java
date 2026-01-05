package com.jobtracker.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url:http://localhost:5174}")
    private String frontendUrl;

    public void sendVerificationEmail(String to, String token) {
        String url = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify your account - Job Application Tracker Pro";
        String content = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc;\">"
                +
                "<div style=\"background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">"
                +
                "<div style=\"text-align: center; margin-bottom: 32px;\">" +
                "<h1 style=\"margin: 0; color: #6366f1; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;\">JobTracker<span style=\"color: #1e293b;\">Pro</span></h1>"
                +
                "<div style=\"height: 4px; width: 40px; background: #6366f1; margin: 12px auto; border-radius: 2px;\"></div>"
                +
                "</div>" +
                "<h2 style=\"font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; text-align: center;\">Confirm your email address</h2>"
                +
                "<p style=\"font-size: 16px; line-height: 24px; color: #475569; margin-bottom: 32px; text-align: center;\">"
                +
                "Welcome to the elite circle of job seekers! To start tracking your applications and unlock your personalized dashboard, please verify your email."
                +
                "</p>" +
                "<div style=\"text-align: center; margin-bottom: 32px;\">" +
                "<a href=\"" + url
                + "\" style=\"display: inline-block; background-color: #6366f1; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: background-color 0.2s;\">Verify Account Now</a>"
                +
                "</div>" +
                "<p style=\"font-size: 14px; color: #94a3b8; text-align: center; margin-bottom: 0;\">" +
                "This link will expire in 24 hours.<br>If you didn't create an account, you can safely ignore this email."
                +
                "</p>" +
                "</div>" +
                "<div style=\"text-align: center; margin-top: 24px;\">" +
                "<p style=\"font-size: 12px; color: #94a3b8;\">" +
                "&copy; 2026 Job Application Tracker Pro. All rights reserved." +
                "</p>" +
                "</div>" +
                "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
