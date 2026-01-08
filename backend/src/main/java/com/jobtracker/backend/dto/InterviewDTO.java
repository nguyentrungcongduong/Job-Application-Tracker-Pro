package com.jobtracker.backend.dto;

import com.jobtracker.backend.entity.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewDTO {
    private UUID id;
    private UUID applicationId;
    private Integer round;
    private LocalDateTime interviewDate;
    private String interviewerName;
    private String interviewerTitle;
    private InterviewType type;
    private List<String> questions;
    private List<String> selfAnswers;
    private String feedback;
    private Integer confidenceScore;
    private Integer fitScore;
    private Boolean wantContinue;
    private Boolean reminderSent;
    private String notes;
}
