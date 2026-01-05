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
}
