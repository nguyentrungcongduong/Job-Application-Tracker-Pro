package com.jobtracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StageConversionDTO {
    private String stageName;
    private Long count;
    private Double conversionRate; // % conversion to next stage
    private Long nextStageCount;
}
