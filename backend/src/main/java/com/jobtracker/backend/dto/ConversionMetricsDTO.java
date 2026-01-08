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
public class ConversionMetricsDTO {
    private List<StageConversionDTO> stages;
    private Double overallConversionRate; // From Applied to Offer
    private Long totalApplications;
    private Long totalOffers;
}
