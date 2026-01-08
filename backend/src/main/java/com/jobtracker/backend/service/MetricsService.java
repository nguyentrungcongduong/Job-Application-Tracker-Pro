package com.jobtracker.backend.service;

import com.jobtracker.backend.dto.ConversionMetricsDTO;
import com.jobtracker.backend.dto.SourcePerformanceDTO;
import com.jobtracker.backend.dto.StageConversionDTO;
import com.jobtracker.backend.entity.ApplicationSource;
import com.jobtracker.backend.entity.ApplicationStatus;
import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Define the standard conversion funnel stages in order
    private static final List<ApplicationStatus> FUNNEL_STAGES = Arrays.asList(
            ApplicationStatus.APPLIED,
            ApplicationStatus.HR_SCREEN,
            ApplicationStatus.INTERVIEW_1,
            ApplicationStatus.INTERVIEW_2,
            ApplicationStatus.OFFER_RECEIVED);

    public ConversionMetricsDTO getStageConversionMetrics() {
        User user = getCurrentUser();
        // Get all applications for the user
        List<JobApplication> applications = jobApplicationRepository.findByUser(user);

        // Count applications by status
        Map<ApplicationStatus, Long> statusCounts = applications.stream()
                .collect(Collectors.groupingBy(JobApplication::getStatus, Collectors.counting()));

        // Build conversion stages
        List<StageConversionDTO> stages = new ArrayList<>();

        for (int i = 0; i < FUNNEL_STAGES.size(); i++) {
            ApplicationStatus currentStatus = FUNNEL_STAGES.get(i);
            Long currentCount = statusCounts.getOrDefault(currentStatus, 0L);

            Double conversionRate = null;
            Long nextStageCount = null;

            // Calculate conversion rate to next stage
            if (i < FUNNEL_STAGES.size() - 1) {
                ApplicationStatus nextStatus = FUNNEL_STAGES.get(i + 1);
                nextStageCount = statusCounts.getOrDefault(nextStatus, 0L);

                if (currentCount > 0) {
                    conversionRate = (nextStageCount.doubleValue() / currentCount.doubleValue()) * 100;
                }
            }

            stages.add(StageConversionDTO.builder()
                    .stageName(formatStageName(currentStatus))
                    .count(currentCount)
                    .conversionRate(conversionRate)
                    .nextStageCount(nextStageCount)
                    .build());
        }

        // Calculate overall conversion rate (Applied to Offer)
        Long totalApplications = statusCounts.getOrDefault(ApplicationStatus.APPLIED, 0L);
        Long totalOffers = statusCounts.getOrDefault(ApplicationStatus.OFFER_RECEIVED, 0L);

        Double overallConversionRate = null;
        if (totalApplications > 0) {
            overallConversionRate = (totalOffers.doubleValue() / totalApplications.doubleValue()) * 100;
        }

        return ConversionMetricsDTO.builder()
                .stages(stages)
                .overallConversionRate(overallConversionRate)
                .totalApplications(totalApplications)
                .totalOffers(totalOffers)
                .build();
    }

    public List<SourcePerformanceDTO> getSourcePerformanceMetrics() {
        User user = getCurrentUser();
        List<JobApplication> applications = jobApplicationRepository.findByUser(user);

        // Group by source
        Map<ApplicationSource, List<JobApplication>> sourceGroups = applications.stream()
                .collect(Collectors.groupingBy(JobApplication::getSource));

        List<SourcePerformanceDTO> result = new ArrayList<>();

        for (ApplicationSource source : ApplicationSource.values()) {
            List<JobApplication> appsForSource = sourceGroups.getOrDefault(source, Collections.emptyList());
            long total = appsForSource.size();
            long offers = appsForSource.stream()
                    .filter(app -> app.getStatus() == ApplicationStatus.OFFER_RECEIVED
                            || app.getStatus() == ApplicationStatus.OFFER_ACCEPTED)
                    .count();

            double probability = total > 0 ? (offers * 100.0 / total) : 0.0;

            result.add(SourcePerformanceDTO.builder()
                    .source(formatSourceName(source))
                    .totalApplications(total)
                    .offerCount(offers)
                    .offerProbability(probability)
                    .build());
        }

        // Sort by probability descending
        result.sort((a, b) -> Double.compare(b.getOfferProbability(), a.getOfferProbability()));

        return result;
    }

    private String formatSourceName(ApplicationSource source) {
        switch (source) {
            case COMPANY_WEBSITE:
                return "Company Website";
            case LINKEDIN:
                return "LinkedIn";
            case INDEED:
                return "Indeed";
            case GLASSDOOR:
                return "Glassdoor";
            case REFERRAL:
                return "Referral";
            case RECRUITER:
                return "Recruiter";
            case OTHER:
                return "Other";
            default:
                return source.name();
        }
    }

    private String formatStageName(ApplicationStatus status) {
        switch (status) {
            case APPLIED:
                return "Applied";
            case HR_SCREEN:
                return "HR Screen";
            case INTERVIEW_1:
                return "Interview R1";
            case INTERVIEW_2:
                return "Interview R2";
            case OFFER_RECEIVED:
                return "Offer";
            default:
                return status.name();
        }
    }
}
