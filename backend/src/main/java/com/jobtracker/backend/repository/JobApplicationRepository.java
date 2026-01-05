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
}
