package com.jobtracker.backend.repository;

import com.jobtracker.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    List<Interview> findByApplicationId(UUID applicationId);

    List<Interview> findByApplicationUserId(UUID userId);

    List<Interview> findByInterviewDateBetweenAndReminderSentFalse(java.time.LocalDateTime start,
            java.time.LocalDateTime end);
}
