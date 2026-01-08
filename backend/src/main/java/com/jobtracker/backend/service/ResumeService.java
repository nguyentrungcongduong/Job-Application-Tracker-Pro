package com.jobtracker.backend.service;

import com.jobtracker.backend.entity.Resume;
import com.jobtracker.backend.entity.User;
import org.springframework.core.io.Resource;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.repository.ResumeEventRepository;
import com.jobtracker.backend.repository.ResumeRepository;
import com.jobtracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final AsyncParsingService asyncParsingService;
    private final JobApplicationRepository jobApplicationRepository;
    private final ResumeEventRepository resumeEventRepository;

    @Transactional
    public Resume uploadResume(UUID userId, MultipartFile file, String versionName) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Store file
        String filePath = storageService.store(file, "resumes/" + userId);

        // Save metadata
        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .originalFileName(file.getOriginalFilename())
                .fileUrl(filePath)
                .versionName(versionName)
                .build();

        Resume savedResume = resumeRepository.save(resume);

        // Log Upload Event
        resumeEventRepository.save(com.jobtracker.backend.entity.ResumeEvent.builder()
                .resume(savedResume)
                .type("CV_UPLOADED")
                .description("CV version '" + versionName + "' uploaded")
                .build());

        // Trigger Async Parse AFTER transaction commits
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                asyncParsingService.parseResume(savedResume.getId());
            }
        });

        return savedResume;
    }

    public com.jobtracker.backend.dto.ResumePerformanceDTO getResumePerformance(UUID resumeId) {
        long total = jobApplicationRepository.countByResumeId(resumeId);
        long interviews = jobApplicationRepository.countByResumeIdAndStatusIn(resumeId,
                List.of(com.jobtracker.backend.entity.ApplicationStatus.HR_SCREEN,
                        com.jobtracker.backend.entity.ApplicationStatus.INTERVIEW_1,
                        com.jobtracker.backend.entity.ApplicationStatus.INTERVIEW_2,
                        com.jobtracker.backend.entity.ApplicationStatus.FINAL_INTERVIEW,
                        com.jobtracker.backend.entity.ApplicationStatus.OFFER_RECEIVED,
                        com.jobtracker.backend.entity.ApplicationStatus.OFFER_ACCEPTED));
        long offers = jobApplicationRepository.countByResumeIdAndStatusIn(resumeId,
                List.of(com.jobtracker.backend.entity.ApplicationStatus.OFFER_RECEIVED,
                        com.jobtracker.backend.entity.ApplicationStatus.OFFER_ACCEPTED));

        double rate = total == 0 ? 0 : (offers / (double) total) * 100;

        return com.jobtracker.backend.dto.ResumePerformanceDTO.builder()
                .totalApplications(total)
                .interviews(interviews)
                .offers(offers)
                .successRate(rate)
                .build();
    }

    public List<com.jobtracker.backend.dto.ResumeEventDTO> getResumeEvents(UUID resumeId) {
        return resumeEventRepository.findByResumeIdOrderByCreatedAtDesc(resumeId).stream()
                .map(e -> com.jobtracker.backend.dto.ResumeEventDTO.builder()
                        .type(e.getType())
                        .description(e.getDescription())
                        .createdAt(e.getCreatedAt())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<com.jobtracker.backend.dto.ResumeResponseDTO> getUserResumes(UUID userId) {
        return resumeRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Resume> getUserResumeEntities(UUID userId) {
        return resumeRepository.findByUserId(userId);
    }

    private com.jobtracker.backend.dto.ResumeResponseDTO convertToDTO(Resume resume) {
        return com.jobtracker.backend.dto.ResumeResponseDTO.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .originalFileName(resume.getOriginalFileName())
                .fileUrl(resume.getFileUrl())
                .versionName(resume.getVersionName())
                .parsingStatus(resume.getParsingStatus())
                .extractedSkills(resume.getExtractedSkills())
                .qualityScore(resume.getQualityScore())
                .atsCompatibility(resume.getAtsCompatibility())
                .recommendations(resume.getRecommendations())
                .experienceCount(resume.getExperienceCount())
                .isPrimary(resume.isPrimary())
                .usageCount(jobApplicationRepository.countByResumeId(resume.getId()))
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    @Transactional
    public Resume updateResumeName(UUID resumeId, UUID userId, String versionName) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Verify ownership
        if (!resume.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        resume.setVersionName(versionName);
        return resumeRepository.save(resume);
    }

    @Transactional
    public void deleteResume(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Verify ownership
        if (!resume.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Delete file from storage
        try {
            storageService.delete(resume.getFileUrl());
        } catch (IOException e) {
            // Log error but continue with database deletion
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        // Delete from database
        resumeRepository.delete(resume);
    }

    public Resource loadAsResource(String fileUrl) throws IOException {
        return storageService.loadAsResource(fileUrl);
    }

    @Transactional
    public void setPrimaryResume(UUID resumeId, UUID userId) {
        // Reset all to false
        resumeRepository.resetPrimaryForUser(userId);

        // Set selected to true
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        resume.setPrimary(true);
        resumeRepository.save(resume);
    }
}
