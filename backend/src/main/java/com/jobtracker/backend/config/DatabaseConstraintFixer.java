package com.jobtracker.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseConstraintFixer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixConstraints() {
        try {
            // 1. Drop the old check constraint that only knew about the old enum values
            jdbcTemplate.execute("ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_parsing_status_check");

            // 2. Migrate old enum values to new ones to avoid "No enum constant" errors
            jdbcTemplate.execute("UPDATE resumes SET parsing_status = 'UPLOADED' WHERE parsing_status = 'PENDING'");
            jdbcTemplate.execute("UPDATE resumes SET parsing_status = 'ANALYZING' WHERE parsing_status = 'PROCESSING'");
            jdbcTemplate.execute("UPDATE resumes SET parsing_status = 'READY' WHERE parsing_status = 'COMPLETED'");

            // 3. Fix is_primary column for existing data
            jdbcTemplate.execute("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false");
            jdbcTemplate.execute("UPDATE resumes SET is_primary = false WHERE is_primary IS NULL");

            // 4. Fix JobApplication status constraints and migrate data
            jdbcTemplate
                    .execute("ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_status_check");
            jdbcTemplate.execute("UPDATE job_applications SET status = 'OFFER_ACCEPTED' WHERE status = 'ACCEPTED'");

            // 5. Drop other enum constraints in case they were generated
            jdbcTemplate
                    .execute("ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_priority_check");
            jdbcTemplate
                    .execute("ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_source_check");

            // 6. Add missing reminder columns
            jdbcTemplate.execute(
                    "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false");
            jdbcTemplate.execute("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS interview_reminder TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE interviews ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false");
            jdbcTemplate.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false");

            // 7. Add follow_up_enabled column properly (handle existing data)
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS follow_up_enabled BOOLEAN");
            jdbcTemplate.execute("UPDATE users SET follow_up_enabled = true WHERE follow_up_enabled IS NULL");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN follow_up_enabled SET NOT NULL");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN follow_up_enabled SET DEFAULT true");

            // 8. Add follow-up days columns
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS follow_up_applying_days INTEGER");
            jdbcTemplate.execute("UPDATE users SET follow_up_applying_days = 3 WHERE follow_up_applying_days IS NULL");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN follow_up_applying_days SET DEFAULT 3");

            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS follow_up_interview_days INTEGER");
            jdbcTemplate
                    .execute("UPDATE users SET follow_up_interview_days = 2 WHERE follow_up_interview_days IS NULL");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN follow_up_interview_days SET DEFAULT 2");

            System.out.println("Successfully migrated database constraints, status values, and added missing columns.");
        } catch (Exception e) {
            System.err.println("Database fix failed: " + e.getMessage());
        }
    }
}
