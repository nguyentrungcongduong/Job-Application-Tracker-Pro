-- Test Users Init Script for Local Development
-- Run this manually in PostgreSQL or add to application startup

-- Insert test users (if they don't exist)
INSERT INTO users (id, name, email, password, role, enabled, onboarded, email_notifications_enabled, follow_up_enabled, follow_up_applying_days, follow_up_interview_days, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Test User', 'verified@example.com', '$2a$10$slYQmyNdGzin7olVVCQfe.HIpE9WzP6fU8oHRfUVdsKJ2Fgk.tgqm', 'BASIC', true, false, true, true, 3, 2, NOW(), NOW()),
    (gen_random_uuid(), 'Admin User', 'admin@jobtracker.com', '$2a$10$yOyZfvM4Nw.PZ0X.6RqKuuD4P0H9Y.XqKpqJOYu/UKWzDz7fC6D7m', 'ADMIN', true, true, true, true, 3, 2, NOW(), NOW()),
    (gen_random_uuid(), 'Unverified User', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUQVrP6oS2zfAXMRge', 'BASIC', false, false, true, true, 3, 2, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Passwords encoded (bcrypt):
-- verified@example.com = "Password@123"
-- admin@jobtracker.com = "AdminPass@123"
-- test@example.com = "Test@12345"
