package com.jobtracker.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ResumeEventDTO {
    private String type;
    private String description;
    private LocalDateTime createdAt;
}
