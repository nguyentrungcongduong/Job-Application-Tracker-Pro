package com.jobtracker.backend.controller;

import com.jobtracker.backend.entity.Resume;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.repository.ResumeRepository;
import com.jobtracker.backend.repository.UserRepository;
import com.jobtracker.backend.service.CVMatchingService;
import com.jobtracker.backend.service.ResumeService;
import com.jobtracker.backend.dto.CVMatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final CVMatchingService cvMatchingService;

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("versionName") String versionName) {
        try {
            // Get authenticated user from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Resume resume = resumeService.uploadResume(user.getId(), file, versionName);
            return ResponseEntity.ok(resume);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<com.jobtracker.backend.dto.ResumeResponseDTO>> getResumes() {
        // Get authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(resumeService.getUserResumes(user.getId()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Resume> updateResumeName(
            @PathVariable UUID id,
            @RequestParam("versionName") String versionName) {
        // Get authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeService.updateResumeName(id, user.getId(), versionName);
        return ResponseEntity.ok(resume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable UUID id) {
        // Get authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        resumeService.deleteResume(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/match")
    public ResponseEntity<List<CVMatchResult>> matchResumes(
            @RequestBody Map<String, String> payload) {
        String jobDescription = payload.get("jobDescription");

        // Get authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Resume> userResumes = resumeService.getUserResumeEntities(user.getId());
        return ResponseEntity.ok(cvMatchingService.calculateMatchForAllCVs(userResumes, jobDescription));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> downloadResume(@PathVariable UUID id) {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Resume resume = resumeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            // Verify ownership
            if (!resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }

            Resource resource = resumeService.loadAsResource(resume.getFileUrl());
            String contentType = "application/pdf"; // Assume PDF for now, or detect

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resume.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/performance")
    public ResponseEntity<com.jobtracker.backend.dto.ResumePerformanceDTO> getResumePerformance(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(resumeService.getResumePerformance(id));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<com.jobtracker.backend.dto.ResumeEventDTO>> getResumeEvents(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(resumeService.getResumeEvents(id));
    }

    @PutMapping("/{id}/primary")
    public ResponseEntity<Void> setPrimaryResume(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        resumeService.setPrimaryResume(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
