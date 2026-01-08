package com.jobtracker.backend.repository;

import com.jobtracker.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    List<Resume> findByUserId(UUID userId);

    @Modifying
    @Query("UPDATE Resume r SET r.isPrimary = false WHERE r.user.id = :userId")
    void resetPrimaryForUser(@Param("userId") UUID userId);
}
