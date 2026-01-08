package com.jobtracker.backend.repository;

import com.jobtracker.backend.entity.ResumeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResumeEventRepository extends JpaRepository<ResumeEvent, UUID> {
    List<ResumeEvent> findByResumeIdOrderByCreatedAtDesc(UUID resumeId);
}
