package com.jobtracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SourcePerformanceDTO {
    private String source;
    private Long totalApplications;
    private Long offerCount;
    private Double offerProbability;
}
