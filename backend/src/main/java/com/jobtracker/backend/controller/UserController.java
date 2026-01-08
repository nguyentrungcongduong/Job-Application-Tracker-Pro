package com.jobtracker.backend.controller;

import com.jobtracker.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/onboarding/complete")
    public ResponseEntity<Void> completeOnboarding(Authentication authentication) {
        userService.completeOnboarding(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/settings/email-notifications")
    public ResponseEntity<Void> updateEmailNotifications(Authentication authentication,
            @org.springframework.web.bind.annotation.RequestBody Boolean enabled) {
        userService.updateEmailNotifications(authentication.getName(), enabled);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/settings/notifications")
    public ResponseEntity<Void> updateNotificationSettings(Authentication authentication,
            @org.springframework.web.bind.annotation.RequestBody com.jobtracker.backend.dto.NotificationSettingsRequest request) {
        userService.updateNotificationSettings(
                authentication.getName(),
                request.isEmailNotificationsEnabled(),
                request.getFollowUpApplyingDays(),
                request.getFollowUpInterviewDays());
        return ResponseEntity.ok().build();
    }
}
