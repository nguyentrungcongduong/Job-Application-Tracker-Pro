package com.jobtracker.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // In prod, setFrom() is important.
            // In dev with Gmail SMTP, it usually overrides with auth user.
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            javaMailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
        }
    }

    @Async
    public void sendHtmlMessage(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
            log.info("HTML Email sent to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}", to, e);
        }
    }

    @Async
    public void sendNotificationEmail(String to, String title, String content) {
        String htmlBody = "<div style=\"background-color:#ffffff; padding: 20px; font-family: sans-serif;\">" +
                "  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 500px; background-color: #f8f9fa; border-radius: 20px; border: 1px solid #e9ecef;\">"
                +
                "    <tr>" +
                "      <td style=\"padding: 20px;\">" +
                "        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
                "          <tr>" +
                "            <td width=\"52\" valign=\"top\">" +
                "              <div style=\"width: 48px; height: 48px; border-radius: 50%; background-color: #1a1a2e; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">"
                +
                "                <img src=\"https://ui-avatars.com/api/?name=JT&background=1a1a2e&color=FFE259&size=128\" width=\"48\" height=\"48\" style=\"display: block;\" alt=\"Logo\">"
                +
                "              </div>" +
                "            </td>" +
                "            <td style=\"padding-left: 15px;\" valign=\"top\">" +
                "              <div style=\"font-size: 15px; font-weight: 800; color: #1a1a2e; margin-bottom: 2px;\">" +
                title
                + " <span style=\"font-size: 12px; color: #adb5bd; font-weight: 400; margin-left: 4px;\">• Vừa xong</span>"
                +
                "              </div>" +
                "              <div style=\"font-size: 14px; color: #4b5563; line-height: 1.5;\">" +
                content +
                "              </div>" +
                "            </td>" +
                "            <td width=\"24\" align=\"right\" valign=\"middle\">" +
                "              <div style=\"background-color: #f3f4f6; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px;\">"
                +
                "                <span style=\"color: #9ca3af; font-size: 12px;\">▼</span>" +
                "              </div>" +
                "            </td>" +
                "          </tr>" +
                "        </table>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "  <div style=\"margin-top: 15px; font-size: 11px; color: #9ca3af; text-align: center; max-width: 500px;\">"
                +
                "    &copy; 2026 JobTracker Pro. All rights reserved." +
                "  </div>" +
                "</div>";

        sendHtmlMessage(to, title, htmlBody);
    }

    @Async
    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your email - JobTracker Pro";
        String verificationUrl = "http://localhost:5173/verify-email?token=" + token;
        String htmlBody = "<h1>Welcome to JobTracker Pro!</h1>" +
                "<p>Please click the link below to verify your email address:</p>" +
                "<a href=\"" + verificationUrl + "\">Verify Email</a>" +
                "<p>If you didn't create an account, you can ignore this email.</p>";
        sendHtmlMessage(to, subject, htmlBody);
    }
}
