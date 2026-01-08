package com.jobtracker.backend.service;

import com.jobtracker.backend.entity.Notification;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Transactional
    public void notify(User user, String type, String title, String content) {
        // 1. Save In-App Notification
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .content(content)
                .channel("IN_APP")
                .isRead(false)
                .read(false)
                .build();

        if (notification != null) {
            notificationRepository.save(notification);
        }
        log.info("Saved in-app notification for user {}", user.getId());

        // 2. Check Preferences for Email
        // For MVP, we simply check the global toggle.
        // More granular control (email only for interview, etc.) can be added later.
        if (user.isEmailNotificationsEnabled()) {
            // Basic implementation: Send email for all notifications if enabled.
            // Or maybe only for "INTERVIEW_REMINDER"?
            // User Request says: "Email Notification... Dùng cho: Interview reminder (very
            // important)... Follow-up (optional)"
            // Let's filter slightly to avoid spamming for trivial things if any.
            if ("INTERVIEW_REMINDER".equals(type) || "FOLLOW_UP".equals(type)) {
                emailService.sendNotificationEmail(
                        user.getEmail(),
                        title, // Subject
                        content // Body
                );
                log.info("Dispatched email notification to {}", user.getEmail());
            }
        }
    }

    public Page<Notification> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderBySentAtDesc(userId, pageable);
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        // In a real app, optimize this with a bulk update query
        notificationRepository.findByUserIdOrderBySentAtDesc(userId).forEach(n -> {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }
}
