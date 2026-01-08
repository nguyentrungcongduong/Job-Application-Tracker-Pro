package com.jobtracker.backend.entity;

import com.jobtracker.backend.enums.ParsingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String fileUrl; // Can be a local path or S3 URL

    private String versionName; // e.g., "Backend Resume", "General CV"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ParsingStatus parsingStatus = ParsingStatus.UPLOADED;

    @Column(columnDefinition = "TEXT")
    private String parsedContent; // Raw text extracted

    @Column(columnDefinition = "TEXT")
    private String extractedSkills; // JSON or comma-separated list of skills

    private Integer qualityScore; // 0-100

    private String atsCompatibility; // LOW, MEDIUM, HIGH

    @Column(columnDefinition = "TEXT")
    private String recommendations; // JSON or newline-separated recommendations

    private Integer experienceCount; // Number of roles detected

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<ResumeEvent> events;

    @Builder.Default
    private boolean isPrimary = false;
}
