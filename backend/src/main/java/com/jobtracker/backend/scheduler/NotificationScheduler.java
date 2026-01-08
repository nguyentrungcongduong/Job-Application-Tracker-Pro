package com.jobtracker.backend.scheduler;

import com.jobtracker.backend.entity.ApplicationStatus;
import com.jobtracker.backend.entity.Interview;
import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.repository.InterviewRepository;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final NotificationService notificationService;

    // Check every day at 9 AM for follow-ups
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void checkFollowUpSuggestions() {
        log.info("Checking for follow-up suggestions...");

        List<ApplicationStatus> followUpStatuses = java.util.Arrays.asList(
                ApplicationStatus.APPLIED,
                ApplicationStatus.HR_SCREEN,
                ApplicationStatus.INTERVIEW_1,
                ApplicationStatus.INTERVIEW_2,
                ApplicationStatus.FINAL_INTERVIEW);

        List<JobApplication> candidates = jobApplicationRepository.findByFollowUpSentFalseAndStatusIn(followUpStatuses);

        for (JobApplication app : candidates) {
            try {
                var user = app.getUser();
                if (user == null || !user.isFollowUpEnabled())
                    continue;

                LocalDateTime lastAction = app.getUpdatedAt();
                if (lastAction == null) {
                    lastAction = app.getCreatedAt();
                }

                if (lastAction == null || lastAction.isAfter(LocalDateTime.now())) {
                    continue;
                }

                long daysSinceUpdate = ChronoUnit.DAYS.between(
                        lastAction.toLocalDate(),
                        LocalDateTime.now().toLocalDate());

                int requiredDays = 0;
                if (com.jobtracker.backend.entity.ApplicationStatus.APPLIED.equals(app.getStatus())) {
                    requiredDays = user.getFollowUpApplyingDays() != null ? user.getFollowUpApplyingDays() : 3;
                } else {
                    requiredDays = user.getFollowUpInterviewDays() != null ? user.getFollowUpInterviewDays() : 2;
                }

                if (daysSinceUpdate >= requiredDays) {
                    String title = "📧 Follow-up suggested: " + app.getCompanyName();
                    String content = String.format(
                            "It's been %d days since your last update for %s. Consider following up with the recruiter.",
                            daysSinceUpdate, app.getCompanyName());

                    notificationService.notify(user, "FOLLOW_UP", title, content);

                    app.setFollowUpSent(true);
                    jobApplicationRepository.save(app);

                    log.info("Follow-up notification sent for application {}", app.getId());
                }

            } catch (Exception e) {
                log.error("Error processing follow-up for application {}", app.getId(), e);
            }
        }
    }

    // Check every 15 minutes for reminders (target 1h before)
    @Scheduled(cron = "0 */15 * * * ?")
    @Transactional
    public void checkUpcomingInterviews() {
        LocalDateTime now = LocalDateTime.now();
        // Query window: 1h 15m to catch potential missed cycles
        LocalDateTime checkWindow = now.plusHours(1).plusMinutes(15);

        log.info("[Scheduler] Checking for upcoming reminders due before {}", checkWindow);

        // 1. Check Interview Entities
        List<Interview> upcomingInterviews = interviewRepository.findByInterviewDateBetweenAndReminderSentFalse(now,
                checkWindow);

        for (Interview interview : upcomingInterviews) {
            long minutesUntil = java.time.Duration.between(now, interview.getInterviewDate()).toMinutes();
            // Remind when within 45-75 minutes (roughly 1 hour before)
            if (minutesUntil >= 45 && minutesUntil <= 75) {
                processInterviewReminder(interview);
            }
        }

        // 2. Check JobApplication interviewReminder field
        List<JobApplication> pendingAppReminders = jobApplicationRepository
                .findByInterviewReminderBeforeAndReminderSentFalse(checkWindow);

        for (JobApplication app : pendingAppReminders) {
            // Skip if reminder is older than 24h
            if (app.getInterviewReminder().isBefore(now.minusHours(24))) {
                app.setReminderSent(true);
                jobApplicationRepository.save(app);
                continue;
            }

            long minutesUntil = java.time.Duration.between(now, app.getInterviewReminder()).toMinutes();
            // Remind when within 45-75 minutes
            if (minutesUntil >= 45 && minutesUntil <= 75) {
                processAppReminder(app);
            }
        }
    }

    private void processInterviewReminder(Interview interview) {
        try {
            var application = interview.getApplication();
            if (application == null || application.getUser() == null)
                return;

            String title = "⏰ Interview Reminder: " + application.getCompanyName();
            String content = String.format("You have an interview for %s position in less than an hour at %s.",
                    application.getPosition(),
                    interview.getInterviewDate().toLocalTime().toString().substring(0, 5));

            notificationService.notify(application.getUser(), "INTERVIEW_REMINDER", title, content);
            interview.setReminderSent(true);
            interviewRepository.save(interview);
            log.info("[Scheduler] Sent reminder for Interview {}", interview.getId());
        } catch (Exception e) {
            log.error("Error processing interview reminder", e);
        }
    }

    private void processAppReminder(JobApplication app) {
        try {
            if (app.getUser() == null)
                return;

            String title = "⏰ Interview Reminder: " + app.getCompanyName();
            String content = String.format("Upcoming interview reminder for %s position at %s.",
                    app.getPosition(), app.getCompanyName());

            notificationService.notify(app.getUser(), "INTERVIEW_REMINDER", title, content);
            app.setReminderSent(true);
            jobApplicationRepository.save(app);
            log.info("[Scheduler] Sent reminder for JobApplication {}", app.getId());
        } catch (Exception e) {
            log.error("Error processing application reminder", e);
        }
    }
}
