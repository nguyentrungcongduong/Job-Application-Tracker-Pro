package com.jobtracker.backend.dto;

import com.jobtracker.backend.enums.ParsingStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponseDTO {
    private UUID id;
    private String fileName;
    private String originalFileName;
    private String fileUrl;
    private String versionName;
    private ParsingStatus parsingStatus;
    private String extractedSkills;
    private Integer qualityScore;
    private String atsCompatibility;
    private String recommendations;
    private Integer experienceCount;
    private boolean isPrimary;
    private long usageCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
