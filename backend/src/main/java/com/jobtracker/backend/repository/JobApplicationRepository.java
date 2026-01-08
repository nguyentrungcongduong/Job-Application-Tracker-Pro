package com.jobtracker.backend.repository;

import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
        List<JobApplication> findByUser(User user);

        List<JobApplication> findByUserId(UUID userId);

        List<JobApplication> findByUserIdOrderByCreatedAtDesc(UUID userId);

        List<JobApplication> findByUserAndCompanyNameIgnoreCaseAndPositionIgnoreCase(User user, String companyName,
                        String position);

        List<JobApplication> findByFollowUpSentFalseAndStatusIn(
                        java.util.Collection<com.jobtracker.backend.entity.ApplicationStatus> statuses);

        long countByResumeId(UUID resumeId);

        long countByResumeIdAndStatus(UUID resumeId, com.jobtracker.backend.entity.ApplicationStatus status);

        long countByResumeIdAndStatusIn(UUID resumeId,
                        java.util.Collection<com.jobtracker.backend.entity.ApplicationStatus> statuses);

        List<JobApplication> findByInterviewReminderBeforeAndReminderSentFalse(java.time.LocalDateTime time);
}
