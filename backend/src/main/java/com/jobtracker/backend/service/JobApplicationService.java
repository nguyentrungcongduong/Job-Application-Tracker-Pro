package com.jobtracker.backend.service;

import com.jobtracker.backend.dto.JobApplicationDTO;
import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.mapper.JobApplicationMapper;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final JobApplicationMapper mapper;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<JobApplicationDTO> getAllApplications() {
        User user = getCurrentUser();
        return repository.findByUser(user)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationDTO createApplication(JobApplicationDTO dto) {
        User user = getCurrentUser();
        JobApplication application = mapper.toEntity(dto);
        application.setUser(user);
        return mapper.toDto(repository.save(application));
    }

    @Transactional
    public JobApplicationDTO updateApplication(UUID id, JobApplicationDTO dto) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        mapper.updateEntityFromDto(dto, application);

        return mapper.toDto(repository.save(application));
    }

    @Transactional
    public void deleteApplication(UUID id) {
        repository.deleteById(id);
    }

    public JobApplicationDTO checkDuplicate(String companyName, String position) {
        User user = getCurrentUser();
        List<JobApplication> existing = repository.findByUserAndCompanyNameIgnoreCaseAndPositionIgnoreCase(user,
                companyName, position);
        if (!existing.isEmpty()) {
            return mapper.toDto(existing.get(0));
        }
        return null;
    }
}
