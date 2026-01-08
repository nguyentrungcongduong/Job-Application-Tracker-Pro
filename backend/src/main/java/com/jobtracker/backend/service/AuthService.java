package com.jobtracker.backend.service;

import com.jobtracker.backend.dto.AuthRequest;
import com.jobtracker.backend.dto.AuthResponse;
import com.jobtracker.backend.dto.RegisterRequest;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.entity.UserRole;
import com.jobtracker.backend.entity.VerificationToken;
import com.jobtracker.backend.repository.UserRepository;
import com.jobtracker.backend.repository.VerificationTokenRepository;
import com.jobtracker.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final VerificationTokenRepository tokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;

        public AuthResponse register(RegisterRequest request) {
                var user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(UserRole.BASIC)
                                .enabled(true) // User is enabled by default for testing
                                .build();
                userRepository.save(user);

                // Create verification token
                String token = UUID.randomUUID().toString();
                VerificationToken verificationToken = VerificationToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(LocalDateTime.now().plusHours(24))
                                .build();
                tokenRepository.save(verificationToken);

                // Send verification email
                emailService.sendVerificationEmail(user.getEmail(), token);

                // In a real flow, we might not return a token here if it's mandatory to verify
                // But for now, let's return a partial response or null token
                return AuthResponse.builder()
                                .id(user.getId().toString())
                                .name(user.getName())
                                .email(user.getEmail())
                                .onboarded(user.isOnboarded())
                                .emailNotificationsEnabled(user.isEmailNotificationsEnabled())
                                .build();
        }

        public void verifyEmail(String token) {
                VerificationToken verificationToken = tokenRepository.findByToken(token)
                                .orElseThrow(() -> new RuntimeException("Invalid token"));

                if (verificationToken.isExpired()) {
                        throw new RuntimeException("Token expired");
                }

                User user = verificationToken.getUser();
                user.setEnabled(true);
                userRepository.save(user);
                tokenRepository.delete(verificationToken);
        }

        public AuthResponse authenticate(AuthRequest request) {
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!user.isEnabled()) {
                        throw new DisabledException("Email not verified. Please check your inbox.");
                }

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var userDetails = org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .roles(user.getRole().name())
                                .build();

                var jwtToken = jwtService.generateToken(userDetails);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .id(user.getId().toString())
                                .name(user.getName())
                                .email(user.getEmail())
                                .onboarded(user.isOnboarded())
                                .emailNotificationsEnabled(user.isEmailNotificationsEnabled())
                                .build();
        }
}
