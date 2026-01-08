package com.jobtracker.backend.service;

import com.jobtracker.backend.entity.Resume;
import com.jobtracker.backend.entity.ResumeEvent;
import com.jobtracker.backend.repository.ResumeRepository;
import com.jobtracker.backend.repository.ResumeEventRepository;
import com.jobtracker.backend.enums.ParsingStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AsyncParsingService {

    private final ResumeRepository resumeRepository;
    private final ResumeEventRepository eventRepository;

    @Async
    @Transactional
    public void parseResume(UUID resumeId) {
        log.info("Starting async parsing for resume: {}", resumeId);

        Optional<Resume> resumeOpt = resumeRepository.findById(resumeId);
        if (resumeOpt.isEmpty()) {
            log.error("Resume not found: {}", resumeId);
            return;
        }

        Resume resume = resumeOpt.get();
        logEvent(resume, "ANALYSIS_STARTED", "CV Analysis Started");

        resume.setParsingStatus(ParsingStatus.ANALYZING);
        resumeRepository.save(resume);

        try {
            File file = new File(resume.getFileUrl());
            if (!file.exists()) {
                throw new IOException("File not found at path: " + resume.getFileUrl());
            }

            // Extract Text
            try (PDDocument document = Loader.loadPDF(file)) {
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);
                resume.setParsedContent(text);

                // 1. Extract Skills
                String skills = extractSkills(text);
                resume.setExtractedSkills(skills);
                logEvent(resume, "SKILLS_EXTRACTED",
                        "Skills Extracted: " + (skills.isEmpty() ? "None detected" : "Detected"));

                // 2. Extract Experience Count (roles)
                int experienceCount = extractExperienceCount(text);
                resume.setExperienceCount(experienceCount);

                // 3. Calculate Quality Score
                int qualityScore = calculateQualityScore(text, skills, experienceCount);
                resume.setQualityScore(qualityScore);

                // 4. ATS Compatibility
                String atsComp = checkAtsCompatibility(text, file.length());
                resume.setAtsCompatibility(atsComp);

                // 5. Smart Recommendations
                String recommendations = generateRecommendations(text, experienceCount);
                resume.setRecommendations(recommendations);

                if (skills.isEmpty()) {
                    resume.setParsingStatus(ParsingStatus.NEEDS_REVIEW);
                    logEvent(resume, "NEEDS_REVIEW", "Analysis finished with warnings (no skills detected)");
                } else {
                    resume.setParsingStatus(ParsingStatus.READY);
                    logEvent(resume, "CV_READY", "CV Ready for use");
                }

                log.info("Successfully parsed resume: {}", resumeId);
            }

        } catch (Exception e) {
            log.error("Error parsing resume: {}", resumeId, e);
            resume.setParsingStatus(ParsingStatus.FAILED);
            logEvent(resume, "ANALYSIS_FAILED", "Analysis failed: " + e.getMessage());
        }

        resumeRepository.save(resume);
    }

    private void logEvent(Resume resume, String type, String desc) {
        eventRepository.save(ResumeEvent.builder()
                .resume(resume)
                .type(type)
                .description(desc)
                .build());
    }

    private int extractExperienceCount(String text) {
        // Look for common role headers or date ranges
        // Simple heuristic count of years/roles
        Pattern pattern = Pattern.compile("(19|20)\\d{2}\\s*[-–—]\\s*((19|20)\\d{2}|Present|Current)",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        int count = 0;
        while (matcher.find())
            count++;
        return count;
    }

    private int calculateQualityScore(String text, String skills, int expCount) {
        int score = 0;
        String lowerText = text.toLowerCase();

        // 1. Has skills section (+20)
        if (skills != null && !skills.isEmpty())
            score += 20;

        // 2. Has numbers/percentages (+20)
        if (text.matches(".*\\d+%.*") || text.matches(".*\\$\\d+.*"))
            score += 20;

        // 3. Experience > 2 roles (+20)
        if (expCount >= 2)
            score += 20;

        // 4. Action verbs (+20)
        List<String> actionVerbs = Arrays.asList("developed", "managed", "led", "architected", "implemented",
                "optimized", "increased", "reduced");
        for (String verb : actionVerbs) {
            if (lowerText.contains(verb)) {
                score += 20;
                break;
            }
        }

        // 5. Keyword density (+20) - simple check
        if (lowerText.length() > 500)
            score += 20;

        return Math.min(score, 100);
    }

    private String checkAtsCompatibility(String text, long fileSize) {
        if (text.length() < 200)
            return "LOW"; // Scanned PDF
        if (fileSize > 2 * 1024 * 1024)
            return "MEDIUM"; // Large file
        if (text.toLowerCase().contains("table"))
            return "MEDIUM"; // Found table markers (very naive)
        return "HIGH";
    }

    private String generateRecommendations(String text, int expCount) {
        List<String> recs = new ArrayList<>();

        // HIGH
        if (!text.matches(".*\\d+%.*")) {
            recs.add("HIGH: Add quantifiable achievements with percentages and numbers to show impact.");
        }

        // MEDIUM
        if (expCount < 2) {
            recs.add("MEDIUM: Expand your experience section to show more depth in your previous roles.");
        }

        if (text.length() < 1000) {
            recs.add("MEDIUM: Consider adding more detail to your project descriptions to improve keyword density.");
        }

        return String.join("\n", recs);
    }

    private String extractSkills(String text) {
        // Simple keyword matching for demo purposes
        // In a real NLP system, this would be much more sophisticated or call an
        // external API

        Set<String> foundedSkills = new HashSet<>();
        String lowerText = text.toLowerCase();

        // Common Tech Skills
        List<String> keywords = Arrays.asList(
                "java", "python", "javascript", "typescript", "react", "angular", "vue",
                "spring boot", "nodejs", "aws", "docker", "kubernetes", "sql", "mongodb",
                "postgresql", "redis", "git", "ci/cd", "agile", "scrum", "c++", "c#");

        for (String keyword : keywords) {
            // Check for whole word match to avoid false positives (e.g. "java" in
            // "javascript" is handled by order or regex)
            // Simple check:
            if (lowerText.contains(keyword)) {
                foundedSkills.add(keyword);
            }
        }

        return String.join(", ", foundedSkills);
    }
}
