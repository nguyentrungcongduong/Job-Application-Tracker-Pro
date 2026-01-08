package com.jobtracker.backend.dto;

import com.jobtracker.backend.entity.ApplicationSource;
import com.jobtracker.backend.entity.ApplicationStatus;
import com.jobtracker.backend.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationDTO {
    private UUID id;
    private String companyName;
    private String position;
    private ApplicationStatus status;
    private LocalDate appliedDate;
    private String jdLink;
    private ApplicationSource source;
    private Double salaryExpectation;
    private Priority priority;
    private List<String> tags;
    private String cvVersion;
    private String recruiterContact;
    private String notes;
    private Integer fitScore;
    private List<String> missingSkills;
    private String jdText;
    private Boolean followUpSent;
    private LocalDateTime interviewReminder;
}
