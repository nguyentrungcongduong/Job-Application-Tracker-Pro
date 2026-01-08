package com.jobtracker.backend.controller;

import com.jobtracker.backend.dto.ConversionMetricsDTO;
import com.jobtracker.backend.dto.SourcePerformanceDTO;
import com.jobtracker.backend.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping("/conversion")
    public ResponseEntity<ConversionMetricsDTO> getConversionMetrics() {

        ConversionMetricsDTO metrics = metricsService.getStageConversionMetrics();

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/source-performance")
    public ResponseEntity<List<SourcePerformanceDTO>> getSourcePerformance() {
        return ResponseEntity.ok(metricsService.getSourcePerformanceMetrics());
    }
}
