ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS follow_up_applying_days INTEGER DEFAULT 3;
ALTER TABLE users ADD COLUMN IF NOT EXISTS follow_up_interview_days INTEGER DEFAULT 1;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS follow_up_sent BOOLEAN DEFAULT FALSE;

-- Drop obsolete check constraint on parsing_status to allow new enum values
ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_parsing_status_check;
