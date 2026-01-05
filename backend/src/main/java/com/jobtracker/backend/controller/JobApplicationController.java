package com.jobtracker.backend.controller;

import com.jobtracker.backend.dto.JobApplicationDTO;
import com.jobtracker.backend.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService service;

    @GetMapping
    public ResponseEntity<List<JobApplicationDTO>> getAll() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PostMapping
    public ResponseEntity<JobApplicationDTO> create(@RequestBody JobApplicationDTO dto) {
        return ResponseEntity.ok(service.createApplication(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> update(@PathVariable UUID id, @RequestBody JobApplicationDTO dto) {
        return ResponseEntity.ok(service.updateApplication(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
