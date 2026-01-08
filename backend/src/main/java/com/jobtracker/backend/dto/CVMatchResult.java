package com.jobtracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVMatchResult {
    private String resumeId;
    private String resumeName;
    private int matchScore; // 0-100
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private int experienceScore;
    private int skillScore;
    private int keywordScore;
}
