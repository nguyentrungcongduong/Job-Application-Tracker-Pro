package com.jobtracker.backend.service;

import com.jobtracker.backend.dto.AuthRequest;
import com.jobtracker.backend.dto.AuthResponse;
import com.jobtracker.backend.dto.RegisterRequest;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.entity.UserRole;
import com.jobtracker.backend.repository.UserRepository;
import com.jobtracker.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private AuthRequest authRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password123")
                .build();

        authRequest = AuthRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        user = User.builder()
                .name("Test User")
                .email("test@example.com")
                .password("encodedPassword")
                .role(UserRole.BASIC)
                .onboarded(false)
                .build();
    }

    @Test
    void register_ShouldCreateUserAndReturnAuthResponse() {
        // Arrange
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo(registerRequest.getEmail());
        assertThat(response.isOnboarded()).isFalse();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void authenticate_ShouldReturnAuthResponse_WhenCredentialsAreValid() {
        // Arrange
        when(userRepository.findByEmail(authRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.authenticate(authRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo(authRequest.getEmail());
        assertThat(response.isOnboarded()).isFalse();
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void authenticate_ShouldReturnOnboardedTrue_WhenUserHasCompletedOnboarding() {
        // Arrange
        user.setOnboarded(true);
        when(userRepository.findByEmail(authRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.authenticate(authRequest);

        // Assert
        assertThat(response.isOnboarded()).isTrue();
    }
}
