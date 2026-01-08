package com.jobtracker.backend.service;

import com.jobtracker.backend.dto.InterviewDTO;
import com.jobtracker.backend.entity.Interview;
import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.mapper.InterviewMapper;
import com.jobtracker.backend.repository.InterviewRepository;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository repository;
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final InterviewMapper mapper;

    private User getCurrentUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<InterviewDTO> getAllInterviews() {
        User user = getCurrentUser();
        return repository.findByApplicationUserId(user.getId())
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public List<InterviewDTO> getInterviewsByApplication(UUID applicationId) {
        return repository.findByApplicationId(applicationId)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewDTO createInterview(InterviewDTO dto) {
        JobApplication application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Interview interview = mapper.toEntity(dto);
        interview.setApplication(application);

        return mapper.toDto(repository.save(interview));
    }

    @Transactional
    public void deleteInterview(UUID id) {
        repository.deleteById(id);
    }
}
