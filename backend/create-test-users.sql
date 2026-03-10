-- Test User Setup for Local Development
-- Passwords are bcrypt hashed:
-- verified@example.com / Password@123
-- admin@jobtracker.com / AdminPass@123  
-- test@example.com / Test@12345

BEGIN;

-- Clear existing test data (optional, comment out if you want to keep data)
DELETE FROM users WHERE email IN ('verified@example.com', 'admin@jobtracker.com', 'test@example.com');

-- Create test users
INSERT INTO users (id, name, email, password, role, enabled, onboarded, email_notifications_enabled, follow_up_enabled, follow_up_applying_days, follow_up_interview_days, created_at, updated_at)
VALUES 
    ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Test User', 'verified@example.com', '$2a$10$slYQmyNdGzin7olVVCQfe.HIpE9WzP6fU8oHRfUVdsKJ2Fgk.tgqm', 'BASIC', true, false, true, true, 3, 2, NOW(), NOW()),
    ('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Admin User', 'admin@jobtracker.com', '$2a$10$yOyZfvM4Nw.PZ0X.6RqKuuD4P0H9Y.XqKpqJOYu/UKWzDz7fC6D7m', 'ADMIN', true, true, true, true, 3, 2, NOW(), NOW()),
    ('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Unverified User', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUQVrP6oS2zfAXMRge', 'BASIC', false, false, true, true, 3, 2, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password,
    enabled = EXCLUDED.enabled,
    updated_at = NOW();

COMMIT;

-- Verify users created
SELECT email, role, enabled FROM users WHERE email IN ('verified@example.com', 'admin@jobtracker.com', 'test@example.com');
