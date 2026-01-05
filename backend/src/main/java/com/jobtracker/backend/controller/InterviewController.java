package com.jobtracker.backend.controller;

import com.jobtracker.backend.dto.InterviewDTO;
import com.jobtracker.backend.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService service;

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<InterviewDTO>> getByApplication(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(service.getInterviewsByApplication(applicationId));
    }

    @PostMapping
    public ResponseEntity<InterviewDTO> create(@RequestBody InterviewDTO dto) {
        return ResponseEntity.ok(service.createInterview(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
