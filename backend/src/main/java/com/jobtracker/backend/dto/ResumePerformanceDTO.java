package com.jobtracker.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResumePerformanceDTO {
    private long totalApplications;
    private long interviews;
    private long offers;
    private double successRate;
}
